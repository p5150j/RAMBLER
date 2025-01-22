// pages/Events/Events.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { eventService } from "../../utils/eventService";
function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await eventService.getAllEvents();

      // Add these console logs to debug
      console.log("All events:", fetchedEvents);
      const featured = fetchedEvents.find((event) => event.featured);
      console.log("Featured event:", featured);

      setFeaturedEvent(featured || fetchedEvents[0]);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No events found.
      </div>
    );
  }
  return (
    <EventsContainer>
      {featuredEvent && (
        <FeaturedEvent>
          {console.log("Rendering featured event:", featuredEvent)}
          <FeaturedBackground
            style={{
              backgroundImage: `url("${featuredEvent.image}")`,
            }}
          />
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
      )}

      <EventsGrid>
        {events
          .filter((event) => !event.featured) // Filter out featured events
          .map((event) => (
            <EventCard
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EventImage
                style={{ backgroundImage: `url("${event.image}")` }} // Fixed image rendering
              />
              <EventContent>
                <EventStatus $status={event.status}>
                  {event.status === "active"
                    ? "Registration Open"
                    : "Past Event"}
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
  background-size: cover;
  background-position: center;
  filter: brightness(0.5);

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

export default Events;
