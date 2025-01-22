// components/admin/EventsManager.js
import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import EventForm from "./EventForm";
import { eventService } from "../../utils/eventService";

function EventsManager() {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <EventImageThumb src={event.image} />
            <EventInfo>
              <EventTitle>
                {event.title}
                {event.featured && <Badge type="featured">Featured</Badge>}
                <Badge type={event.status === "active" ? "active" : "past"}>
                  {event.status === "active" ? "Active" : "Past"}
                </Badge>
              </EventTitle>

              <EventMeta>
                <span>📅 {event.date}</span>
                <span>📍 {event.location}</span>
                <span>💰 {event.price}</span>
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

            <ActionButtons>
              <ActionButton
                variant="edit"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </ActionButton>
              <ActionButton
                variant="delete"
                onClick={() => confirmDelete(event)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EventImageThumb = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 4px;
  object-fit: cover;
  object-position: center;
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
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 16px;
  background: ${({ variant, theme }) =>
    variant === "delete"
      ? "#ff4444"
      : variant === "edit"
      ? theme.colors.primary
      : theme.colors.surface};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
