import React from 'react';
import {
  Html,
  Head,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationMail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <Preview>Email Verification</Preview>
      </Head>
      <Section style={styles.main}>
        <Row style={styles.row}>
          <Heading style={styles.heading}>Email Verification</Heading>
        </Row>
        <Row style={styles.row}>
          <Text style={styles.text}>Hello {username},</Text>
          <Text style={styles.text}>
            Please use the following OTP to verify your email address:
          </Text>
          <Text style={styles.otp}>{otp}</Text>
        </Row>
        <Row style={styles.row}>
          <Button style={styles.button} href="https://your-app-url.com/verify">
            Verify Email
          </Button>
        </Row>
        <Row style={styles.row}>
          <Text style={styles.text}>
            If you did not request this, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

const styles = {
  main: {
    backgroundColor: "#f4f4f4",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  row: {
    marginBottom: "20px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    color: "#555",
  },
  otp: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    margin: "20px 0",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
};
