import next_pwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withPWA = next_pwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

export default withPWA(nextConfig);
