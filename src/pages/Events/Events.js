// pages/Events/Events.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "../../utils/userService";
import { eventService } from "../../utils/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Define functions first
  const fetchUserRegistrations = async () => {
    try {
      const registrations = await userService.getUserRegistrations(
        currentUser.uid
      );
      setUserRegistrations(registrations);
    } catch (err) {
      console.error("Error fetching user registrations:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await eventService.getAllEvents();
      const featured = fetchedEvents.find((event) => event.featured);
      setFeaturedEvent(featured || fetchedEvents[0]);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const isRegisteredForEvent = (eventId) => {
    return userRegistrations.some((reg) => reg.eventId === eventId);
  };

  const handleRegister = async (event) => {
    if (!currentUser) {
      navigate("/login", {
        state: {
          returnTo: "/events",
          action: "register",
          eventId: event.id,
        },
      });
      return;
    }

    try {
      await userService.registerForEvent(currentUser.uid, event.id);
      setUserRegistrations((prev) => [
        ...prev,
        {
          eventId: event.id,
          title: event.title,
          date: event.date,
          price: event.price,
          location: event.location,
          registeredAt: new Date().toISOString(),
          status: "registered",
        },
      ]);
      alert("Successfully registered for event!");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register for event");
    }
  };

  // Effects
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserRegistrations();
    } else {
      setUserRegistrations([]);
    }
  }, [currentUser]);

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
              whileHover={
                !isRegisteredForEvent(featuredEvent.id) ? { scale: 1.05 } : {}
              }
              whileTap={
                !isRegisteredForEvent(featuredEvent.id) ? { scale: 0.95 } : {}
              }
              onClick={() =>
                !isRegisteredForEvent(featuredEvent.id) &&
                handleRegister(featuredEvent)
              }
              disabled={isRegisteredForEvent(featuredEvent.id)}
              $isRegistered={isRegisteredForEvent(featuredEvent.id)}
            >
              {isRegisteredForEvent(featuredEvent.id)
                ? "Registered"
                : "Register Now"}
            </RegisterButton>
          </FeaturedContent>
        </FeaturedEvent>
      )}

      <EventsGrid>
        {events
          .filter((event) => !event.featured)
          .map((event) => (
            <EventCard
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EventImage
                style={{ backgroundImage: `url("${event.image}")` }}
              />
              <EventContent>
                <EventStatus $status={event.status}>
                  {isRegisteredForEvent(event.id)
                    ? "Registered"
                    : event.status === "active"
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
                    {isRegisteredForEvent(selectedEvent.id)
                      ? "Registered"
                      : selectedEvent.status === "active"
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
                  whileHover={
                    !isRegisteredForEvent(selectedEvent.id)
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    !isRegisteredForEvent(selectedEvent.id)
                      ? { scale: 0.98 }
                      : {}
                  }
                  onClick={() =>
                    !isRegisteredForEvent(selectedEvent.id) &&
                    handleRegister(selectedEvent)
                  }
                  disabled={isRegisteredForEvent(selectedEvent.id)}
                  $isRegistered={isRegisteredForEvent(selectedEvent.id)}
                >
                  {isRegisteredForEvent(selectedEvent.id)
                    ? "Registered"
                    : "Register for Event"}
                </RegisterButton>
              )}
            </ModalContent>
          </EventModal>
        )}
      </AnimatePresence>
    </EventsContainer>
  );
}

// Styled components
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
  background: ${({ theme, $isRegistered }) =>
    $isRegistered ? theme.colors.textMuted : theme.colors.primary};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${({ $isRegistered }) => ($isRegistered ? "default" : "pointer")};
  width: 100%;
  margin-top: 20px;
  opacity: ${({ $isRegistered }) => ($isRegistered ? 0.7 : 1)};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $isRegistered }) =>
      $isRegistered ? theme.colors.textMuted : theme.colors.primaryDark};
  }

  &:disabled {
    cursor: default;
  }
`;

export default Events;
