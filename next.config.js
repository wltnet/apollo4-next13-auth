/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  env: {
    customKey: 'my-value',
  },
  reactStrictMode: false,
}
// reactStrictMode: false,
// module.exports = nextConfig
export default nextConfig;
