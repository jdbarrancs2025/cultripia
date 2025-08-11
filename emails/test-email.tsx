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

interface TestEmailProps {
  recipientName: string;
  senderName: string;
  timestamp: string;
}

export const TestEmail = ({
  recipientName,
  senderName,
  timestamp,
}: TestEmailProps) => {
  const previewText = `Test email from Cultripia Admin`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Test Email from Cultripia</Heading>
          
          <Text style={text}>
            Hello {recipientName},
          </Text>
          
          <Text style={text}>
            This is a test email sent from the Cultripia admin dashboard to verify 
            that our email system is working correctly.
          </Text>

          <Section style={infoSection}>
            <Text style={infoText}>
              <strong>Sent by:</strong> {senderName} (Admin)
            </Text>
            <Text style={infoText}>
              <strong>Sent at:</strong> {timestamp}
            </Text>
            <Text style={infoText}>
              <strong>Purpose:</strong> Email system test
            </Text>
          </Section>

          <Text style={text}>
            If you received this email, it means our email service is functioning 
            properly. No action is required on your part.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated test message from{" "}
            <Link href="https://cultripia.com" style={link}>
              Cultripia
            </Link>
            {" "}• Your cultural experiences marketplace
          </Text>
          
          <Text style={footerSmall}>
            © {new Date().getFullYear()} Cultripia. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "30px",
  borderRadius: "5px",
  maxWidth: "600px",
};

const h1 = {
  color: "#009D9B",
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const infoSection = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "20px",
  marginBottom: "20px",
};

const infoText = {
  color: "#525252",
  fontSize: "14px",
  lineHeight: "20px",
  marginBottom: "8px",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "30px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "20px",
};

const footerSmall = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "10px",
};

const link = {
  color: "#009D9B",
  textDecoration: "none",
};

export default TestEmail;