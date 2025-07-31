import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import ApplicationApprovedEmail from "@/emails/application-approved";
import ApplicationRejectedEmail from "@/emails/application-rejected";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicantName, applicantEmail, status, feedback } = body;

    let emailResult;

    if (status === "approved") {
      emailResult = await sendEmail({
        to: applicantEmail,
        subject: "Welcome to Cultripia - Your Host Application is Approved!",
        react: React.createElement(ApplicationApprovedEmail, {
          applicantName: applicantName,
        }),
      });
    } else {
      emailResult = await sendEmail({
        to: applicantEmail,
        subject: "Update on Your Cultripia Host Application",
        react: React.createElement(ApplicationRejectedEmail, {
          applicantName: applicantName,
          feedback: feedback,
        }),
      });
    }

    if (!emailResult.success) {
      console.error(
        "Failed to send application status email:",
        emailResult.error,
      );
    }

    return NextResponse.json({
      success: emailResult.success,
    });
  } catch (error) {
    console.error("Error sending application status email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}
