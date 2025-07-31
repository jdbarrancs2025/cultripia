import {
  Body,
  Button,
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

interface ApplicationApprovedProps {
  applicantName: string;
}

export const ApplicationApprovedEmail = ({
  applicantName,
}: ApplicationApprovedProps) => {
  const previewText = "Your host application has been approved!";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to the Cultripia Host Community!</Heading>

          <Text style={text}>Hi {applicantName},</Text>

          <Text style={text}>
            We&apos;re thrilled to inform you that your application to become a
            Cultripia host has been <strong>approved</strong>!
          </Text>

          <Text style={text}>
            You can now start creating and managing your cultural experiences on
            our platform. Here&apos;s what you can do next:
          </Text>

          <Section style={nextSteps}>
            <Text style={listItem}>• Create your first experience listing</Text>
            <Text style={listItem}>• Set up your availability calendar</Text>
            <Text style={listItem}>
              • Review our host guidelines and best practices
            </Text>
            <Text style={listItem}>
              • Start welcoming travelers from around the world!
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href="https://cultripia.com/host/dashboard">
              Go to Host Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            As a Cultripia host, you&apos;re now part of a community dedicated
            to sharing authentic cultural experiences. We&apos;re here to
            support you every step of the way.
          </Text>

          <Text style={text}>
            If you have any questions or need assistance, don&apos;t hesitate to
            reach out to our host support team.
          </Text>

          <Text style={footer}>
            Welcome aboard!
            <br />
            The Cultripia Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ApplicationApprovedEmail;

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

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px",
  padding: "0 48px",
};

const listItem = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 8px",
  padding: "0 48px",
};

const nextSteps = {
  margin: "24px 0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#009D9B",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 48px",
};

const footer = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0 0",
  padding: "0 48px",
};
