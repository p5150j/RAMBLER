// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { HelmetProvider, Helmet } from "react-helmet-async";

import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Gallery from "./pages/Gallery/Gallery";
import Merch from "./pages/Merch/Merch";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Admin from "./pages/Admin/Admin";
import Register from "./pages/Register/Register";
import RegistrationSuccess from "./pages/Register/RegistrationSuccess";

// Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

// Theme
const theme = {
  colors: {
    background: "#121212",
    surface: "#1E1E1E",
    surfaceAlt: "#2A2A2A",
    primary: "#FF3E3E",
    primaryDark: "#CC3232",
    accent: "#FFB800",
    success: "#00C853",
    textPrimary: "#FFFFFF",
    textSecondary: "#B0B0B0",
    textMuted: "#808080",
    border: "#333333",
    borderLight: "#404040",
  },
  breakpoints: {
    mobile: "320px",
    tablet: "768px",
    desktop: "1024px",
  },
};

const AppWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MainContent = styled.main`
  min-height: calc(100vh - 160px); // Adjust based on header/footer height
  padding-top: 80px; // Height of fixed header
`;

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AppWrapper>
              <Helmet defaultTitle="Rocky Mountain Rambler">
                <meta
                  name="description"
                  content="Join the Rocky Mountain Rambler 500 - A unique automotive adventure combining car shows, adventure courses, and community events in the Rocky Mountains."
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Rocky Mountain Rambler" />
                <meta
                  property="og:description"
                  content="Join us for an unforgettable automotive adventure in the Rocky Mountains."
                />
                <meta property="og:url" content="https://rockymtnrambler.com" />
                <meta
                  property="og:image"
                  content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image" />
              </Helmet>
              <Header />
              <MainContent>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/merch" element={<Merch />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/registration-success"
                    element={<RegistrationSuccess />}
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MainContent>
              <Footer />
            </AppWrapper>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
