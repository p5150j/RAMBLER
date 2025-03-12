// components/Footer/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaTiktok,
} from "react-icons/fa";

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 40px 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 20px;
    font-size: 1.2rem;
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.5rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <h3>Rocky Mountain Rambler 500</h3>
          <p style={{ color: "#B0B0B0", marginBottom: "20px" }}>
            Where creativity meets the track. $3K budget racing at its finest.
          </p>
          <SocialLinks>
            <SocialLink
              href="https://www.facebook.com/share/15zCpQYa84"
              target="_blank"
              aria-label="Facebook"
            >
              <FaFacebook />
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/rockymountainrambler500/"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram />
            </SocialLink>
            {/* <SocialLink href="#" target="_blank" aria-label="YouTube">
              <FaYoutube />
            </SocialLink> */}
            <SocialLink
              href="https://www.tiktok.com/@rockymountainrambler500"
              target="_blank"
              aria-label="TikTok"
            >
              <FaTiktok />
            </SocialLink>
            {/* <SocialLink href="#" target="_blank" aria-label="Discord">
              <FaDiscord />
            </SocialLink> */}
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLink to="/events">Events</FooterLink>
          <FooterLink to="/gallery">Gallery</FooterLink>
          <FooterLink to="/merch">Merch</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Resources</h3>
          <FooterLink to="/rules">Race Rules</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/safety">Safety Guidelines</FooterLink>
          <FooterLink to="/sponsors">Sponsors</FooterLink>
        </FooterSection>

        <FooterSection>
          <h3>Contact Info</h3>
          <div style={{ color: "#B0B0B0" }}>
            <p>Rocky Mountains, CO</p>
            <p>Email: rockymountainrambler500@gmail.com</p>
            {/* <p>Tel: (555) 123-4567</p> */}
          </div>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>
          © {new Date().getFullYear()} Rocky Mountain Rambler 500. All rights
          reserved.
        </p>
      </Copyright>
    </FooterWrapper>
  );
}

export default Footer;
