// pages/Events/Events.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../utils/eventService";
import TeamRegistrationForm from "../../components/events/TeamRegistrationForm";

function Events() {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Single fetch function to get all needed data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get events
      const fetchedEvents = await eventService.getAllEvents();
      const featured = fetchedEvents.find((event) => event.featured);
      setFeaturedEvent(featured || fetchedEvents[0]);
      setEvents(fetchedEvents);

      // Get registrations if user is logged in
      if (currentUser) {
        const registrations = await eventService.getUserRegistrations(
          currentUser.uid
        );
        setUserRegistrations(registrations);
      } else {
        setUserRegistrations([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is registered for an event
  const isRegisteredForEvent = (eventId) => {
    if (!userRegistrations || !Array.isArray(userRegistrations)) return false;
    return userRegistrations.some(
      (registration) => registration.eventId === eventId
    );
  };

  // Handle registration button click
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

    setRegistrationEvent(event);
    setShowRegistrationForm(true);
  };

  // Handle registration form submission
  const handleRegistrationSubmit = async (teamData) => {
    try {
      const registration = await eventService.registerTeam(
        registrationEvent.id,
        {
          userId: currentUser.uid,
          ...teamData,
        }
      );

      setUserRegistrations((prev) => [...prev, registration]);
      setShowRegistrationForm(false);
      setRegistrationEvent(null);

      // Refresh data to update registered teams count
      fetchData();
      alert("Successfully registered for event!");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Failed to register for event");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [currentUser?.uid]); // Re-fetch when user changes

  if (isLoading) return <LoadingState>Loading events...</LoadingState>;
  if (error) return <ErrorState>{error}</ErrorState>;
  if (!events.length) return <EmptyState>No events found.</EmptyState>;

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
            <EventDate>
              {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </EventDate>
            <h1 style={{ fontSize: "2.5rem", margin: "20px 0" }}>
              {featuredEvent.title}
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                marginBottom: "20px",
                lineHeight: "1.6",
              }}
            >
              {featuredEvent.description}
            </p>

            <EventStats>
              <StatItem>
                <div className="label">Team Size</div>
                <div className="value">
                  {featuredEvent.minTeamSize}-{featuredEvent.maxTeamSize}{" "}
                  members
                </div>
              </StatItem>
              <StatItem>
                <div className="label">Base Price</div>
                <div className="value">${featuredEvent.basePrice}</div>
              </StatItem>
              <StatItem>
                <div className="label">Teams Registered</div>
                <div className="value">
                  {featuredEvent.registeredTeams} / {featuredEvent.capacity}
                </div>
              </StatItem>
            </EventStats>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
              Requirements
            </h3>
            <p style={{ color: "#B0B0B0", lineHeight: "1.6" }}>
              {featuredEvent.requirements}
            </p>

            <RegisterButton
              whileHover={
                !isRegisteredForEvent(featuredEvent.id) ? { scale: 1.02 } : {}
              }
              whileTap={
                !isRegisteredForEvent(featuredEvent.id) ? { scale: 0.98 } : {}
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
                <EventDate>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </EventDate>
                <h3 style={{ margin: "10px 0" }}>{event.title}</h3>
                <p
                  style={{
                    color: "#B0B0B0",
                    marginBottom: "15px",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    // WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.description}
                </p>

                <EventCardStats>
                  <div>
                    <div className="stat-label">Team Size</div>
                    <div className="stat-value">
                      {event.minTeamSize}-{event.maxTeamSize}
                    </div>
                  </div>
                  <div>
                    <div className="stat-label">Base Price</div>
                    <div className="stat-value">${event.basePrice}</div>
                  </div>
                  <div>
                    <div className="stat-label">Teams</div>
                    <div className="stat-value">
                      {event.registeredTeams}/{event.capacity}
                    </div>
                  </div>
                </EventCardStats>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: "#B0B0B0",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      //   WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    <strong>Requirements: </strong> {event.requirements}
                  </p>
                </div>

                {event.status === "active" && (
                  <RegisterButton
                    whileHover={
                      !isRegisteredForEvent(event.id) ? { scale: 1.02 } : {}
                    }
                    whileTap={
                      !isRegisteredForEvent(event.id) ? { scale: 0.98 } : {}
                    }
                    onClick={() =>
                      !isRegisteredForEvent(event.id) && handleRegister(event)
                    }
                    disabled={isRegisteredForEvent(event.id)}
                    $isRegistered={isRegisteredForEvent(event.id)}
                  >
                    {isRegisteredForEvent(event.id)
                      ? "Registered"
                      : "Register Now"}
                  </RegisterButton>
                )}
              </EventContent>
            </EventCard>
          ))}
      </EventsGrid>

      {showRegistrationForm && registrationEvent && (
        <TeamRegistrationForm
          event={registrationEvent}
          onSubmit={handleRegistrationSubmit}
          onClose={() => {
            setShowRegistrationForm(false);
            setRegistrationEvent(null);
          }}
        />
      )}
    </EventsContainer>
  );
}
// Styled Components
const EventsContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const LoadingState = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorState = styled(LoadingState)`
  color: ${({ theme }) => theme.colors.error};
`;

const EmptyState = styled(LoadingState)``;

const FeaturedEvent = styled.div`
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  margin-bottom: 60px;
  padding: 60px 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: auto;
    padding: 40px 20px;
  }
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
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: ${({ theme }) => `${theme.colors.surface}CC`};
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px;
  }
`;

const EventStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatItem = styled.div`
  text-align: center;

  .label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 4px;
  }

  .value {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 30px;
  max-width: 1000px; /* Adjusted from 1200px to better fit 2 columns */
  margin: 0 auto;
  padding: 0 20px 60px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr; /* Single column on tablet/mobile */
  }
`;

const EventCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
`;

const EventImage = styled.div`
  height: 220px;
  background-size: cover;
  background-position: center;
`;

const EventContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const EventCardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 15px 0;
  padding: 15px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .stat-label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 2px;
  }

  .stat-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
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
  margin-top: auto;
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
