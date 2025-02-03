// pages/Admin/Admin.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

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
      <AdminWrapper>
        <Sidebar>
          <NavItem
            $active={activeSection === "events"}
            onClick={() => setActiveSection("events")}
          >
            Events
          </NavItem>
          <NavItem
            $active={activeSection === "merch"}
            onClick={() => setActiveSection("merch")}
          >
            Merchandise
          </NavItem>
          <NavItem
            $active={activeSection === "gallery"}
            onClick={() => setActiveSection("gallery")}
          >
            Gallery
          </NavItem>
        </Sidebar>
        <MainContent>{renderContent()}</MainContent>
      </AdminWrapper>
    </AdminContainer>
  );
}

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 100px 20px 40px;
`;

const AdminWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const MainContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 30px;
`;

const NavItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? "white" : theme.colors.textPrimary};
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.surfaceAlt};
  }

  &::before {
    content: ${({ $active }) => ($active ? '"→"' : '""')};
    font-family: monospace;
  }
`;

export default Admin;
