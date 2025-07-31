import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NewBookingNotificationProps {
  hostName: string;
  experienceTitle: string;
  experienceDate: string;
  guestCount: number;
  totalAmount: number;
  travelerName: string;
  travelerEmail: string;
  bookingId: string;
}

export const NewBookingNotification = ({
  hostName,
  experienceTitle,
  experienceDate,
  guestCount,
  totalAmount,
  travelerName,
  travelerEmail,
  bookingId,
}: NewBookingNotificationProps) => {
  const previewText = `New booking for ${experienceTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Booking Received!</Heading>

          <Text style={text}>Hi {hostName},</Text>

          <Text style={text}>
            Great news! You have a new booking for{" "}
            <strong>{experienceTitle}</strong>.
          </Text>

          <Section style={bookingDetails}>
            <Heading as="h2" style={h2}>
              Booking Details
            </Heading>

            <Text style={detailRow}>
              <strong>Experience:</strong> {experienceTitle}
            </Text>

            <Text style={detailRow}>
              <strong>Date:</strong> {experienceDate}
            </Text>

            <Text style={detailRow}>
              <strong>Number of guests:</strong> {guestCount}
            </Text>

            <Text style={detailRow}>
              <strong>Total amount:</strong> ${totalAmount.toFixed(2)} USD
            </Text>

            <Text style={detailRow}>
              <strong>Booking ID:</strong> {bookingId}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Guest Information
            </Heading>

            <Text style={detailRow}>
              <strong>Name:</strong> {travelerName}
            </Text>

            <Text style={detailRow}>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${travelerEmail}`} style={link}>
                {travelerEmail}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Please make sure to prepare for this experience and reach out to the
            guest if you need any additional information.
          </Text>

          <Text style={text}>
            You can view and manage all your bookings in your{" "}
            <Link href="https://cultripia.com/host/dashboard" style={link}>
              host dashboard
            </Link>
            .
          </Text>

          <Text style={footer}>
            Happy hosting!
            <br />
            The Cultripia Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewBookingNotification;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#009D9B",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
  padding: "0 48px",
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "32px",
  margin: "0 0 16px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px",
  padding: "0 48px",
};

const detailRow = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 8px",
  padding: "0 48px",
};

const bookingDetails = {
  margin: "32px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 48px",
};

const link = {
  color: "#009D9B",
  textDecoration: "underline",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
  padding: "0 48px",
};
