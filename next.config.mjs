/** @type {import('next').NextConfig} */
const nextConfig = {
  // O protótipo usa <img> simples para os anexos de exemplo; não bloquear o build por isso.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
