// components/events/TeamRegistrationForm.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const TeamRegistrationForm = ({ event, onSubmit, onClose }) => {
  const [teamMembers, setTeamMembers] = useState(
    // Create array with length of minTeamSize, fill with empty member objects
    Array(event.minTeamSize)
      .fill()
      .map(() => ({
        name: "",
        email: "",
        phone: "",
        shirtSize: "",
      }))
  );
  const [error, setError] = useState("");

  const calculateTotal = () => {
    const extraMembers = Math.max(0, teamMembers.length - event.minTeamSize);
    const total =
      Number(event.basePrice) + extraMembers * Number(event.extraMemberPrice);
    return total;
  };

  const addTeamMember = () => {
    if (teamMembers.length < event.maxTeamSize) {
      setTeamMembers([
        ...teamMembers,
        { name: "", email: "", phone: "", shirtSize: "" },
      ]);
    }
  };

  const removeTeamMember = (index) => {
    if (teamMembers.length > event.minTeamSize) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTeamMembers(newMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const hasEmptyFields = teamMembers.some(
      (member) =>
        !member.name ||
        !member.email ||
        (event.includesShirt && !member.shirtSize)
    );

    if (hasEmptyFields) {
      setError("Please fill in all required fields for each team member");
      return;
    }

    const total = calculateTotal();
    onSubmit({
      teamMembers,
      totalCost: total,
    });
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Team Registration</h2>

          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9rem",
          }}
        >
          Free tshirt for each member with purchase of registration that will be
          provided upon arrival at car show at check-in.
        </p>

        <PriceInfo>
          <div className="price-row">
            <span>Base Registration ({event.minTeamSize} members):</span>
            <span>${event.basePrice}</span>
          </div>
          {teamMembers.length > event.minTeamSize && (
            <div className="price-row">
              <span>
                Additional Members ({teamMembers.length - event.minTeamSize} × $
                {event.extraMemberPrice}):
              </span>
              <span>
                $
                {(teamMembers.length - event.minTeamSize) *
                  event.extraMemberPrice}
              </span>
            </div>
          )}
          <div className="price-row total">
            <span>Total Amount:</span>
            <span>${calculateTotal()}</span>
          </div>
        </PriceInfo>

        <Form onSubmit={handleSubmit}>
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index}>
              <CardHeader>
                <h3>Team Member {index + 1}</h3>
                {index >= event.minTeamSize && (
                  <RemoveButton
                    type="button"
                    onClick={() => removeTeamMember(index)}
                  >
                    Remove
                  </RemoveButton>
                )}
              </CardHeader>

              <FormGrid>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    placeholder="Enter full name"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      updateMember(index, "email", e.target.value)
                    }
                    placeholder="Enter email"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={member.phone}
                    onChange={(e) =>
                      updateMember(index, "phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    required
                  />
                </FormGroup>

                {event.includesShirt && (
                  <FormGroup>
                    <Label>T-Shirt Size</Label>
                    <Select
                      value={member.shirtSize}
                      onChange={(e) =>
                        updateMember(index, "shirtSize", e.target.value)
                      }
                      required
                    >
                      <option value="">Select Size</option>
                      {event.shirtSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                )}
              </FormGrid>
            </TeamMemberCard>
          ))}

          {teamMembers.length < event.maxTeamSize && (
            <AddMemberButton type="button" onClick={addTeamMember}>
              Add Team Member (+${event.extraMemberPrice})
            </AddMemberButton>
          )}

          {error && <ErrorText>{error}</ErrorText>}

          <BottomButtons>
            <SubmitButton type="submit">
              Continue to Payment - ${calculateTotal()}
            </SubmitButton>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
          </BottomButtons>
        </Form>
      </ModalContent>
    </Modal>
  );
};

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
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 5px;
`;

const PriceInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;

  .price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.textSecondary};

    &.total {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid ${({ theme }) => theme.colors.border};
      font-weight: bold;
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TeamMemberCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Select = styled.select`
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const RemoveButton = styled(Button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 8px 16px;
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const AddMemberButton = styled(Button)`
  background: ${({ theme }) => theme.colors.background};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const BottomButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SubmitButton = styled(Button)`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CancelButton = styled(Button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  text-align: center;
`;

export default TeamRegistrationForm;
