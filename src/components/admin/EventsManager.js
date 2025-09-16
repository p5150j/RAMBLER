// components/admin/EventsManager.js
import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import EventForm from "./EventForm";
import { eventService } from "../../utils/eventService";
import { exportToCSV, formatEventRegistrationsForCSV } from "../../utils/csvExport";

function EventsManager() {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const confirmDelete = (event) => {
    setSelectedEvent(event);
    setIsDeleting(true);
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await eventService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      if (!eventData.image) {
        throw new Error("Please upload an event image");
      }

      const formattedData = {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await eventService.addEvent(formattedData);
      await fetchEvents();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to create event");
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const formattedData = {
        ...eventData,
        updatedAt: new Date().toISOString(),
      };

      await eventService.updateEvent(selectedEvent.id, formattedData);
      await fetchEvents(); // Refresh the list
      setIsModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      await fetchEvents(); // Refresh the list
      setIsDeleting(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event");
    }
  };

  const handleExportRegistrations = async (event) => {
    try {
      setIsExporting(true);
      console.log('Exporting registrations for event:', event.id, event.title);

      // Fetch all registrations for this event
      const registrations = await eventService.getEventRegistrations(event.id);
      console.log('Fetched registrations:', registrations);

      if (!registrations || registrations.length === 0) {
        alert("No registrations found for this event");
        return;
      }

      // Filter for paid registrations only
      const paidRegistrations = registrations.filter(
        reg => reg.paymentStatus === 'paid'
      );

      if (paidRegistrations.length === 0) {
        const confirmExport = window.confirm(
          "No paid registrations found. Do you want to export all registrations instead?"
        );
        if (confirmExport) {
          const formattedData = formatEventRegistrationsForCSV(registrations);
          const filename = `${event.title.replace(/[^a-z0-9]/gi, '_')}_all_registrations_${new Date().toISOString().split('T')[0]}.csv`;
          exportToCSV(formattedData, filename);
        }
      } else {
        const formattedData = formatEventRegistrationsForCSV(paidRegistrations);
        const filename = `${event.title.replace(/[^a-z0-9]/gi, '_')}_paid_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        exportToCSV(formattedData, filename);

        // Show summary
        alert(`Exported ${paidRegistrations.length} paid registrations (${registrations.length} total)`);
      }
    } catch (err) {
      console.error("Error exporting registrations:", err);
      console.error("Error details:", err.message, err.stack);
      alert(`Failed to export registrations: ${err.message || 'Unknown error'}. Please check the console for details.`);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={fetchEvents}>Retry</button>
      </div>
    );
  }

  return (
    <ManagerContainer>
      <div style={{ marginBottom: "20px" }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create New Event
        </Button>
      </div>

      <EventsList>
        {events.map((event) => (
          <EventItem key={event.id}>
            <EventContent>
              <EventImageThumb src={event.image} />
              <EventInfo>
                <EventTitle>
                  {event.title}
                  {event.featured && <Badge type="featured">Featured</Badge>}
                  <Badge type={event.status === "active" ? "active" : "past"}>
                    {event.status === "active" ? "Active" : "Past"}
                  </Badge>
                  <Badge
                    type={event.eventType === "team" ? "team" : "individual"}
                  >
                    {event.eventType === "team" ? "Team" : "Individual"}
                  </Badge>
                </EventTitle>

                <EventMeta>
                  <span>📅 {event.date}</span>
                  <span>📍 {event.location}</span>
                  <span>
                    💰{" "}
                    {event.eventType === "team"
                      ? `${event.basePrice} (base) + ${event.extraMemberPrice} (per extra)`
                      : event.individualPrice}
                  </span>
                </EventMeta>

                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "0.9rem",
                    margin: "4px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {event.description}
                </p>

                <div
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: "0.8rem",
                  }}
                >
                  Capacity: {event.capacity}
                </div>
              </EventInfo>
            </EventContent>

            <ActionButtons>
              <ActionButton
                variant="export"
                onClick={() => handleExportRegistrations(event)}
                disabled={isExporting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload style={{ marginRight: "5px" }} />
                Export CSV
              </ActionButton>
              <ActionButton
                variant="edit"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit
              </ActionButton>
              <ActionButton
                variant="delete"
                onClick={() => confirmDelete(event)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Delete
              </ActionButton>
            </ActionButtons>
          </EventItem>
        ))}
        {events.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No events found. Create your first event!
          </p>
        )}
      </EventsList>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h2 style={{ marginBottom: "20px" }}>
                {selectedEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <EventForm
                event={selectedEvent}
                onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedEvent(null);
                }}
              />
            </ModalContent>
          </Modal>
        )}

        {isDeleting && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <h2>Confirm Delete</h2>
              <p style={{ margin: "20px 0" }}>
                Are you sure you want to delete "{selectedEvent.title}"?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  style={{ background: "#ff4444" }}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setIsDeleting(false);
                    setSelectedEvent(null);
                  }}
                  style={{ background: "#666" }}
                >
                  Cancel
                </Button>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </ManagerContainer>
  );
}

const ManagerContainer = styled.div``;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EventItem = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const EventContent = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 120px 1fr;
  }
`;

const EventImageThumb = styled.img`
  width: 100%;
  height: 120px;
  border-radius: 4px;
  object-fit: cover;
  object-position: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 120px;
  }
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EventTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EventMeta = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ type, theme }) =>
    type === "featured"
      ? `${theme.colors.accent}33`
      : type === "active"
      ? `${theme.colors.success}33`
      : `${theme.colors.textMuted}33`};
  color: ${({ type, theme }) =>
    type === "featured"
      ? theme.colors.accent
      : type === "active"
      ? theme.colors.success
      : theme.colors.textMuted};
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const ActionButton = styled(motion.button)`
  padding: 12px;
  background: ${({ variant, theme }) =>
    variant === "delete"
      ? theme.colors.error
      : variant === "edit"
      ? theme.colors.surface
      : variant === "export"
      ? theme.colors.success
      : theme.colors.surface};
  color: ${({ variant, theme }) =>
    variant === "delete"
      ? "black"
      : variant === "edit"
      ? theme.colors.primary
      : variant === "export"
      ? "white"
      : theme.colors.textPrimary};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ variant, theme }) =>
      variant === "delete"
        ? theme.colors.errorDark
        : variant === "export"
        ? theme.colors.successDark || "#00A044"
        : theme.colors.surfaceAlt};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export default EventsManager;
