import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  // In development, if webhook secret is not configured, parse the event directly
  if (
    webhookSecret === "whsec_test_secret" &&
    process.env.NODE_ENV === "development"
  ) {
    console.warn(
      "⚠️  Using insecure webhook handling for development. Configure STRIPE_WEBHOOK_SECRET for production!",
    );
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err) {
      console.error("Failed to parse webhook body:", err);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Payment successful for session:", session.id);

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

        console.log("Session expired:", session.id);

        // Optionally clean up unpaid bookings
        // await convex.mutation(api.bookings.deleteUnpaidBooking, {
        //   stripeSessionId: session.id,
        // })

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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
