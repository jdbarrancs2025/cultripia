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

interface HostMessageEmailProps {
  travelerName: string;
  hostName: string;
  hostEmail: string;
  experienceTitle: string;
  experienceDate: string;
  guestCount: number;
  bookingId: string;
  message: string;
}

export const HostMessageEmail = ({
  travelerName,
  hostName,
  hostEmail,
  experienceTitle,
  experienceDate,
  guestCount,
  bookingId,
  message,
}: HostMessageEmailProps) => {
  const previewText = `Message from your host ${hostName} about ${experienceTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Message from Your Host</Heading>

          <Text style={text}>Hi {travelerName},</Text>

          <Text style={text}>
            Your host <strong>{hostName}</strong> has sent you a message about
            your upcoming experience:
          </Text>

          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

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
              <strong>Booking ID:</strong> {bookingId}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading as="h2" style={h2}>
              Reply to Your Host
            </Heading>

            <Text style={text}>
              You can reply directly to your host by sending an email to:
            </Text>

            <Text style={detailRow}>
              <Link href={`mailto:${hostEmail}`} style={link}>
                {hostEmail}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            If you have any questions or concerns, feel free to contact your
            host directly using the email address provided above.
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

export default HostMessageEmail;

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

const messageBox = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  margin: "24px 48px",
  padding: "20px",
};

const messageText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
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
