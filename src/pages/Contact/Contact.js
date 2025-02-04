// pages/Contact/Contact.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ContactContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const MapHero = styled.div`
  height: 50vh;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
`;

const Map = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(100%) invert(92%);
`;

const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: 40px 20px;
    gap: 40px;
  }
`;

const FormSection = styled.div`
  .form-group {
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const InfoSection = styled.div`
  h2 {
    margin-bottom: 20px;
    font-size: 2rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 30px;
    line-height: 1.6;
  }
`;

const ContactInfo = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin-bottom: 15px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 10px;
  }
`;

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add form submission logic here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ContactContainer>
      <MapHero>
        <Map
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49878.86066862415!2d-105.20611552089843!3d38.74679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8714a8a600eb7c37%3A0x7c6c19a9c9c3f330!2sCripple%20Creek%2C%20CO!5e0!3m2!1sen!2sus!4v1707091183577!5m2!1sen!2sus"
          allowFullScreen=""
          loading="lazy"
        />
        <MapOverlay>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "3rem", marginBottom: "20px" }}
          >
            Get In Touch
          </motion.h1>
        </MapOverlay>
      </MapHero>

      <ContentSection>
        <InfoSection>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Let's Talk Racing</h2>
            <p>
              Whether you're interested in participating in our next event, have
              questions about the rules, or just want to connect with fellow
              budget racing enthusiasts, we'd love to hear from you.
            </p>

            <ContactInfo>
              <h3>Contact Information</h3>
              <p>📍 Cripple Creek, Colorado</p>
              <p>📧 rockymountainrambler500@gmail.com</p>
              {/* <p>📞 (555) 123-4567</p> */}
            </ContactInfo>
          </motion.div>
        </InfoSection>

        <FormSection>
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <TextArea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </SubmitButton>
          </motion.form>
        </FormSection>
      </ContentSection>
    </ContactContainer>
  );
}

export default Contact;
