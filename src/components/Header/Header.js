// components/Header/Header.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;
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

const Logo = styled(Link)`
  font-family: "Racing Sans One", sans-serif;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;

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

const NavLink = styled(Link)`
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.textPrimary};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
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
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
    <HeaderWrapper>
      <Nav>
        <Logo to="/">RAMBLER 500</Logo>

        <NavLinks>
          <NavLink to="/" $isActive={isActive("/")}>
            Home
          </NavLink>
          <NavLink to="/events" $isActive={isActive("/events")}>
            Events
          </NavLink>
          <NavLink to="/gallery" $isActive={isActive("/gallery")}>
            Gallery
          </NavLink>
          <NavLink to="/merch" $isActive={isActive("/merch")}>
            Merch
          </NavLink>
          <NavLink to="/contact" $isActive={isActive("/contact")}>
            Contact
          </NavLink>
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
        >
          ☰
        </MobileMenuButton>
      </Nav>

      <MobileMenu $isOpen={isMobileMenuOpen}>
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
