// pages/Admin/Admin.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaShoppingBag, FaImages } from "react-icons/fa";

import EventsManager from "../../components/admin/EventsManager";
import MerchManager from "../../components/admin/MerchManager";
import GalleryManager from "../../components/admin/GalleryManager";

function Admin() {
  const [activeSection, setActiveSection] = useState("events");

  const renderContent = () => {
    switch (activeSection) {
      case "events":
        return <EventsManager />;
      case "merch":
        return <MerchManager />;
      case "gallery":
        return <GalleryManager />;
      default:
        return <EventsManager />;
    }
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <HeaderTitle>Admin Dashboard</HeaderTitle>
      </AdminHeader>

      <AdminNav>
        <NavButton
          $active={activeSection === "events"}
          onClick={() => setActiveSection("events")}
        >
          <FaCalendarAlt />
          <span>Events</span>
        </NavButton>
        <NavButton
          $active={activeSection === "merch"}
          onClick={() => setActiveSection("merch")}
        >
          <FaShoppingBag />
          <span>Merch</span>
        </NavButton>
        <NavButton
          $active={activeSection === "gallery"}
          onClick={() => setActiveSection("gallery")}
        >
          <FaImages />
          <span>Gallery</span>
        </NavButton>
      </AdminNav>

      <ContentArea>{renderContent()}</ContentArea>
    </AdminContainer>
  );
}

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const AdminHeader = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AdminNav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.surface};
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 80px;
    flex-direction: column;
    padding: 90px 10px 20px;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    border-bottom: none;
  }
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? "white" : theme.colors.textPrimary};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;

  svg {
    font-size: 1.5rem;
  }

  span {
    font-size: 0.8rem;
    font-weight: 500;
  }

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.surfaceAlt};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    padding: 15px 10px;
  }
`;

const ContentArea = styled.main`
  padding: 140px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px 20px 20px 100px;
  }
`;

export default Admin;
