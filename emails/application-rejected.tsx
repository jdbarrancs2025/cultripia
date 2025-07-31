import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ApplicationRejectedProps {
  applicantName: string;
  feedback?: string;
}

export const ApplicationRejectedEmail = ({
  applicantName,
  feedback,
}: ApplicationRejectedProps) => {
  const previewText = "Update on your host application";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Host Application Update</Heading>

          <Text style={text}>Hi {applicantName},</Text>

          <Text style={text}>
            Thank you for your interest in becoming a Cultripia host. After
            careful review of your application, we regret to inform you that we
            are unable to approve your application at this time.
          </Text>

          {feedback && (
            <Section style={feedbackSection}>
              <Heading as="h2" style={h2}>
                Feedback from our team:
              </Heading>
              <Text style={feedbackText}>{feedback}</Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>
            We encourage you to consider the feedback provided and welcome you
            to reapply in the future once you&apos;ve addressed any concerns
            mentioned.
          </Text>

          <Text style={text}>
            In the meantime, we invite you to continue exploring Cultripia as a
            traveler and experience the wonderful cultural activities our hosts
            have to offer.
          </Text>

          <Text style={text}>
            If you have any questions about this decision or would like
            additional clarification, please don&apos;t hesitate to contact our
            support team.
          </Text>

          <Text style={footer}>
            Thank you for your understanding.
            <br />
            The Cultripia Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ApplicationRejectedEmail;

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
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "28px",
  margin: "0 0 12px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px",
  padding: "0 48px",
};

const feedbackSection = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 48px",
  padding: "20px",
};

const feedbackText = {
  color: "#555",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0",
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
