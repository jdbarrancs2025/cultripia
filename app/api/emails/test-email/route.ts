import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendEmail } from "@/lib/email";
import TestEmail from "@/emails/test-email";
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

    // Parse request body
    const body = await req.json();
    const { recipientEmail, recipientName } = body;

    if (!recipientEmail || !recipientName) {
      return NextResponse.json(
        { error: "Missing recipient email or name" },
        { status: 400 }
      );
    }

    // Send test email
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "America/Guatemala",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: "Test Email from Cultripia Admin Dashboard",
      react: React.createElement(TestEmail, {
        recipientName: recipientName,
        senderName: convexUser.name,
        timestamp: timestamp,
      }),
    });

    if (!emailResult.success) {
      console.error("Failed to send test email:", emailResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: emailResult.error || "Failed to send test email" 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${recipientEmail}`,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send test email" 
      },
      { status: 500 }
    );
  }
}