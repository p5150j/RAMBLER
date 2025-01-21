// pages/Events/Events.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const EventsContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const FeaturedEvent = styled.div`
  position: relative;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  margin-bottom: 60px;
`;

const FeaturedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("https://images.unsplash.com/photo-1618312980084-67efa94d67b6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  filter: brightness(0.3);

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${({ theme }) => theme.colors.background}
    );
  }
`;

const FeaturedContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
`;

const EventCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EventImage = styled.div`
  height: 200px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const EventContent = styled.div`
  padding: 20px;
`;

const EventStatus = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 12px;

  ${({ $status, theme }) =>
    $status === "active"
      ? `
        background: ${theme.colors.primary}33;
        color: ${theme.colors.primary};
      `
      : `
        background: ${theme.colors.textMuted}33;
        color: ${theme.colors.textMuted};
      `}
`;

const EventDate = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 8px;
`;

const EventModal = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  z-index: 1000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
`;

const RegisterButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

// Sample event data
const events = [
  {
    id: 1,
    title: "Summer Rambler 500",
    date: "July 15, 2025",
    location: "Rocky Mountains, CO",
    image:
      "https://images.unsplash.com/photo-1618312980084-67efa94d67b6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "active",
    price: "$250",
    description:
      "Trust fund readymade flexitarian fashion axe roof party post-ironic hoodie enamel pin ramps ethical ascot 90's shaman. Pickled taiyaki aesthetic, microdosing narwhal hammock hexagon shabby chic.",
    details:
      "Pork belly schlitz keytar kickstarter church-key neutra lumbersexual dreamcatcher street art banh mi tattooed mixtape ennui kogi master cleanse. Trust fund readymade flexitarian fashion axe.",
    capacity: "50 teams",
    requirements:
      "Vehicle under $3,000, valid driver's license, safety equipment",
  },
  {
    id: 2,
    title: "Winter Challenge",
    date: "December 10, 2025",
    location: "Aspen, CO",
    image:
      "https://plus.unsplash.com/premium_photo-1683140866854-fc31cf78e4e4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dß",
    status: "active",
    price: "$300",
    description:
      "DIY trust fund hexagon vexillologist pickled fit gentrify listicle fashion axe wayfarers hella pok pok yes plz man braid whatever.",
    details:
      "Meditation everyday carry cloud bread, tilde VHS sus offal disrupt blue bottle biodiesel normcore.",
    capacity: "30 teams",
    requirements:
      "Winter-ready vehicle under $3,000, snow chains, emergency kit",
  },
  {
    id: 3,
    title: "Spring Desert Run",
    date: "March 5, 2025",
    location: "Moab, UT",
    image:
      "https://images.unsplash.com/photo-1676018368021-195887b8bf5c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    status: "past",
    price: "$200",
    description:
      "Selvage hexagon lo-fi, portland craft beer gastropub copper mug occupy swag etsy iPhone coloring book hella trust fund chia.",
    details:
      "Listicle bushwick tumblr health goth Brooklyn raw denim. Neutral milk hotel +1 chicharrones coloring book.",
    capacity: "40 teams",
    requirements: "Desert-ready vehicle under $3,000, extra water, GPS",
  },
];

const featuredEvent = events[0]; // Using first event as featured

function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <EventsContainer>
      <FeaturedEvent>
        <FeaturedBackground />
        <FeaturedContent>
          <EventStatus $status="active">Featured Event</EventStatus>
          <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
            {featuredEvent.title}
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
            {featuredEvent.description}
          </p>
          <RegisterButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedEvent(featuredEvent)}
          >
            Register Now
          </RegisterButton>
        </FeaturedContent>
      </FeaturedEvent>

      <EventsGrid>
        {events.map((event) => (
          <EventCard
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EventImage src={event.image} />
            <EventContent>
              <EventStatus $status={event.status}>
                {event.status === "active" ? "Registration Open" : "Past Event"}
              </EventStatus>
              <EventDate>{event.date}</EventDate>
              <h3 style={{ marginBottom: "10px" }}>{event.title}</h3>
              <p style={{ color: "#B0B0B0", marginBottom: "10px" }}>
                {event.location}
              </p>
              <p style={{ color: "#B0B0B0" }}>Starting at {event.price}</p>
            </EventContent>
          </EventCard>
        ))}
      </EventsGrid>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30 }}
          >
            <ModalContent>
              <ModalHeader>
                <div>
                  <EventStatus $status={selectedEvent.status}>
                    {selectedEvent.status === "active"
                      ? "Registration Open"
                      : "Past Event"}
                  </EventStatus>
                  <h2 style={{ marginBottom: "10px" }}>
                    {selectedEvent.title}
                  </h2>
                  <EventDate>{selectedEvent.date}</EventDate>
                </div>
                <ModalClose onClick={() => setSelectedEvent(null)}>
                  ×
                </ModalClose>
              </ModalHeader>

              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>Event Details</h3>
                <p style={{ color: "#B0B0B0", marginBottom: "20px" }}>
                  {selectedEvent.details}
                </p>

                <h3 style={{ marginBottom: "10px" }}>Location</h3>
                <p style={{ color: "#B0B0B0", marginBottom: "20px" }}>
                  {selectedEvent.location}
                </p>

                <h3 style={{ marginBottom: "10px" }}>Capacity</h3>
                <p style={{ color: "#B0B0B0", marginBottom: "20px" }}>
                  {selectedEvent.capacity}
                </p>

                <h3 style={{ marginBottom: "10px" }}>Requirements</h3>
                <p style={{ color: "#B0B0B0", marginBottom: "20px" }}>
                  {selectedEvent.requirements}
                </p>

                <h3 style={{ marginBottom: "10px" }}>Entry Fee</h3>
                <p style={{ color: "#B0B0B0" }}>
                  Starting at {selectedEvent.price}
                </p>
              </div>

              {selectedEvent.status === "active" && (
                <RegisterButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register for Event
                </RegisterButton>
              )}
            </ModalContent>
          </EventModal>
        )}
      </AnimatePresence>
    </EventsContainer>
  );
}

export default Events;
