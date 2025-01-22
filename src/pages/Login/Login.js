// pages/Login/Login.js
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../utils/userService";

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

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const returnTo = location.state?.returnTo || "/";
  const action = location.state?.action;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        // The login function returns the user credential
        const userCredential = await login(formData.email, formData.password);
        const user = userCredential.user; // Get the user from the credential

        // Handle post-login actions
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
            console.error("Post-login action error:", actionError);
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
        console.error("Login error:", error);
        let errorMessage = "Failed to log in";

        // Handle specific Firebase auth errors
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMessage = "Invalid email or password";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later";
            break;
          default:
            errorMessage = "Failed to log in. Please try again";
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
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthTitle>Welcome Back</AuthTitle>
        {action && (
          <p
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#B0B0B0",
            }}
          >
            {action === "register"
              ? "Sign in to register for this event"
              : "Sign in to add items to your cart"}
          </p>
        )}

        <AuthForm onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading || actionLoading}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          {errors.submit && <ErrorText>{errors.submit}</ErrorText>}

          <SubmitButton
            type="submit"
            disabled={isLoading || actionLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading
              ? "Signing in..."
              : actionLoading
              ? action === "register"
                ? "Registering..."
                : "Adding to cart..."
              : "Sign In"}
          </SubmitButton>
        </AuthForm>

        <AuthLink>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </AuthLink>
      </AuthCard>
    </AuthContainer>
  );
}

export default Login;
