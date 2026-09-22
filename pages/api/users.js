export default function handler(req, res) {
  // VULN: No authentication — user enumeration at scale
  // VULN: Returns PII with no authorization
  return res.status(200).json({
    total_users: 3,
    users: [
      { id: 1, email: "admin@company.com", role: "admin", last_login: "2026-09-21T10:30:00Z" },
      { id: 2, email: "john@company.com", role: "user", last_login: "2026-09-20T14:22:00Z" },
      { id: 3, email: "jane@company.com", role: "user", last_login: "2026-09-19T09:15:00Z" },
    ]
  });
}
