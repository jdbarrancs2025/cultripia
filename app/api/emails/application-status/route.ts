import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendEmail } from "@/lib/email";
import ApplicationApprovedEmail from "@/emails/application-approved";
import ApplicationRejectedEmail from "@/emails/application-rejected";
import React from "react";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from Convex and check admin role
    const convexUser = await convex.query(api.users.getUserByClerkId, {
      clerkId: userId,
    });

    if (!convexUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    if (convexUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Proceed with email sending - admin authorized
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
