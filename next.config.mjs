/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // VULN: CORS wildcard — any origin can make requests
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          // VULN: Missing Content-Security-Policy — XSS possible
          // VULN: Missing X-Frame-Options — clickjacking possible
          // VULN: Missing Permissions-Policy — browser features unrestricted
          // VULN: Missing X-Content-Type-Options — MIME sniffing possible
        ],
      },
    ];
  },
};

export default nextConfig;