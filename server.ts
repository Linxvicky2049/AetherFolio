import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "src/data/users_db.json");

// JSON parsed body limit
app.use(express.json({ limit: "50mb" }));

// Ensure database file and directory exist
function ensureDatabase() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // Seed with initial users mapping to PRESET_STUDENT
    const seedData = {
      users: [
        {
          id: "user-01",
          name: "Alexandra Carter",
          email: "alexandra.carter@cs.stanford.edu",
          passwordHash: crypto.createHash("sha256").update("password123").digest("hex"),
          isEmailVerified: true,
          activationCode: "459201",
          isMFAEnabled: false
        },
        {
          id: "user-02",
          name: "Dr. Hartmut Neven",
          email: "hneven@google.com",
          passwordHash: crypto.createHash("sha256").update("password123").digest("hex"),
          isEmailVerified: true,
          activationCode: "110398",
          isMFAEnabled: false
        }
      ],
      profiles: {} as Record<string, any>
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), "utf-8");
  }
}

ensureDatabase();

// Load / Save DB helpers
function loadDatabase() {
  ensureDatabase();
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read database:", err);
    return { users: [], profiles: {} };
  }
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save database:", err);
  }
}

// Simple session token generator
const SESSION_SECRET = "aetherfolio-super-secret-key-2026";
function generateToken(user: { id: string; email: string; name: string }) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + 24 * 3600 // 1 day
  })).toString("base64");
  
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64");
    
  return `${header}.${payload}.${signature}`;
}

// Authentication middleware
function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access. No session token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const [header, payload, signature] = token.split(".");
    const computedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64");

    if (computedSignature !== signature) {
      return res.status(401).json({ error: "Invalid session token signature." });
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"));
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: "Session token has expired." });
    }

    req.user = decodedPayload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Malformatted or invalid token." });
  }
}

// ==================== API ROUTES ====================

// Check health
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password parameters are required." });
  }

  const db = loadDatabase();
  const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const userId = "user-" + crypto.randomBytes(6).toString("hex");
  const newUser = {
    id: userId,
    name,
    email,
    passwordHash: crypto.createHash("sha256").update(password).digest("hex"),
    isEmailVerified: true, // Auto-verified for simplified onboarding flow
    activationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    isMFAEnabled: false
  };

  // Seed default student profile for this new user
  const defaultProfile = {
    id: "profile-" + crypto.randomBytes(6).toString("hex"),
    fullName: name,
    email: email,
    phone: "",
    headline: "Verified Candidate Portfolio Hub",
    location: "Global",
    bio: "This is your newly generated professional candidate profile. Click 'Edit' above to personalize your biography, education achievements, and career experiences.",
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
    socials: {
      github: "",
      linkedin: "",
      twitter: "",
      website: ""
    },
    projects: [],
    education: [],
    experience: [],
    encryptedDocuments: [],
    hasMasterPasswordSet: false,
    skills: []
  };

  db.users.push(newUser);
  db.profiles[userId] = defaultProfile;
  saveDatabase(db);

  const token = generateToken(newUser);
  res.status(201).json({
    message: "Registration successful",
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const db = loadDatabase();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  if (user.passwordHash !== passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = generateToken(user);
  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// Auth Me
app.get("/api/auth/me", authenticate, (req: any, res) => {
  res.json({ user: req.user });
});

// Forgot Password
app.post("/api/auth/forgot", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email parameter is required." });
  }

  const db = loadDatabase();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "No account registered with this email address." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.activationCode = code;
  saveDatabase(db);

  res.json({
    message: "A verification code has been generated and queued.",
    code // Return the code directly to make demonstration seamless
  });
});

// Verify OTP / Verification Code
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email and verification code are required." });
  }

  const db = loadDatabase();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User account not found." });
  }

  if (user.activationCode !== code) {
    return res.status(400).json({ error: "The security verification code is incorrect." });
  }

  res.json({ message: "Verification successful.", token: generateToken(user) });
});

// Get Profile (Authenticated User)
app.get("/api/profile", authenticate, (req: any, res) => {
  const db = loadDatabase();
  let userProfile = db.profiles[req.user.id];
  
  if (!userProfile) {
    // Fallback: If user is Alexandra Carter (user-01), link her preset student profile
    if (req.user.email === "alexandra.carter@cs.stanford.edu") {
      // Import PRESET_STUDENT directly
      try {
        const presetPath = path.join(process.cwd(), "src/data/presetProfile.ts");
        if (fs.existsSync(presetPath)) {
          // Just use static representation if file exist
          userProfile = db.profiles["user-01"] || null;
        }
      } catch (e) {}
    }

    if (!userProfile) {
      userProfile = {
        id: "profile-" + crypto.randomBytes(6).toString("hex"),
        fullName: req.user.name,
        email: req.user.email,
        phone: "",
        headline: "Verified Candidate Portfolio Hub",
        location: "Global",
        bio: "Create your portfolio biography here.",
        socials: { github: "", linkedin: "", twitter: "", website: "" },
        projects: [],
        education: [],
        experience: [],
        encryptedDocuments: [],
        hasMasterPasswordSet: false,
        skills: []
      };
      db.profiles[req.user.id] = userProfile;
      saveDatabase(db);
    }
  }

  res.json({ profile: userProfile });
});

// Update Profile (Authenticated User)
app.post("/api/profile", authenticate, (req: any, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Profile payload is required." });
  }

  const db = loadDatabase();
  db.profiles[req.user.id] = profile;
  saveDatabase(db);

  res.json({ message: "Profile updated successfully", profile });
});

// Get Public Profile (Unauthenticated Access)
app.get("/api/profile/public/:userIdOrEmail", (req, res) => {
  const { userIdOrEmail } = req.params;
  const db = loadDatabase();

  // Find user by ID or email
  const user = db.users.find(
    (u: any) => u.id === userIdOrEmail || u.email.toLowerCase() === userIdOrEmail.toLowerCase()
  );

  if (!user) {
    return res.status(404).json({ error: "Public portfolio not found." });
  }

  const profile = db.profiles[user.id];
  if (!profile) {
    return res.status(404).json({ error: "Portfolio records are currently unconfigured." });
  }

  // Filter sensitive properties if necessary (documents stay encrypted anyway)
  res.json({ profile });
});

// Admin endpoint for users query in gateway simulation
app.get("/api/admin/users", (req, res) => {
  const db = loadDatabase();
  // Map users to avoid sending password hashes directly if preferred, but the frontend checks passwordHash (although we modified the frontend login to call /api/auth/login, the frontend may still map user list)
  res.json({
    users: db.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      isEmailVerified: u.isEmailVerified
    }))
  });
});

// ==================== VITE MIDDLEWARE SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
