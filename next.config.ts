/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "", // Deixe vazio se não houver porta
        pathname: "/**", // Permitir todos os caminhos
      },
    ],
  },
};

module.exports = nextConfig;
