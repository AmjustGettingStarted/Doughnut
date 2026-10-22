import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Vite served every host. Next blocks dev assets when the browser host is
  // not localhost, which leaves the loader stuck on http://127.0.0.1:3000.
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
