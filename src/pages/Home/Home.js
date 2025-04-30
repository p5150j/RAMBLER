import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { galleryService } from "../../utils/galleryService";

const getTimelineDescription = (day) => {
  switch (day) {
    case "Car Show":
      return "Participants proudly display their creations. From wild paint jobs to outrageous custom modifications, the car show is a feast for automotive enthusiasts and spectators alike.";
    case "Adventure Course":
      return "This is where the fun truly begins. The adventure course tests the durability of both the cars and their drivers with a mix of on-road and off-road challenges.";
    case "Trophy Ceremony":
      return "The event culminates in a lively awards ceremony, celebrating not just winners but also the most creative, resilient, and downright hilarious participants.";
    default:
      return "";
  }
};

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
  filter: brightness(0.4);

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
  position: relative;
  padding: 100px 20px;
  background: ${({ alt, theme }) =>
    alt ? theme.colors.surface : "transparent"};
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
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
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    padding: 30px;
    gap: 30px;
  }

  &:nth-child(even) {
    direction: rtl;
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      direction: ltr;
    }
  }
`;

const FeatureContent = styled.div`
  direction: ltr;
  max-width: 500px;
  margin: 0 auto;

  h3 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin-bottom: 20px;
    font-family: "Racing Sans One", "Poppins", sans-serif;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.7;
    font-size: 1rem;
    margin-bottom: 0;
  }
`;

const FeatureImage = styled(motion.div)`
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 16/9;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Timeline Components
const TimelineContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-top: 100px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const TimelineImage = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    aspect-ratio: 16/9;
  }
`;

const TimelineContent = styled.div`
  h3 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 30px;
    font-family: "Racing Sans One", "Poppins", sans-serif;
  }
`;

const TimelineItem = styled(motion.div)`
  margin-bottom: 30px;
  padding-left: 20px;
  border-left: 2px solid ${({ theme }) => theme.colors.primary};

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: 40px;
  font-family: "Racing Sans One", "Poppins", sans-serif;
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const SponsorsSection = styled.section`
  padding: 80px 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const SponsorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

// Add these styled components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin: 60px 0;
  text-align: center;
`;

const StatItem = styled(motion.div)`
  padding: 30px 20px;
  background: ${({ theme }) => `${theme.colors.surface}CC`};
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    font-size: clamp(2rem, 4vw, 3rem);
    color: ${({ theme }) => theme.colors.primary};
    font-family: "Racing Sans One", "Poppins", sans-serif;
    margin-bottom: 10px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1rem;
  }
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 40px 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const HighlightItem = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;

  &:hover img,
  &:hover video {
    transform: scale(1.05);
  }
`;

const HighlightMedia = styled.div`
  width: 100%;
  height: 100%;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;

  img,
  video {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const FaqGrid = styled.div`
  display: grid;
  gap: 20px;
  max-width: 800px;
  margin: 40px auto;
`;

const FaqItem = styled(motion.div)`
  background: ${({ theme }) => `${theme.colors.surface}CC`};
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  h4 {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.2rem;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1rem;
    line-height: 1.6;
  }
`;

// Add these styled components
const ContentBreak = styled.div`
  text-align: center;
  margin: 80px 0;
  color: ${({ theme }) => theme.colors.textSecondary};

  h3 {
    font-size: clamp(1.5rem, 3vw, 2rem);
    margin-bottom: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const CtaSection = styled.section`
  position: relative;
  padding: 120px 20px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  text-align: center;
  color: white;
`;

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: 20px;
    font-family: "Racing Sans One", "Poppins", sans-serif;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 40px;
    line-height: 1.6;
  }
`;

const CtaButton = styled(Button)`
  font-size: 1.2rem;
  padding: 15px 40px;
  background: ${({ theme }) => theme.colors.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

// Add these styled components
const BackgroundLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  height: 100%;
`;

const AnimatedLine = styled(motion.path)`
  stroke: ${({ theme }) => theme.colors.primary}10;
  stroke-width: 1;
  fill: none;
  stroke-linecap: round;
  filter: blur(0.5px);
`;

// Update the SVG component with twisted lines
const BackgroundAnimation = () => (
  <BackgroundLines>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <AnimatedLine
        d="M20,0 C20,25 80,75 20,100"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <AnimatedLine
        d="M40,0 C40,25 60,75 40,100"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.3,
        }}
      />
      <AnimatedLine
        d="M60,0 C60,25 40,75 60,100"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3.4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.6,
        }}
      />
      <AnimatedLine
        d="M80,0 C80,25 20,75 80,100"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3.6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.9,
        }}
      />

      {/* Additional connecting lines for more complexity */}
      <AnimatedLine
        d="M30,0 C30,25 70,75 30,100"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3.3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.2,
        }}
      />
      <AnimatedLine
        d="M70,0 C70,25 30,75 70,100"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 3.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.7,
        }}
      />
    </svg>
  </BackgroundLines>
);

// Update the section to properly contain the background
const StatsAndHighlightsSection = styled(Section)`
  position: relative;
  overflow: hidden;

  & > ${Container} {
    position: relative;
    z-index: 2;
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

  const [highlights, setHighlights] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const items = await galleryService.getAllItems(1, 4); // Get first 4 items
        setHighlights(items);
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };

    fetchHighlights();
  }, []);

  const renderMedia = (item) => {
    if (item.type === "video") {
      return <video src={item.url} muted loop playsInline autoPlay />;
    }
    return <img src={item.url} alt={item.title || "Community Highlight"} />;
  };

  return (
    <>
      <Helmet>
        <title>Rocky Mountain Rambler | Home</title>
        <meta
          name="description"
          content="Join the Rocky Mountain Rambler 500 - A unique automotive adventure combining car shows, adventure courses, and community events in the Rocky Mountains."
        />
        <meta property="og:title" content="Rocky Mountain Rambler 500" />
        <meta
          property="og:description"
          content="Join us for an unforgettable automotive adventure in the Rocky Mountains."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rockymtnrambler.com" />
        <meta
          property="og:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
        />
      </Helmet>

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
            ...is an annual event where people take their beater cars, fix them
            up just enough to run, and put them to the test. It's all about fun,
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
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
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://cdn.midjourney.com/007615c1-a1b4-4c06-94bd-d9f1121e2b9a/0_1.png"
                alt="Beater Challenge"
              />
            </FeatureImage>
          </FeatureCard>

          <TimelineContainer>
            <TimelineImage
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <img
                src="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
                alt="Three Day Event"
              />
            </TimelineImage>

            <TimelineContent>
              <h3>A Three-Day Extravaganza</h3>
              {["Car Show", "Adventure Course", "Trophy Ceremony"].map(
                (day, index) => (
                  <TimelineItem
                    key={day}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <h4>
                      Day {index + 1}: {day}
                    </h4>
                    <p>{getTimelineDescription(day)}</p>
                  </TimelineItem>
                )
              )}
            </TimelineContent>
          </TimelineContainer>
        </Container>
      </Section>

      <StatsAndHighlightsSection>
        <BackgroundAnimation />
        <Container>
          <SectionTitle>By The Numbers</SectionTitle>
          <StatsGrid>
            {[
              { number: "500+", label: "Miles Covered" },
              { number: "50+", label: "Beaters Transformed" },
              { number: "$1000s", label: "in Prizes" },
              { number: "∞", label: "Memories Made" },
            ].map((stat, index) => (
              <StatItem
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </StatItem>
            ))}
          </StatsGrid>

          <ContentBreak>
            <h3>More Than Just Racing</h3>
            <p>
              The Rocky Mountain Rambler 500 is where automotive passion meets
              adventure. Every beater has a story, and every driver becomes part
              of our growing community.
            </p>
          </ContentBreak>

          <CommunityHighlights />
        </Container>
      </StatsAndHighlightsSection>

      <SponsorsSection>
        <Container>
          <SectionTitle>Our Sponsors</SectionTitle>
          <SponsorsGrid>
            <a
              href="https://www.pineridgeseamlessgutters.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SponsorLogo
                src="https://arusimages.s3.us-west-2.amazonaws.com/logo2.png"
                alt="Pine Ridge Seamless Gutters"
              />
            </a>
            <a
              href="https://www.blackmonarchhotel.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SponsorLogo
                src="https://arusimages.s3.us-west-2.amazonaws.com/logo1.png"
                alt="Black Monarch Hotel"
              />
            </a>
            <a
              href="https://www.squatchdisposal.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SponsorLogo
                src="https://arusimages.s3.us-west-2.amazonaws.com/sdtranslogo.png"
                alt="Squatch Disposal"
              />
            </a>
            <a
              href="https://westernskiesco.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SponsorLogo
                src="https://arusimages.s3.us-west-2.amazonaws.com/WSDC_Logo_for_Shopify_200x200_96_dpi.png"
                alt="Western Skies Design Co"
              />
            </a>
            <a
              href="https://www.facebook.com/people/Taylor-Built-painting-and-remodeling/100063595890182/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SponsorLogo
                src="https://arusimages.s3.us-west-2.amazonaws.com/tbtranslogo.png"
                alt="Taylor Built Painting and Remodeling"
              />
            </a>
            <a
              href="https://rawsonroofing.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SponsorLogo
                src="https://arusimages.s3.us-west-2.amazonaws.com/rawsontransparent.png"
                alt="Rawson Roofing"
              />
            </a>
          </SponsorsGrid>
        </Container>
      </SponsorsSection>

      <CtaSection>
        <CtaContent>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Join the Adventure?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Don't miss out on the most exciting budget racing event in the
            Rockies. Grab your beater and join us for an unforgettable
            experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <CtaButton
              to="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </CtaButton>
          </motion.div>
        </CtaContent>
      </CtaSection>
    </>
  );
}

function CommunityHighlights() {
  const [highlights, setHighlights] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const items = await galleryService.getAllItems(1, 8);
        setHighlights(items.slice(0, 8)); // Explicitly limit to 8 items
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };

    fetchHighlights();
  }, []);

  const renderMedia = (item) => {
    if (item.type === "video") {
      return <video src={item.url} muted loop playsInline autoPlay />;
    }
    return <img src={item.url} alt={item.title || "Community Highlight"} />;
  };

  return (
    <>
      <SectionTitle>Community Highlights</SectionTitle>
      <HighlightsGrid>
        {highlights.map((item, index) => (
          <HighlightItem
            key={item.id}
            onClick={() => setSelectedItem(item)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <HighlightMedia>{renderMedia(item)}</HighlightMedia>
          </HighlightItem>
        ))}
      </HighlightsGrid>

      <AnimatePresence>
        {selectedItem && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <CloseButton onClick={() => setSelectedItem(null)}>×</CloseButton>
              {selectedItem.type === "video" ? (
                <video
                  src={selectedItem.url}
                  autoPlay
                  controls
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title || "Gallery image"}
                />
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;
