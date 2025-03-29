// components/Header/Header.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const HeaderWrapper = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${({ theme, $scrolled }) =>
    $scrolled ? `${theme.colors.surface}ee` : "transparent"};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(10px)" : "none")};
  border-bottom: 1px solid
    ${({ theme, $scrolled }) =>
      $scrolled ? theme.colors.border : "transparent"};
  z-index: 1000;
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled(motion(Link))`
  display: flex;
  align-items: center;
  text-decoration: none;

  img {
    height: 55px;
    width: auto;
    filter: ${({ $scrolled }) => ($scrolled ? "none" : "brightness(1.2)")};
    transition: filter 0.3s ease;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(motion(Link))`
  color: ${({ theme, $scrolled, $isActive }) =>
    $isActive
      ? theme.colors.primary
      : $scrolled
      ? theme.colors.textPrimary
      : "white"};
  text-decoration: none;
  font-weight: 500;
  text-shadow: ${({ $scrolled }) =>
    $scrolled ? "none" : "0 2px 4px rgba(0,0,0,0.3)"};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme, $scrolled }) =>
    $scrolled ? theme.colors.textPrimary : "white"};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(10px);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  }
`;

const MobileNavLink = styled(NavLink)`
  display: block;
  padding: 10px 0;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  ${({ $isPrimary, theme }) =>
    $isPrimary
      ? `
    background: ${theme.colors.primary};
    color: ${theme.colors.textPrimary};
    &:hover {
      background: ${theme.colors.primaryDark};
    }
    `
      : `
    color: ${theme.colors.textPrimary};
    &:hover {
      color: ${theme.colors.primary};
    }
    `}
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const UserEmail = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderWrapper $scrolled={scrolled}>
      <Nav>
        <Logo
          to="/"
          $scrolled={scrolled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="./logo.png" alt="Rambler 500 Logo" />
        </Logo>

        <NavLinks>
          {["Home", "Events", "Gallery", "Merch", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              $isActive={isActive(
                item === "Home" ? "/" : `/${item.toLowerCase()}`
              )}
              $scrolled={scrolled}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {item}
            </NavLink>
          ))}
        </NavLinks>

        {currentUser ? (
          <UserInfo>
            <UserEmail>{currentUser.email}</UserEmail>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserInfo>
        ) : (
          <AuthButtons>
            <AuthButton to="/login">Login</AuthButton>
            <AuthButton to="/signup" $isPrimary>
              Sign Up
            </AuthButton>
          </AuthButtons>
        )}

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          $scrolled={scrolled}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>
      </Nav>

      <MobileMenu
        $isOpen={isMobileMenuOpen}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <MobileNavLink to="/" $isActive={isActive("/")}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/events" $isActive={isActive("/events")}>
          Events
        </MobileNavLink>
        <MobileNavLink to="/gallery" $isActive={isActive("/gallery")}>
          Gallery
        </MobileNavLink>
        <MobileNavLink to="/merch" $isActive={isActive("/merch")}>
          Merch
        </MobileNavLink>
        <MobileNavLink to="/contact" $isActive={isActive("/contact")}>
          Contact
        </MobileNavLink>
        {currentUser ? (
          <>
            <div style={{ padding: "10px 0", color: "#B0B0B0" }}>
              {currentUser.email}
            </div>
            <MobileNavLink
              as="button"
              onClick={handleLogout}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to="/login" $isActive={isActive("/login")}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/signup" $isActive={isActive("/signup")}>
              Sign Up
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </HeaderWrapper>
  );
}

export default Header;
