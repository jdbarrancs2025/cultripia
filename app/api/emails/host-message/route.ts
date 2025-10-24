import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { parseBookingDate } from "@/lib/utils";
import HostMessageEmail from "@/emails/host-message";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking, experience, traveler, host, message } = body;

    // Validate required fields
    if (!booking || !experience || !traveler || !host || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format date
    const bookingDate = parseBookingDate(booking.selectedDate);
    const formattedDate = bookingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Send email to traveler
    const emailResult = await sendEmail({
      to: traveler.email,
      subject: `Message from your host - ${experience.titleEn}`,
      react: React.createElement(HostMessageEmail, {
        travelerName: traveler.name,
        hostName: host.name,
        hostEmail: host.email,
        experienceTitle: experience.titleEn,
        experienceDate: formattedDate,
        guestCount: booking.qtyPersons,
        bookingId: booking._id,
        message: message,
      }),
    });

    if (!emailResult.success) {
      console.error("Failed to send host message email:", emailResult.error);
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
    });
  } catch (error) {
    console.error("Error sending host message email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 }
    );
  }
}
