// components/WaiverModal.js
import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 30px;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 5px;
`;

const WaiverText = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  font-size: 0.9rem;

  h2 {
    margin-bottom: 20px;
  }

  p {
    margin-bottom: 15px;
  }
`;

function WaiverModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          exit={{ y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <WaiverText>
            <p>
              Agreement of Release and Indemnity & Model, Talent, and Image
              Release This Agreement of Release and Indemnity (this "Agreement")
              contains a release of liability and waiver which affects your
              legal rights. By registering to participate, or participating, in
              the ROCKY MOUNTAIN RAMBLER 500, (the "Event" you are agreeing to
              the following terms and conditions, including without limitation,
              the release of liability and waiver of claims provided below. If
              you do not agree to all of the following terms and conditions, do
              not register to participate, or participate, in the Event. If you
              do not understand all of the following terms and conditions please
              seek the advice of appropriate persons prior to registering to
              participate, or participating, in the Event. By indicating your
              acceptance, you understand, agree, warrant and covenant as
              follows: You acknowledge and agree that the Event, like any other
              road rally, events, competitions, or activities, regardless of
              distance, intensity, or conditions, involve potential hazards to
              persons and property, that injuries are common, and that your
              participation in the Event could result in temporary or permanent
              injury, including serious injury, disability, paralysis or death.
              You accept and assume the risks associated with your participation
              in or attendance at the Event, including, but not limited to,
              weather conditions and changes in weather conditions, surface
              conditions and variations in surface conditions, terrain features,
              collisions or contact with natural or man-made objects or other
              persons (including spectators, Event officials and
              representatives, and other participants), no or delayed first aid
              or emergency assistance, illness or pre-existing medical
              condition, crashing, inability to complete the Event, the
              negligence of persons at or involved in or with the Event, and the
              negligence or intentional misconduct of other participants and
              spectators of the Event. You further acknowledge that there may be
              other risks associated with your participation in or attendance at
              the Event which may not be listed above. YOU FREELY AND EXPRESSLY
              ACCEPT AND ASSUME ANY AND ALL RISKS ASSOCIATED FOR BOTH YOURSELF
              AND YOUR TEAM, INCLUDING WITHOUT LIMITATION, THE RISKS OF INJURY,
              DEATH, AND PROPERTY DAMAGE ASSOCIATED WITH THE EVENT. You
              acknowledge and state that you do not need to participate in the
              Event, and that you have unlimited opportunity to engage in car
              rally activities similar to the Event. You acknowledge and state
              that you are medically able and appropriately trained to
              participate in the Event. You agree to abide by the decision of
              any Event official or representative regarding your ability to
              participate in the Event, and that Event officials or
              representatives may authorize emergency treatment for you in the
              event of injury or perceived harm. You agree to abide by any and
              all rules, regulations, directions. signage, warnings, and/or
              orders at the Event or of the Event officials or representatives,
              and further, that, among other things, your right to participate
              in the Event may be revoked at any time upon your failure to do
              so. YOU ACKNOWLEDGE THAT SUCCESSFUL COMPLETION OF THE EVENT DOES
              NOT REQUIRE SPEEDING. AND AGREES TO ABIDE BY ALL POSTED SPEED
              LIMITS AND OTHER APPLICABLE LAWS, HAVING BEEN SPECIFICALLY
              INSTRUCTED TO DO SO BY THE EVENT HOLDERS You further irrevocably,
              and without additional consideration, grants to ROCKY MOUNTAIN
              RAMBLER 500 LLC., the transferable right to use your image or
              likeness ("Image") in any educational, promotional, advertising,
              or other purpose. You agree that all intellectual property rights
              in your Image captured at or during the Event belong to ROCKY
              MOUNTAIN RAMBLER LTD., and you waive any right to approve, inspect
              and/or receive royalties or other benefits from the use of such
              Image by ROCKY MOUNTAIN RAMBLER 500 LLC In consideration for entry
              into and the right to participate in any way in the Event, you, on
              behalf of yourself and on behalf of your heirs, executors,
              administrators, successors, and assigns, irrevocably and
              unconditionally release, acquit, forever discharge, hold harmless,
              and indemnify ROCKY MOUNTAIN RAMBLER 500 LLC, and each of their
              respective, present and future, members, shareholders, directors,
              officers, employees, affiliates, contractors, volunteers, car
              owners, drivers, rescue personnel, advertisers, organizers,
              sponsors, promoters, agents, owners and lessees of the premises
              used to conduct the Event, and other authorized representatives,
              any Event officials or representatives, and any other persons or
              entities assisting with or in any way connected with the Event,
              together with their successors and assigns (collectively, the
              "Event Holders") for, from, and against any and all claims by me
              or on my behalf regarding the inherent risks associated with the
              Event, the negligence or intentional misconduct of other
              participants in the Event or spectators of the Event, as well as
              the ordinary negligence of the Event Holders, or any of them,
              arising out of or in any way connected with the Event and/or the
              use of any facilities, premises, or equipment at or in connection
              with the Event. You acknowledge and state that you have carefully
              read and understand this Agreement and all of its terms,
              understandat this Agreement contains a release of liability and
              waiver of claims, and that you enter into this Agreement
              voluntarily and on a fully informed basis understanding that it is
              binding upon you, and your heirs, representatives, successors, and
              assigns. You state that you are at least 18 years of age and
              accept all the terms and conditions of this Agreement on your
              behalf including without limitation the release of liability and
              waiver of claims contained in this Agreement.
            </p>
            {/* Add rest of waiver text */}
          </WaiverText>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
}

export default WaiverModal;
