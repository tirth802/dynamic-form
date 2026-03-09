/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
   // allow images coming from Cloudinary (or other hosts you add later)
  images: {
    domains: ['res.cloudinary.com'],
    // alternatively you can use `remotePatterns` for finer control:
    // remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }],
  },
};

export default nextConfig;
