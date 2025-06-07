import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    domains: ['www.upload.ee', 'upload.ee'], // Adicione todos os domínios que você usa
    // Ou use o padrão mais seguro com remotePatterns:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.upload.ee',
      },
      // Adicione outros padrões conforme necessário
    ],
  },
  // ... outras configurações
};

export default nextConfig;
