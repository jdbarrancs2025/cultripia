import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey && !stripeKey.includes("placeholder") 
  ? new Stripe(stripeKey, { apiVersion: "2025-06-30.basil" })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // Check if Stripe is configured
  if (!stripe) {
    console.warn("Stripe webhook called but STRIPE_SECRET_KEY not configured");
    return NextResponse.json(
      { error: "Payment processing not configured" },
      { status: 503 },
    );
  }
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  // Validate webhook secret is configured
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Payment successful for session
        
        // Extract booking details from session metadata
        const metadata = session.metadata;
        
        if (!metadata || !metadata.experienceId || !metadata.travelerId) {
          console.error("Missing required metadata in Stripe session");
          return NextResponse.json(
            { error: "Missing metadata" },
            { status: 400 },
          );
        }

        // Create the booking after successful payment
        const bookingId = await convex.mutation(api.bookings.createBookingFromSession, {
          experienceId: metadata.experienceId as any,
          travelerId: metadata.travelerId as any,
          qtyPersons: parseInt(metadata.guestCount || "1"),
          selectedDate: metadata.selectedDate || "",
          stripeSessionId: session.id,
          totalAmount: parseFloat(metadata.totalAmount || "0"),
        });

        // Get booking details for email
        const bookingDetails = await convex.query(api.bookings.getBySessionId, {
          sessionId: session.id,
        });

        if (
          bookingDetails &&
          bookingDetails.experience &&
          bookingDetails.traveler &&
          bookingDetails.host
        ) {
          // Send confirmation emails via API route
          try {
            const emailResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/emails/booking-confirmation`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  booking: bookingDetails,
                  experience: bookingDetails.experience,
                  traveler: bookingDetails.traveler,
                  host: bookingDetails.host,
                }),
              },
            );

            if (!emailResponse.ok) {
              const errorText = await emailResponse.text();
              console.error("Failed to send booking confirmation emails:", emailResponse.status, errorText);
            } else {
              console.log("Booking confirmation emails sent successfully for session:", session.id);
            }
          } catch (error) {
            console.error("Error calling email API:", error);
          }
        } else {
          console.warn("Incomplete booking details, cannot send emails:", {
            hasBooking: !!bookingDetails,
            hasExperience: !!bookingDetails?.experience,
            hasTraveler: !!bookingDetails?.traveler,
            hasHost: !!bookingDetails?.host,
          });
        }

        break;
      }

      case "checkout.session.expired": {
        // Session expired - no booking to clean up since we don't create bookings until payment
        console.log("Checkout session expired:", event.data.object);
        break;
      }

      default:
        // Unhandled event type
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
