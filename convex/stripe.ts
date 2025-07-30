import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { api } from "./_generated/api";
import Stripe from "stripe";
import { Id } from "./_generated/dataModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export const createCheckoutSession = action({
  args: {
    experienceId: v.id("experiences"),
    travelerId: v.id("users"),
    guestCount: v.number(),
    selectedDate: v.string(),
    experienceTitle: v.string(),
    pricePerPerson: v.number(),
    hostName: v.string(),
  },
  handler: async (ctx, args): Promise<{
    sessionId: string;
    sessionUrl: string | null;
    bookingId: Id<"bookings">;
  }> => {
    const {
      experienceId,
      travelerId,
      guestCount,
      selectedDate,
      experienceTitle,
      pricePerPerson,
      hostName,
    } = args;

    // Calculate total amount
    const totalAmount = pricePerPerson * guestCount;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: experienceTitle,
              description: `Cultural experience with ${hostName} on ${selectedDate} for ${guestCount} ${
                guestCount === 1 ? "person" : "people"
              }`,
            },
            unit_amount: Math.round(pricePerPerson * 100), // Convert to cents
          },
          quantity: guestCount,
        },
      ],
      metadata: {
        experienceId,
        travelerId,
        guestCount: guestCount.toString(),
        selectedDate,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/booking/cancel`,
    });

    // Create unpaid booking record
    const bookingId = await ctx.runMutation(api.bookings.createBooking, {
      experienceId,
      qtyPersons: guestCount,
      selectedDate,
      stripeSessionId: session.id,
      totalAmount,
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url,
      bookingId,
    };
  },
});

export const retrieveSession = action({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, { sessionId }) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return {
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      metadata: session.metadata,
    };
  },
});