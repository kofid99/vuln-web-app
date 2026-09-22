export default function handler(req, res) {
  // VULN: No authentication check — anyone can call this endpoint
  // VULN: Sensitive data returned with no authorization
  return res.status(200).json({
    message: "Admin data accessed",
    users: [
      { id: 1, email: "admin@company.com", role: "admin", password_hash: "$2b$10$fakehashedpassword123" },
      { id: 2, email: "john@company.com", role: "user", password_hash: "$2b$10$fakehashedpassword456" },
      { id: 3, email: "jane@company.com", role: "user", password_hash: "$2b$10$fakehashedpassword789" },
    ],
    server_info: {
      framework: "Next.js 15",
      database: "Supabase",
      environment: "production",
    }
  });
}