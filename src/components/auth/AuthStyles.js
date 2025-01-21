// components/auth/AuthStyles.js
import styled from "styled-components";
import { motion } from "framer-motion";

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start; // Changed from center to flex-start
  justify-content: center;
  padding: 20px 20px 40px; // Adjusted padding (accounts for the header height)
  background: ${({ theme }) => theme.colors.background};
`;

export const AuthCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const AuthTitle = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export const Input = styled.input`
  padding: 12px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SubmitButton = styled(motion.button)`
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
`;

export const AuthLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SocialButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;
