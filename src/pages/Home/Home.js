import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const HeroSection = styled.section`
  position: relative;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
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

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.08)' fill-rule='evenodd'/%3E%3C/svg%3E");
    z-index: 2;
    animation: moveBackground 30s linear infinite;
    opacity: 0.6;
  }

  @keyframes moveBackground {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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

  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SubTitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 30px;
  max-width: 600px;
  margin: 0 auto 30px;
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

const Section = styled.section`
  padding: 80px 20px;
  background: ${({ theme, alt }) =>
    alt ? theme.colors.surface : theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
  margin-bottom: 20px;
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

function Home() {
  const { scrollY } = useScroll();

  // Smooth parallax effect
  const y = useSpring(useTransform(scrollY, [0, 1000], [0, 300]), {
    damping: 15,
    mass: 0.1,
  });

  // Smooth scale effect
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
        <HeroContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            ROCKY MOUNTAIN RAMBLER 500
          </Title>
          <SubTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Where creativity meets the track. Build it under $3K, race it like
            there's no tomorrow.
          </SubTitle>
          <Button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(255, 62, 62, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            to="/events"
          >
            Join The Race
          </Button>
        </HeroContent>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Unleash Your Inner Engineer</SectionTitle>
          <SectionText>
            Trust fund readymade flexitarian fashion axe roof party post-ironic
            hoodie enamel pin ramps ethical ascot 90's shaman. Pickled taiyaki
            aesthetic, microdosing narwhal hammock hexagon shabby chic.
          </SectionText>
          <Grid>
            <Card>
              <CardImage
                src="https://images.unsplash.com/photo-1618312980084-67efa94d67b6?q=80&w=1470"
                alt="Race car"
              />
              <CardContent>
                <h3 style={{ color: "#fff", marginBottom: "10px" }}>
                  Budget Builds
                </h3>
                <p style={{ color: "#B0B0B0" }}>
                  DIY trust fund hexagon vexillologist pickled fit gentrify
                  listicle fashion axe wayfarers hella pok pok.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardImage
                src="https://images.unsplash.com/photo-1591278169792-6f1cbf1d2762?w=500"
                alt="Race car"
              />
              <CardContent>
                <h3 style={{ color: "#fff", marginBottom: "10px" }}>
                  Epic Races
                </h3>
                <p style={{ color: "#B0B0B0" }}>
                  Selvage hexagon lo-fi, portland craft beer gastropub copper
                  mug occupy swag etsy iPhone coloring book.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardImage
                src="https://images.unsplash.com/photo-1702146713882-2579afb0bfba?q=80&w=1470"
                alt="Race car"
              />
              <CardContent>
                <h3 style={{ color: "#fff", marginBottom: "10px" }}>
                  Community
                </h3>
                <p style={{ color: "#B0B0B0" }}>
                  Meditation everyday carry cloud bread, tilde VHS sus offal
                  disrupt blue bottle biodiesel normcore.
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>

      <Section alt>
        <Container>
          <SectionTitle>Join The Adventure</SectionTitle>
          <SectionText>
            Pork belly schlitz keytar kickstarter church-key neutra lumbersexual
            dreamcatcher street art banh mi tattooed mixtape ennui kogi master
            cleanse. Trust fund readymade flexitarian fashion axe.
          </SectionText>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Button to="/signup">Register Now</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default Home;
