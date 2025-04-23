import { Helmet } from "react-helmet-async";

const DefaultMetaTags = () => {
  return (
    <Helmet>
      <title>Rocky Mountain Rambler 500</title>
      <meta
        name="description"
        content="Join the Rocky Mountain Rambler 500 - an annual event where enthusiasts take their beater cars, fix them up just enough to run, and put them to the test. Experience fun, creativity, and the ultimate gearhead challenge."
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rockymtnrambler.com/" />
      <meta property="og:title" content="Rocky Mountain Rambler 500" />
      <meta
        property="og:description"
        content="Join the Rocky Mountain Rambler 500 - an annual event where enthusiasts take their beater cars, fix them up just enough to run, and put them to the test. Experience fun, creativity, and the ultimate gearhead challenge."
      />
      <meta
        property="og:image"
        content="https://cdn.midjourney.com/007615c1-a1b4-4c06-94bd-d9f1121e2b9a/0_1.png"
      />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content="Rocky Mountain Rambler 500" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://rockymtnrambler.com/" />
      <meta property="twitter:title" content="Rocky Mountain Rambler 500" />
      <meta
        property="twitter:description"
        content="Join the Rocky Mountain Rambler 500 - an annual event where enthusiasts take their beater cars, fix them up just enough to run, and put them to the test. Experience fun, creativity, and the ultimate gearhead challenge."
      />
      <meta
        property="twitter:image"
        content="https://cdn.midjourney.com/007615c1-a1b4-4c06-94bd-d9f1121e2b9a/0_1.png"
      />
    </Helmet>
  );
};

export default DefaultMetaTags;
