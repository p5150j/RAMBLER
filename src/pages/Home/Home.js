import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Hero Section Styles
const HeroSection = styled.section`
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  z-index: 2;
`;

const HeroBackground = styled(motion.div)`
  position: absolute;
  top: -100px;
  left: -50px;
  right: -50px;
  bottom: -100px;
  overflow: hidden;
  filter: brightness(0.6);

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 62, 62, 0.2) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: 1;
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 3;
  max-width: 800px;
  padding: 0 20px;
`;

const Title = styled(motion.h1)`
  font-family: "Racing Sans One", "Poppins", sans-serif;
  font-size: clamp(3rem, 8vw, 5rem);
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const SubTitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 auto 30px;
  max-width: 600px;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const AnimatedCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(99px);
  animation: floatAnimation 10s infinite ease-in-out;

  @keyframes floatAnimation {
    0% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(50px, 50px) scale(1.1);
    }
    50% {
      transform: translate(100px, -50px) scale(1);
    }
    75% {
      transform: translate(-50px, 100px) scale(1.2);
    }
    100% {
      transform: translate(0, 0) scale(1);
    }
  }
`;

// Layout Components
const Section = styled.section`
  margin-top: -60px;
  position: relative;
  padding: 80px 20px;

  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
`;

const Button = styled(motion(Link))`
  display: inline-block;
  padding: 15px 30px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
  }

  &:hover::before {
    transform: translateX(100%);
    transition: transform 0.8s ease;
  }
`;

// Feature Card Components
const FeatureCard = styled(motion.div)`
  position: relative;
  background: ${({ theme }) => `${theme.colors.surface}CC`};
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 0px;
  margin-bottom: 100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 30px;
  }

  &:nth-child(even) {
    direction: rtl;
    @media (max-width: 768px) {
      direction: ltr;
    }
  }
`;

const FeatureContent = styled.div`
  direction: ltr;
  position: relative;
  z-index: 1;

  h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 2rem;
    margin-bottom: 25px;
    font-family: "Racing Sans One", "Poppins", sans-serif;
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 60%;
      height: 3px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 2px;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.8;
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
`;

const FeatureImage = styled(motion.div)`
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      ${({ theme }) => theme.colors.primary}33,
      transparent
    );
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const TimelineContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  position: relative;
  padding: 30px;
  background: ${({ theme }) => `${theme.colors.surface}CC`};
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1;
  min-height: calc(100vh - 100px);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    min-height: unset;
    padding: 20px;
  }
`;

const TimelineImage = styled(motion.div)`
  position: sticky;
  top: 100px;
  height: 100%;
  min-height: calc(100vh - 200px);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    height: 300px;
    min-height: unset;
    margin-bottom: 20px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TimelineContent = styled.div`
  position: relative;
  padding-left: 30px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 2rem;
    margin-bottom: 25px;
    font-family: "Racing Sans One", "Poppins", sans-serif;
  }
`;

const TimelineItem = styled(motion.div)`
  margin-bottom: 60px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -34px;
    top: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 8px ${({ theme }) => theme.colors.primary}33;
  }

  h4 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
    font-family: "Racing Sans One", "Poppins", sans-serif;
    margin-bottom: 15px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.7;
    font-size: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: 20px;
  font-family: "Racing Sans One", "Poppins", sans-serif;
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SponsorsSection = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const SponsorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  align-items: center;
  justify-items: center;
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
`;

const SponsorLogo = styled.img`
  height: auto;
  width: 100%;
  max-width: 260px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

function Home() {
  const { scrollY } = useScroll();

  const y = useSpring(useTransform(scrollY, [0, 1000], [0, 300]), {
    damping: 15,
    mass: 0.1,
  });

  const scale = useSpring(useTransform(scrollY, [0, 1000], [1.1, 1.3]), {
    damping: 15,
    mass: 0.1,
  });

  return (
    <>
      <HeroSection>
        <HeroBackground
          style={{ y, scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <video autoPlay muted loop playsInline>
            <source
              src="https://arusimages.s3.us-west-2.amazonaws.com/race.mp4"
              type="video/mp4"
            />
          </video>
        </HeroBackground>
        <HeroContent>
          <Title>ROCKY MOUNTAIN RAMBLER 500</Title>
          <SubTitle>
            is an annual event where people take their beater cars, fix them up
            just enough to run, and put them to the test. It’s all about fun,
            creativity, and seeing just how far you can push a junker with a
            bunch of like-minded gearheads.
          </SubTitle>
          <Button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(255, 62, 62, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            to="/events"
          >
            Join The Race
          </Button>
        </HeroContent>
      </HeroSection>

      <Section>
        <AnimatedBackground>
          {/* Purple Accent Circle (positioned on the left) */}
          <AnimatedCircle
            style={{
              width: "1000px",
              height: "1000px",
              top: "20%",
              left: "-25%",
              background:
                "linear-gradient(45deg, rgba(147,51,234,0.7), rgba(147,51,234,0.3))",
              opacity: 0.6,
            }}
            animate={{
              x: [0, -80, 80, -50, 50, 0],
              y: [0, 80, -80, 50, -50, 0],
              scale: [1, 1.3, 1.5, 1.3, 1.1, 1],
              rotate: [0, -25, 25, -25, 25, 0],
            }}
            transition={{
              duration: 25,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 2,
            }}
          />
        </AnimatedBackground>

        <Container>
          <SectionTitle>Here's what makes it unique:</SectionTitle>

          <FeatureCard
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FeatureContent>
              <h3>The "Beater" Challenge</h3>
              <p>
                At the heart of the Rambler is the requirement for participants
                to use "beaters" — old, rundown vehicles purchased for as cheap
                as possible. These cars, often held together by duct tape,
                determination, and a healthy dose of humor, are customized by
                their owners to take on the Rambler's challenges.
              </p>
            </FeatureContent>
            <FeatureImage
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://cdn.midjourney.com/007615c1-a1b4-4c06-94bd-d9f1121e2b9a/0_1.png"
                alt="Shitbox Challenge"
              />
            </FeatureImage>
          </FeatureCard>

          <TimelineContainer>
            <TimelineImage
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
                alt="Three Day Extravaganza"
              />
            </TimelineImage>

            <TimelineContent>
              <h3>A Three-Day Extravaganza</h3>
              <TimelineItem
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4>Day 1: Car Show</h4>
                <p>
                  Participants proudly display their creations. From wild paint
                  jobs to outrageous custom modifications, the car show is a
                  feast for automotive enthusiasts and spectators alike.
                </p>
              </TimelineItem>

              <TimelineItem
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4>Day 2: Adventure Course</h4>
                <p>
                  This is where the fun truly begins. The adventure course tests
                  the durability of both the cars and their drivers with a mix
                  of on-road and off-road challenges. It's as much about keeping
                  the cars running as it is about navigating the unpredictable
                  terrain.
                </p>
              </TimelineItem>

              <TimelineItem
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h4>Day 3: Trophy Ceremony</h4>
                <p>
                  The event culminates in a lively awards ceremony, celebrating
                  not just winners but also the most creative, resilient, and
                  downright hilarious participants.
                </p>
              </TimelineItem>
            </TimelineContent>
          </TimelineContainer>
        </Container>
      </Section>

      <SponsorsSection>
        <Container>
          <SectionTitle>Our Sponsors</SectionTitle>
          <SponsorsGrid>
            <SponsorLogo
              src="https://arusimages.s3.us-west-2.amazonaws.com/logo1.png"
              alt="Sponsor 1"
            />
            <SponsorLogo
              src="https://arusimages.s3.us-west-2.amazonaws.com/logo2.png"
              alt="Sponsor 2"
            />
            {/* <SponsorLogo
              src="https://placehold.co/200x80?text=Sponsor+3"
              alt="Sponsor 3"
            />
            <SponsorLogo
              src="https://placehold.co/200x80?text=Sponsor+4"
              alt="Sponsor 4"
            /> */}
          </SponsorsGrid>
        </Container>
      </SponsorsSection>

      <Section alt>
        <Container>
          <SectionTitle>Join The Adventure</SectionTitle>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Button to="/signup">Register Now</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default Home;
