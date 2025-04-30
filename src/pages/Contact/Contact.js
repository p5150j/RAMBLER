// pages/Contact/Contact.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FaEnvelope,
  FaDiscord,
  FaInstagram,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa";

function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Rocky Mountain Rambler</title>
        <meta
          name="description"
          content="Get in touch with the Rocky Mountain Rambler team. Join our community in Cripple Creek, Colorado for automotive adventures and events."
        />
        <meta
          property="og:title"
          content="Contact Us - Rocky Mountain Rambler"
        />
        <meta
          property="og:description"
          content="Connect with the Rocky Mountain Rambler community. Find us in Cripple Creek, Colorado for automotive adventures and events."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rockymtnrambler.com/contact" />
        <meta
          property="og:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
      </Helmet>

      <ContactContainer>
        <MapHero>
          <Map
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49878.86066862415!2d-105.20611552089843!3d38.74679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8714a8a600eb7c37%3A0x7c6c19a9c9c3f330!2sCripple%20Creek%2C%20CO!5e0!3m2!1sen!2sus!4v1707091183577!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
          />
          <MapOverlay>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <LocationPin />
            </motion.div>
            <MapTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Join The Community
            </MapTitle>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <MapLocation>Cripple Creek, Colorado</MapLocation>
            </motion.div>
          </MapOverlay>
        </MapHero>

        <ContentSection>
          <ContactCards>
            <ContactCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardIcon>
                <FaEnvelope />
              </CardIcon>
              <CardTitle>Email Us</CardTitle>
              <CardDescription>
                Got questions about events or registration? Drop us a line!
              </CardDescription>
              <ContactButton
                as="a"
                href="mailto:rockymountainrambler500@gmail.com"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaEnvelope /> Email
              </ContactButton>
            </ContactCard>

            <ContactCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardIcon>
                <FaDiscord />
              </CardIcon>
              <CardTitle>Join Our Discord</CardTitle>
              <CardDescription>
                Connect with other racers, share tips, and stay updated on
                events.
              </CardDescription>
              <ContactButton
                as="a"
                href="#"
                target="_blank"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDiscord /> Join
              </ContactButton>
            </ContactCard>

            <ContactCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardIcon>
                <FaInstagram />
              </CardIcon>
              <CardTitle>Follow Us</CardTitle>
              <CardDescription>
                Check out photos and videos from our latest events.
              </CardDescription>
              <SocialButtons>
                <SocialButton
                  as="a"
                  href="https://www.instagram.com/rockymountainrambler500/"
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaInstagram />
                </SocialButton>
                <SocialButton
                  as="a"
                  href="https://www.facebook.com/share/15zCpQYa84"
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaFacebook />
                </SocialButton>
                <SocialButton
                  as="a"
                  href="https://www.tiktok.com/@rockymountainrambler500"
                  target="_blank"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTiktok />
                </SocialButton>
              </SocialButtons>
            </ContactCard>
          </ContactCards>

          <LocationInfo>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Based in Cripple Creek, Colorado
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Join us in the heart of the Rocky Mountains for exciting budget
              racing events.
            </motion.p>
          </LocationInfo>
        </ContentSection>
      </ContactContainer>
    </>
  );
}

const ContactContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const MapHero = styled.div`
  height: 49vh;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      ${({ theme }) => theme.colors.background} 100%
    );
    pointer-events: none;
  }
`;

const Map = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(100%) invert(92%) hue-rotate(180deg);
  transition: all 0.3s ease;

  &:hover {
    filter: grayscale(50%) invert(92%) hue-rotate(180deg);
  }
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const MapTitle = styled(motion.h1)`
  color: white;
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  padding: 0 20px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const LocationPin = styled(motion.div)`
  width: 20px;
  height: 20px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.colors.primary}40;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
`;

const MapLocation = styled.div`
  color: white;
  font-size: 1.2rem;
  background: ${({ theme }) => theme.colors.primary}80;
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const ContactCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const ContactCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 20px;
  line-height: 1.6;
`;

const ContactButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;

  svg {
    font-size: 1.2rem;
  }
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const SocialButton = styled(motion.a)`
  width: 45px;
  height: 45px;
  border-radius: 23px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  text-decoration: none;
`;

const LocationInfo = styled.div`
  text-align: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

export default Contact;
