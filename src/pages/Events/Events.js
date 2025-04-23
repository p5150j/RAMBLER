// pages/Events/Events.js
import React, { useState, useEffect, useCallback, memo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../utils/eventService";
import TeamRegistrationForm from "../../components/events/TeamRegistrationForm";
import IndividualRegistrationForm from "../../components/events/IndividualRegistrationForm";
import EventMap from "../../components/events/EventMap";
import PaymentModal from "../../components/events/PaymentModal";
import { Helmet } from "react-helmet-async";

// Memoized Event Card Component
const EventCard = memo(({ event, onRegister, isRegistered }) => {
  return (
    <StyledEventCard
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <EventImage>
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </EventImage>
      <EventContent>
        <EventStatus $status={event.status}>
          {isRegistered
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
        <EventTitle>{event.title}</EventTitle>
        <EventDescription>{event.description}</EventDescription>

        <EventCardStats>
          {event.eventType === "team" ? (
            <>
              <StatItem>
                <StatLabel>Team Size</StatLabel>
                <StatValue>
                  {event.minTeamSize}-{event.maxTeamSize}
                </StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Base Price</StatLabel>
                <StatValue>${event.basePrice}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Teams</StatLabel>
                <StatValue>
                  {event.registeredTeams}/{event.capacity}
                </StatValue>
              </StatItem>
            </>
          ) : (
            <>
              <StatItem>
                <StatLabel>Type</StatLabel>
                <StatValue>Individual</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Price</StatLabel>
                <StatValue>${event.individualPrice}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Spots</StatLabel>
                <StatValue>
                  {event.registeredTeams}/{event.capacity}
                </StatValue>
              </StatItem>
            </>
          )}
        </EventCardStats>

        {/* Location Map */}
        <LocationSection>
          <LocationLabel>📍 {event.location}</LocationLabel>
          <CardMapWrapper>
            <EventMap
              location={event.location}
              height="180px"
              showPin={true}
              zoom={12}
            />
          </CardMapWrapper>
        </LocationSection>

        <Requirements>
          <strong>Requirements: </strong> {event.requirements}
        </Requirements>

        {event.status === "active" && (
          <RegisterButton
            whileHover={!isRegistered ? { scale: 1.02 } : {}}
            whileTap={!isRegistered ? { scale: 0.98 } : {}}
            onClick={() => !isRegistered && onRegister(event)}
            disabled={isRegistered}
            $isRegistered={isRegistered}
          >
            {isRegistered ? "Registered" : "Register Now"}
          </RegisterButton>
        )}
      </EventContent>
    </StyledEventCard>
  );
});

// Memoized Featured Event Component
const FeaturedEventCard = memo(({ event, onRegister, isRegistered }) => {
  return (
    <FeaturedEvent>
      <FeaturedBackground>
        <img
          src={event.image}
          alt={event.title}
          loading="eager" // Load immediately as it's above the fold
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </FeaturedBackground>
      {/* Rest of your featured event content */}
    </FeaturedEvent>
  );
});

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedEvents, registrations] = await Promise.all([
        eventService.getAllEvents(),
        currentUser ? eventService.getUserRegistrations(currentUser.uid) : [],
      ]);

      const featured = fetchedEvents.find((event) => event.featured);
      setFeaturedEvent(featured || fetchedEvents[0]);
      setEvents(fetchedEvents);
      setUserRegistrations(registrations);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Memoized registration check
  const isRegisteredForEvent = useCallback(
    (eventId) => {
      if (!userRegistrations || !Array.isArray(userRegistrations)) return false;
      return userRegistrations.some(
        (registration) => registration.eventId === eventId
      );
    },
    [userRegistrations]
  );

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
  const handleRegistrationSubmit = async (data) => {
    try {
      console.log("Registration data received:", data);
      console.log("Registration event:", registrationEvent);

      setShowRegistrationForm(false);
      setShowPaymentModal(true);

      const registration = {
        eventId: registrationEvent.id,
        userId: currentUser.uid,
        totalCost: data.totalCost || registrationEvent.basePrice,
        ...data,
      };

      console.log("Setting current registration:", registration);
      setCurrentRegistration(registration);
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Failed to prepare registration");
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResult) => {
    try {
      console.log(
        "Starting registration process with payment result:",
        paymentResult
      );
      console.log("Current registration data:", currentRegistration);
      console.log("Registration event:", registrationEvent);

      // Now create the registration with payment details
      console.log("Creating registration in eventService...");
      const registration = await eventService.registerTeam(
        registrationEvent.id,
        currentRegistration
      );
      console.log("Registration created:", registration);

      // Update registration with payment details
      console.log("Updating registration with payment details...");
      await eventService.updateRegistrationPayment(
        registration.registrationId,
        paymentResult
      );
      console.log("Payment details updated successfully");

      // Update local state
      setUserRegistrations((prev) => [
        ...prev,
        {
          ...registration,
          paymentStatus: "paid",
          status: "confirmed",
        },
      ]);

      // Close payment modal
      setShowPaymentModal(false);
      setCurrentRegistration(null);

      // Refresh data to update registered teams count
      await fetchData();
      alert("Registration and payment successful!");
    } catch (error) {
      console.error("Registration error details:", {
        error,
        currentRegistration,
        registrationEvent,
        paymentResult,
      });
      alert(
        "Payment successful but failed to complete registration. Error: " +
          error.message
      );
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
    <>
      <Helmet>
        <title>Rocky Mountain Rambler 500 | Events</title>
        <meta
          name="description"
          content="Discover upcoming events for the Rocky Mountain Rambler 500. Join us for the ultimate beater car challenge, featuring car shows, adventure courses, and trophy ceremonies."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rockymtnrambler.com/events" />
        <meta
          property="og:title"
          content="Rocky Mountain Rambler 500 | Events"
        />
        <meta
          property="og:description"
          content="Discover upcoming events for the Rocky Mountain Rambler 500. Join us for the ultimate beater car challenge, featuring car shows, adventure courses, and trophy ceremonies."
        />
        <meta
          property="og:image"
          content="https://rockymtnrambler.com/logo512.png"
        />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:site_name" content="Rocky Mountain Rambler 500" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://rockymtnrambler.com/events"
        />
        <meta
          property="twitter:title"
          content="Rocky Mountain Rambler 500 | Events"
        />
        <meta
          property="twitter:description"
          content="Discover upcoming events for the Rocky Mountain Rambler 500. Join us for the ultimate beater car challenge, featuring car shows, adventure courses, and trophy ceremonies."
        />
        <meta
          property="twitter:image"
          content="https://rockymtnrambler.com/logo512.png"
        />
      </Helmet>
      <EventsContainer>
        {featuredEvent && (
          <FeaturedEvent>
            <FeaturedBackground
              style={{
                backgroundImage: `url("${featuredEvent.image}")`,
              }}
            />
            <FeaturedContent>
              <FeaturedContentLayout>
                <FeaturedMainContent>
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
                    {featuredEvent.eventType === "team" ? (
                      <>
                        <StatItem>
                          <div className="label">Team Size</div>
                          <div className="value">
                            {featuredEvent.minTeamSize}-
                            {featuredEvent.maxTeamSize} members
                          </div>
                        </StatItem>
                        <StatItem>
                          <div className="label">Base Price</div>
                          <div className="value">
                            ${featuredEvent.basePrice}
                          </div>
                        </StatItem>
                        <StatItem>
                          <div className="label">Teams Registered</div>
                          <div className="value">
                            {featuredEvent.registeredTeams} /{" "}
                            {featuredEvent.capacity}
                          </div>
                        </StatItem>
                      </>
                    ) : (
                      <>
                        <StatItem>
                          <div className="label">Event Type</div>
                          <div className="value">Individual</div>
                        </StatItem>
                        <StatItem>
                          <div className="label">Price</div>
                          <div className="value">
                            ${featuredEvent.individualPrice}
                          </div>
                        </StatItem>
                        <StatItem>
                          <div className="label">Spots Filled</div>
                          <div className="value">
                            {featuredEvent.registeredTeams} /{" "}
                            {featuredEvent.capacity}
                          </div>
                        </StatItem>
                      </>
                    )}
                  </EventStats>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
                    Requirements
                  </h3>
                  <p style={{ color: "#B0B0B0", lineHeight: "1.6" }}>
                    {featuredEvent.requirements}
                  </p>

                  <RegisterButton
                    whileHover={
                      !isRegisteredForEvent(featuredEvent.id)
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      !isRegisteredForEvent(featuredEvent.id)
                        ? { scale: 0.98 }
                        : {}
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
                </FeaturedMainContent>

                <FeaturedMapSection>
                  <LocationLabel>📍 {featuredEvent.location}</LocationLabel>
                  <SquareMapWrapper>
                    <EventMap
                      location={featuredEvent.location}
                      height="100%"
                      showPin={true}
                      zoom={12}
                    />
                  </SquareMapWrapper>
                </FeaturedMapSection>
              </FeaturedContentLayout>
            </FeaturedContent>
          </FeaturedEvent>
        )}

        <EventsGrid>
          {events
            .filter((event) => !event.featured)
            .map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                isRegistered={isRegisteredForEvent(event.id)}
              />
            ))}
        </EventsGrid>

        {showRegistrationForm &&
          registrationEvent &&
          (registrationEvent.eventType === "team" ? (
            <TeamRegistrationForm
              event={registrationEvent}
              onSubmit={handleRegistrationSubmit}
              onClose={() => {
                setShowRegistrationForm(false);
                setRegistrationEvent(null);
              }}
            />
          ) : (
            <IndividualRegistrationForm
              event={registrationEvent}
              onSuccess={handleRegistrationSubmit}
              onCancel={() => {
                setShowRegistrationForm(false);
                setRegistrationEvent(null);
              }}
            />
          ))}

        {showPaymentModal && currentRegistration && (
          <PaymentModal
            event={registrationEvent}
            registrationData={currentRegistration}
            totalAmount={currentRegistration.totalCost}
            onSuccess={handlePaymentSuccess}
            onCancel={() => {
              console.log("Payment modal cancelled");
              setShowPaymentModal(false);
              setCurrentRegistration(null);
            }}
          />
        )}
      </EventsContainer>
    </>
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

const StyledEventCard = styled(motion.div)`
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

// Move inline styles to styled components
const EventTitle = styled.h3`
  margin: 10px 0;
`;

const EventDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Requirements = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 2px;
`;

const StatValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LocationSection = styled.div`
  margin: 12px 0;
  width: 100%;
`;

const LocationLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardMapWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 12px;
`;

const SquareMapWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FeaturedContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FeaturedMainContent = styled.div`
  width: 100%;
`;

const FeaturedMapSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

export default Events;
