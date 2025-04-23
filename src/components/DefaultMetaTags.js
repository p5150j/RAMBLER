import { Helmet } from "react-helmet-async";

const DefaultMetaTags = () => {
  return (
    <Helmet>
      <title>Rocky Mountain Rambler 500 - Off-Road Adventure Event</title>
      <meta
        name="description"
        content="Experience the ultimate off-road adventure in the Rocky Mountains. The Rocky Mountain Rambler 500 combines challenging terrain, stunning landscapes, and an incredible community of off-road enthusiasts."
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rockymtnrambler.com/" />
      <meta property="og:site_name" content="Rocky Mountain Rambler 500" />
      <meta
        property="og:title"
        content="Rocky Mountain Rambler 500 - Off-Road Adventure Event"
      />
      <meta
        property="og:description"
        content="Experience the ultimate off-road adventure in the Rocky Mountains. Join us for challenging terrain, stunning landscapes, and an incredible community of off-road enthusiasts."
      />
      <meta
        property="og:image"
        content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://rockymtnrambler.com/" />
      <meta
        name="twitter:title"
        content="Rocky Mountain Rambler 500 - Off-Road Adventure Event"
      />
      <meta
        name="twitter:description"
        content="Experience the ultimate off-road adventure in the Rocky Mountains. Join us for challenging terrain, stunning landscapes, and an incredible community of off-road enthusiasts."
      />
      <meta
        name="twitter:image"
        content="https://cdn.midjourney.com/7acc5f35-d99b-4c67-ba76-ed427ee66105/0_0.png"
      />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#FF3E3E" />
      <link rel="canonical" href="https://rockymtnrambler.com/" />
    </Helmet>
  );
};

export default DefaultMetaTags;
