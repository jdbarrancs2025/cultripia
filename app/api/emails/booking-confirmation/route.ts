import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import BookingConfirmationEmail from "@/emails/booking-confirmation";
import NewBookingNotification from "@/emails/new-booking-notification";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking, experience, traveler, host } = body;

    // Validate required data
    if (!booking || !experience || !traveler || !host) {
      console.error("Missing required data for booking confirmation email:", {
        hasBooking: !!booking,
        hasExperience: !!experience,
        hasTraveler: !!traveler,
        hasHost: !!host,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking data",
          details: {
            hasBooking: !!booking,
            hasExperience: !!experience,
            hasTraveler: !!traveler,
            hasHost: !!host,
          }
        },
        { status: 400 },
      );
    }

    // Validate email addresses
    if (!traveler.email || !host.email) {
      console.error("Missing email addresses:", {
        travelerEmail: traveler.email,
        hostEmail: host.email,
      });
      return NextResponse.json(
        { success: false, error: "Missing email addresses" },
        { status: 400 },
      );
    }

    // Format date
    const bookingDate = new Date(booking.selectedDate);
    const formattedDate = bookingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send confirmation email to traveler
    console.log("Sending booking confirmation email to traveler:", traveler.email);
    const confirmationEmailResult = await sendEmail({
      to: traveler.email,
      subject: `Booking Confirmed: ${experience.titleEn}`,
      react: React.createElement(BookingConfirmationEmail, {
        travelerName: traveler.name,
        experienceTitle: experience.titleEn,
        experienceDate: formattedDate,
        guestCount: booking.qtyPersons,
        totalAmount: booking.totalAmount,
        hostName: host.name,
        hostEmail: host.email,
        hostPhone: host.phone,
        location: experience.location,
        meetingPoint: experience.meetingPoint,
        bookingId: booking._id,
      }),
    });

    if (!confirmationEmailResult.success) {
      console.error(
        "Failed to send confirmation email to traveler:",
        traveler.email,
        "Error:",
        confirmationEmailResult.error,
      );
    } else {
      console.log("Successfully sent confirmation email to traveler:", traveler.email);
    }

    // Send notification email to host
    console.log("Sending booking notification email to host:", host.email);
    const hostNotificationResult = await sendEmail({
      to: host.email,
      subject: `New Booking: ${experience.titleEn}`,
      react: React.createElement(NewBookingNotification, {
        hostName: host.name,
        experienceTitle: experience.titleEn,
        experienceDate: formattedDate,
        guestCount: booking.qtyPersons,
        totalAmount: booking.totalAmount,
        travelerName: traveler.name,
        travelerEmail: traveler.email,
        bookingId: booking._id,
      }),
    });

    if (!hostNotificationResult.success) {
      console.error(
        "Failed to send host notification to:",
        host.email,
        "Error:",
        hostNotificationResult.error,
      );
    } else {
      console.log("Successfully sent notification email to host:", host.email);
    }

    console.log("Booking confirmation emails completed:", {
      confirmationSent: confirmationEmailResult.success,
      hostNotificationSent: hostNotificationResult.success,
    });

    return NextResponse.json({
      success: true,
      confirmationSent: confirmationEmailResult.success,
      hostNotificationSent: hostNotificationResult.success,
    });
  } catch (error) {
    console.error("Error sending booking emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails", details: String(error) },
      { status: 500 },
    );
  }
}
