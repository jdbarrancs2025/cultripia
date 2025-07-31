import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import BookingConfirmationEmail from "@/emails/booking-confirmation";
import NewBookingNotification from "@/emails/new-booking-notification";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking, experience, traveler, host } = body;

    // Format date
    const bookingDate = new Date(booking.selectedDate);
    const formattedDate = bookingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send confirmation email to traveler
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
        "Failed to send confirmation email:",
        confirmationEmailResult.error,
      );
    }

    // Send notification email to host
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
        "Failed to send host notification:",
        hostNotificationResult.error,
      );
    }

    return NextResponse.json({
      success: true,
      confirmationSent: confirmationEmailResult.success,
      hostNotificationSent: hostNotificationResult.success,
    });
  } catch (error) {
    console.error("Error sending booking emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 500 },
    );
  }
}
