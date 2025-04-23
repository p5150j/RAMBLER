import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SuccessContainer = styled.div`
  max-width: 800px;
  margin: 60px auto;
  padding: 40px 20px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 20px;
  font-family: "Racing Sans One", "Poppins", sans-serif;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 30px;
  line-height: 1.6;
`;

const RegistrationInfo = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 30px;
  border-radius: 12px;
  margin: 30px 0;
  text-align: left;
`;

const InfoItem = styled.div`
  margin: 15px 0;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-right: 10px;
  }
`;

const Button = styled(motion(Link))`
  display: inline-block;
  padding: 15px 30px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  margin: 10px;
`;

const ReceiptButton = styled(motion.a)`
  display: inline-block;
  padding: 15px 30px;
  background: ${({ theme }) => theme.colors.success};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  margin: 10px;
`;

function RegistrationSuccess() {
  const location = useLocation();
  const { registrationId, receiptUrl } = location.state || {};

  if (!registrationId) {
    return (
      <>
        <Helmet>
          <title>Rocky Mountain Rambler 500 | Registration Success</title>
          <meta
            name="description"
            content="Thank you for registering for the Rocky Mountain Rambler 500! Your registration has been successfully processed. We look forward to seeing you at the event."
          />
          <meta
            property="og:title"
            content="Rocky Mountain Rambler 500 | Registration Success"
          />
          <meta
            property="og:description"
            content="Thank you for registering for the Rocky Mountain Rambler 500! Your registration has been successfully processed. We look forward to seeing you at the event."
          />
          <meta
            property="og:url"
            content="https://rockymountainrambler500.com/registration-success"
          />
          <meta
            property="twitter:title"
            content="Rocky Mountain Rambler 500 | Registration Success"
          />
          <meta
            property="twitter:description"
            content="Thank you for registering for the Rocky Mountain Rambler 500! Your registration has been successfully processed. We look forward to seeing you at the event."
          />
        </Helmet>
        <SuccessContainer>
          <Title>Page Not Found</Title>
          <Message>
            This page is only accessible after successful registration.
          </Message>
          <Button
            to="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now
          </Button>
        </SuccessContainer>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Rocky Mountain Rambler 500 | Registration Success</title>
        <meta
          name="description"
          content="Thank you for registering for the Rocky Mountain Rambler 500! Your registration has been successfully processed. We look forward to seeing you at the event."
        />
        <meta
          property="og:title"
          content="Rocky Mountain Rambler 500 | Registration Success"
        />
        <meta
          property="og:description"
          content="Thank you for registering for the Rocky Mountain Rambler 500! Your registration has been successfully processed. We look forward to seeing you at the event."
        />
        <meta
          property="og:url"
          content="https://rockymountainrambler500.com/registration-success"
        />
        <meta
          property="twitter:title"
          content="Rocky Mountain Rambler 500 | Registration Success"
        />
        <meta
          property="twitter:description"
          content="Thank you for registering for the Rocky Mountain Rambler 500! Your registration has been successfully processed. We look forward to seeing you at the event."
        />
      </Helmet>
      <SuccessContainer>
        <SuccessIcon>🏁</SuccessIcon>
        <Title>Registration Complete!</Title>
        <Message>
          Thank you for registering for the Rocky Mountain Rambler 500! We're
          excited to have you join us for this amazing event.
        </Message>

        <RegistrationInfo>
          <InfoItem>
            <strong>Registration ID:</strong> {registrationId}
          </InfoItem>
          <InfoItem>
            <strong>Important:</strong> Please save your registration ID for
            future reference.
          </InfoItem>
        </RegistrationInfo>

        <Message>
          You will receive a confirmation email shortly with all the event
          details. If you have any questions, please don't hesitate to contact
          us.
        </Message>

        <div>
          <Button
            to="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Return Home
          </Button>

          {receiptUrl && (
            <ReceiptButton
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Receipt
            </ReceiptButton>
          )}
        </div>
      </SuccessContainer>
    </>
  );
}

export default RegistrationSuccess;
