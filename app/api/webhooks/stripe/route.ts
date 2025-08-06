import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
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

        // Update booking payment status
        await convex.mutation(api.bookings.updateBookingPaymentStatus, {
          stripeSessionId: session.id,
          paid: true,
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
                body: JSON.stringify(bookingDetails),
              },
            );

            if (!emailResponse.ok) {
              console.error("Failed to send booking confirmation emails");
            }
          } catch (error) {
            console.error("Error calling email API:", error);
          }
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Session expired

        // Optionally clean up unpaid bookings
        // await convex.mutation(api.bookings.deleteUnpaidBooking, {
        //   stripeSessionId: session.id,
        // })

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
