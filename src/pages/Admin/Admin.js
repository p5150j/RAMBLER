// pages/Admin/Admin.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import EventsManager from "../../components/admin/EventsManager";

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

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.surfaceAlt};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 20px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const MerchManager = () => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Title>Manage Merchandise</Title>
      <Button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        Add New Product
      </Button>
    </div>
    <Card>
      <h3>Active Products</h3>
      {/* Product list and management UI will go here */}
    </Card>
    <Card>
      <h3>Out of Stock</h3>
      {/* Out of stock products */}
    </Card>
  </div>
);

function Admin() {
  const [activeSection, setActiveSection] = useState("events");

  const renderContent = () => {
    switch (activeSection) {
      case "events":
        return <EventsManager />;
      case "merch":
        return <MerchManager />;
      default:
        return <EventsManager />;
    }
  };

  return (
    <AdminContainer>
      <AdminWrapper>
        <Sidebar>
          <NavItem
            $active={activeSection === "events"} // Change active to $active
            onClick={() => setActiveSection("events")}
          >
            Events
          </NavItem>
          <NavItem
            $active={activeSection === "merch"} // Change active to $active
            onClick={() => setActiveSection("merch")}
          >
            Merchandise
          </NavItem>
        </Sidebar>
        <MainContent>{renderContent()}</MainContent>
      </AdminWrapper>
    </AdminContainer>
  );
}

export default Admin;
