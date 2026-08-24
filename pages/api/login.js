export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  // VULN 1: Hardcoded admin credentials — auth bypass
  // VULN 2: No rate limiting — brute force possible
  if (email === "admin@company.com" && password === "admin123") {
    return res.status(200).json({ message: "Login successful", role: "admin" });
  }

  // VULN 3: User enumeration — different message for wrong password vs wrong email
  if (email === "admin@company.com") {
    return res.status(401).json({ message: "Wrong password" });
  }

  return res.status(401).json({ message: "User not found" });
}