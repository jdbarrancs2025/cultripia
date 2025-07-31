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

interface BookingConfirmationEmailProps {
  travelerName: string;
  experienceTitle: string;
  experienceDate: string;
  guestCount: number;
  totalAmount: number;
  hostName: string;
  hostEmail: string;
  hostPhone?: string;
  location: string;
  meetingPoint?: string;
  bookingId: string;
}

export const BookingConfirmationEmail = ({
  travelerName,
  experienceTitle,
  experienceDate,
  guestCount,
  totalAmount,
  hostName,
  hostEmail,
  hostPhone,
  location,
  meetingPoint,
  bookingId,
}: BookingConfirmationEmailProps) => {
  const previewText = `Booking confirmed for ${experienceTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmation</Heading>

          <Text style={text}>Hi {travelerName},</Text>

          <Text style={text}>
            Great news! Your booking for <strong>{experienceTitle}</strong> has
            been confirmed.
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
              <strong>Total paid:</strong> ${totalAmount.toFixed(2)} USD
            </Text>

            <Text style={detailRow}>
              <strong>Location:</strong> {location}
            </Text>

            {meetingPoint && (
              <Text style={detailRow}>
                <strong>Meeting point:</strong> {meetingPoint}
              </Text>
            )}

            <Text style={detailRow}>
              <strong>Booking ID:</strong> {bookingId}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Your Host
            </Heading>

            <Text style={detailRow}>
              <strong>Name:</strong> {hostName}
            </Text>

            <Text style={detailRow}>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${hostEmail}`} style={link}>
                {hostEmail}
              </Link>
            </Text>

            {hostPhone && (
              <Text style={detailRow}>
                <strong>Phone:</strong> {hostPhone}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Please save this email for your records. Present your booking ID to
            your host at the meeting point on the day of your experience.
          </Text>

          <Text style={text}>
            If you have any questions, feel free to contact your host directly
            using the contact information provided above.
          </Text>

          <Text style={footer}>
            Thank you for choosing Cultripia!
            <br />
            The Cultripia Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

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
