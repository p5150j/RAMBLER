// pages/Signup/Signup.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../utils/userService";
import styled from "styled-components";
import { motion } from "framer-motion";
import WaiverModal from "../../components/WaiverModal";
import { Helmet } from "react-helmet-async";

import {
  AuthContainer,
  AuthCard,
  AuthTitle,
  AuthForm,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  ErrorText,
  AuthLink,
} from "../../components/auth/AuthStyles";

const CheckboxContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: start;
  gap: 10px;
`;

const Checkbox = styled.input`
  margin-top: 4px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
`;

const WaiverLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const returnTo = location.state?.returnTo || "/";
  const action = location.state?.action;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showWaiver, setShowWaiver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and waiver to continue";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // Create the user account
        const userCredential = await signup(formData.email, formData.password);
        const user = userCredential.user;

        // Initialize user document in Firestore
        await userService.initializeUser(user.uid, {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          registeredEvents: [],
          orders: [],
          agreedToTerms: true,
          agreedToTermsAt: new Date().toISOString(),
        });

        // Handle post-signup actions
        if (action) {
          setActionLoading(true);
          try {
            if (action === "register" && location.state?.eventId) {
              await userService.registerForEvent(
                user.uid,
                location.state.eventId
              );
            } else if (action === "addToCart" && location.state?.productId) {
              await userService.addToCart(user.uid, {
                productId: location.state.productId,
                size: location.state.size,
                quantity: 1,
                addedAt: new Date().toISOString(),
              });
            }
          } catch (actionError) {
            console.error("Post-signup action error:", actionError);
            setErrors({
              submit:
                action === "register"
                  ? "Failed to register for event"
                  : "Failed to add item to cart",
            });
            return;
          } finally {
            setActionLoading(false);
          }
        }

        navigate(returnTo);
      } catch (error) {
        console.error("Signup error:", error);
        let errorMessage = "Failed to create account";

        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Email is already registered";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Account creation is currently disabled";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak";
            break;
          default:
            errorMessage = "Failed to create account. Please try again";
        }

        setErrors({ submit: errorMessage });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Helmet>
        <title>Rocky Mountain Rambler 500 | Sign Up</title>
        <meta
          name="description"
          content="Create your Rocky Mountain Rambler 500 account to register for events, purchase merchandise, and join the ultimate beater car racing community."
        />
        <meta
          property="og:title"
          content="Rocky Mountain Rambler 500 | Sign Up"
        />
        <meta
          property="og:description"
          content="Create your Rocky Mountain Rambler 500 account to register for events, purchase merchandise, and join the ultimate beater car racing community."
        />
        <meta property="og:url" content="https://rockymtnrambler.com/signup" />
        <meta
          property="og:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
        <meta
          property="twitter:title"
          content="Rocky Mountain Rambler 500 | Sign Up"
        />
        <meta
          property="twitter:description"
          content="Create your Rocky Mountain Rambler 500 account to register for events, purchase merchandise, and join the ultimate beater car racing community."
        />
        <meta
          property="twitter:url"
          content="https://rockymtnrambler.com/signup"
        />
        <meta
          name="twitter:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
      </Helmet>
      <AuthContainer>
        <AuthCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AuthTitle>Create Account</AuthTitle>
          {action && (
            <p
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#B0B0B0",
              }}
            >
              {action === "register"
                ? "Sign up to register for this event"
                : "Sign up to add items to your cart"}
            </p>
          )}

          <AuthForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={isLoading || actionLoading}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={isLoading || actionLoading}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                disabled={isLoading || actionLoading}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isLoading || actionLoading}
              />
              {errors.confirmPassword && (
                <ErrorText>{errors.confirmPassword}</ErrorText>
              )}
            </FormGroup>

            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading || actionLoading}
              />
              <CheckboxLabel htmlFor="terms">
                I have read and agree to the{" "}
                <WaiverLink type="button" onClick={() => setShowWaiver(true)}>
                  terms and waiver
                </WaiverLink>
              </CheckboxLabel>
            </CheckboxContainer>
            {errors.terms && <ErrorText>{errors.terms}</ErrorText>}

            {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

            <SubmitButton
              type="submit"
              disabled={isLoading || actionLoading || !agreedToTerms}
              whileHover={{ scale: agreedToTerms ? 1.02 : 1 }}
              whileTap={{ scale: agreedToTerms ? 0.98 : 1 }}
            >
              {isLoading
                ? "Creating account..."
                : actionLoading
                ? action === "register"
                  ? "Registering..."
                  : "Adding to cart..."
                : "Create Account"}
            </SubmitButton>
          </AuthForm>

          <AuthLink>
            Already have an account? <Link to="/login">Sign In</Link>
          </AuthLink>
        </AuthCard>

        <WaiverModal isOpen={showWaiver} onClose={() => setShowWaiver(false)} />
      </AuthContainer>
    </>
  );
}

export default Signup;
