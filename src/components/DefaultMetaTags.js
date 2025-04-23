import { Helmet } from "react-helmet-async";

const DefaultMetaTags = () => {
  return (
    <Helmet>
      <title>Rocky Mountain Rambler 500</title>
      <meta
        name="description"
        content="Join the Rocky Mountain Rambler 500, an exciting off-road adventure event in the Rocky Mountains. Register now for an unforgettable experience!"
      />
      <meta property="og:title" content="Rocky Mountain Rambler 500" />
      <meta
        property="og:description"
        content="Join the Rocky Mountain Rambler 500, an exciting off-road adventure event in the Rocky Mountains. Register now for an unforgettable experience!"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rockymtnrambler.com/" />
      <meta
        property="og:image"
        content="https://rockymtnrambler.com/assets/og-image.jpg"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Rocky Mountain Rambler 500" />
      <meta
        name="twitter:description"
        content="Join the Rocky Mountain Rambler 500, an exciting off-road adventure event in the Rocky Mountains. Register now for an unforgettable experience!"
      />
      <meta
        name="twitter:image"
        content="https://rockymtnrambler.com/assets/og-image.jpg"
      />
      <meta name="twitter:url" content="https://rockymtnrambler.com/" />
    </Helmet>
  );
};

export default DefaultMetaTags;
