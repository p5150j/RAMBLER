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
  font-family: "Racing Sans One", sans-serif;
  font-size: 1.5rem;
  color: ${({ theme, $scrolled }) =>
    $scrolled ? theme.colors.textPrimary : "white"};
  text-decoration: none;
  text-shadow: ${({ $scrolled }) =>
    $scrolled ? "none" : "0 2px 4px rgba(0,0,0,0.3)"};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
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
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

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
    <HeaderWrapper
      $scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Nav>
        <Logo
          to="/"
          $scrolled={scrolled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          RAMBLER 500
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <UserEmail>{currentUser.email}</UserEmail>
            </motion.div>
            <LogoutButton
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </LogoutButton>
          </UserInfo>
        ) : (
          <AuthButtons>
            <AuthButton
              to="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </AuthButton>
            <AuthButton
              to="/signup"
              $isPrimary
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </AuthButton>
          </AuthButtons>
        )}

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMobileMenuOpen ? "close" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.div>
          </AnimatePresence>
        </MobileMenuButton>
      </Nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* ... mobile menu content ... */}
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderWrapper>
  );
}

export default Header;
