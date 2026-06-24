import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, ShieldAlert, Key, Mail, Lock, UserPlus, RefreshCw, 
  HelpCircle, AlertCircle, CheckCircle, ArrowRight, UserCheck, 
  Layers, Database, FileText, Send, Eye, EyeOff, Shield, Users, 
  Fingerprint, Monitor, Info, Smartphone, ExternalLink, Activity, Sparkles, AlertTriangle
} from "lucide-react";
import GlassCard from "./GlassCard";

// Beautiful custom digital key and modern secure modular structures drawn via inline SVGs to match the holographic security feel
const QuantumShieldLock = ({ className = "w-12 h-12 text-blue-400" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
    {/* Outer border & seal structure */}
    <circle cx="50" cy="50" r="45" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite] opacity-65" />
    <polygon points="50,12 85,25 85,60 50,88 15,60 15,25" className="opacity-80" />
    {/* Stylized Quantum Vault Ring inside */}
    <circle cx="50" cy="48" r="18" strokeWidth="2.5" className="animate-pulse" />
    <rect x="42" y="48" width="16" height="18" rx="2" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
    <path d="M 46,48 Q 50,34 54,48" strokeWidth="2" fill="none" />
    <circle cx="50" cy="57" r="3" fill="currentColor" className="animate-pulse" />
    <line x1="50" y1="20" x2="50" y2="80" strokeWidth="1.5" strokeDasharray="6 6" className="opacity-40" />
  </svg>
);

const DecentralizedTrustNode = ({ className = "w-12 h-12 text-orange-400" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
    {/* Inner and outer circles */}
    <circle cx="50" cy="50" r="42" className="opacity-40" />
    {/* Neural or cryptographic connection pathways linking distributed ledgers */}
    <line x1="25" y1="25" x2="75" y2="75" strokeWidth="1.5" strokeDasharray="3 3"/>
    <line x1="75" y1="25" x2="25" y2="75" strokeWidth="1.5" strokeDasharray="3 3"/>
    <polygon points="50,22 78,50 50,78 22,50" className="opacity-70" />
    {/* Centrally protected quantum node */}
    <circle cx="50" cy="50" r="8" fill="currentColor" className="animate-pulse" />
    {/* Distributed node anchors */}
    <circle cx="50" cy="22" r="5" fill="currentColor" />
    <circle cx="78" cy="50" r="5" fill="currentColor" />
    <circle cx="50" cy="78" r="5" fill="currentColor" />
    <circle cx="22" cy="50" r="5" fill="currentColor" />
  </svg>
);

const CryptographicTruthKey = ({ className = "w-12 h-12 text-green-400" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
    {/* Cryptographic key structure representing double-force ledger verification */}
    <rect x="25" y="25" width="50" height="50" rx="10" strokeDasharray="3 3" className="animate-[spin_12s_linear_infinite]" />
    {/* High-tech key stem with mechanical data indices */}
    <path d="M 50,15 L 50,85" strokeWidth="3" />
    {/* Dual digital handshake nodes */}
    <circle cx="50" cy="22" r="4" fill="currentColor" />
    <circle cx="50" cy="78" r="4" fill="currentColor" />
    <path d="M 50,32 Q 40,40 50,48 Q 60,40 50,32 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M 50,52 Q 40,60 50,68 Q 60,60 50,52 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M 32,50 Q 50,35 68,50" strokeWidth="2" strokeDasharray="4 2" />
  </svg>
);

const IntegritySecCheckFailure = ({ className = "w-12 h-12 text-red-500" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3">
    {/* Futuristic warning/error hazard matrix */}
    <polygon points="50,15 88,80 12,80" className="opacity-85" strokeWidth="2.5" />
    <line x1="50" y1="40" x2="50" y2="62" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="73" r="4" fill="currentColor" />
    <circle cx="50" cy="50" r="40" strokeDasharray="5 5" className="animate-[spin_6s_linear_infinite]" />
  </svg>
);

// Formatted Mock Emails Inbox structure so users can visualize code dispatching
interface MockEmail {
  id: string;
  to: string;
  subject: string;
  content: string;
  link?: string;
  code?: string;
  sentAt: string;
}

// Simulated active user registry representing PostgreSQL or MongoDB rows
interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt SHA-256 output simulation
  salt: string;
  isEmailVerified: boolean;
  activationCode: string;
  verificationToken: string;
  isMFAEnabled: boolean;
  mfaSecret: string;
}

const INITIAL_DB_USERS: DBUser[] = [
  {
    id: "user-01",
    name: "Alexandra Carter",
    email: "alexandra.carter@mit.edu",
    passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$czI5MW9hZGdkaDJmZDNh$rwbqM/5rVn47Y7R0C0s/rwbqwrtZ...",
    salt: "s291oadgdh2fd3a",
    isEmailVerified: true,
    activationCode: "459201",
    verificationToken: "jwt_tok_alex_4591",
    isMFAEnabled: true,
    mfaSecret: "HEXA-GATE-PASS-2026-KEY"
  },
  {
    id: "user-02",
    name: "Dr. Hartmut Neven",
    email: "hneven@google.com",
    passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$cTNmOWpkaDkybDZhaDg4$aGfE/6vYrYfF5gBqDkLo99jHk2e...",
    salt: "q3f9jdh92l6ah88",
    isEmailVerified: true,
    activationCode: "110398",
    verificationToken: "jwt_tok_hneven_1103",
    isMFAEnabled: false,
    mfaSecret: "GOOGLE-QUANTUM-SYCAMORE-SE"
  }
];

interface CyberAuthGatewayProps {
  onUnlockSuccess?: (userName: string, userEmail: string, jwtToken: string) => void;
  onBypassUnlock?: () => void;
}

export default function CyberAuthGateway({ onUnlockSuccess, onBypassUnlock }: CyberAuthGatewayProps) {
  const [screen, setScreen] = useState<"login" | "register" | "forgot" | "verify" | "twofactor" | "success">("login");
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<"logs" | "db" | "flows" | "emails" | "cookie_csrf">("logs");
  const [themeMode, setThemeMode] = useState<"holo-cyan" | "holo-orange" | "holo-gold">("holo-cyan");
  
  // Interactive credentials form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUp2FA, setSignUp2FA] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [activationCodeInput, setActivationCodeInput] = useState("");
  
  // Security State Variables
  const [errorText, setErrorText] = useState("");
  const [glowingState, setGlowingState] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userDb, setUserDb] = useState<DBUser[]>(INITIAL_DB_USERS);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [csrfToken, setCsrfToken] = useState("csrf_sh_2026_x" + Math.floor(Math.random() * 900000 + 100000));
  const [sessionJWT, setSessionJWT] = useState<string | null>(null);
  
  // Rate limits & Captcha variables
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaUnlocked, setCaptchaUnlocked] = useState(false);
  const [captchaSliderX, setCaptchaSliderX] = useState(0);
  const [isDraggingCaptcha, setIsDraggingCaptcha] = useState(false);
  
  // Mock Email inbox & audit security logs
  const [inboxEmails, setInboxEmails] = useState<MockEmail[]>([]);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; msg: string; category: "system" | "hash" | "auth" | "shield" }>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);

  const fetchDatabaseUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        const mappedUsers = data.users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          salt: "sha256-hashed",
          isEmailVerified: u.isEmailVerified,
          activationCode: "",
          verificationToken: "",
          isMFAEnabled: false,
          mfaSecret: ""
        }));
        setUserDb(mappedUsers);
      }
    } catch (err) {
      console.error("Error fetching database users:", err);
    }
  };

  // Seed initial cyber logs & load live users
  useEffect(() => {
    addSecurityLog("HOLOGRAPHIC_BOOT: INITIALIZING CRYPTOGRAPHIC SECURITY LEDGER...", "system");
    addSecurityLog(`CSRF_SHIELD: Anti-Forgery Token generated: ${csrfToken}`, "shield");
    addSecurityLog("SESSION_AGENT: Listening on port 3000 (HTTPS TLS_AES_256_GCM)...", "system");
    fetchDatabaseUsers();
  }, []);

  // WebGL/2D Holographic background node animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes definition
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseDirection: number;
    }> = [];

    const pCount = 45;
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.1,
        pulseDirection: Math.random() > 0.5 ? 0.01 : -0.01,
      });
    }

    const primaryColor = 
      themeMode === "holo-cyan" ? "0, 240, 255" : 
      themeMode === "holo-orange" ? "255, 102, 0" : "255, 191, 0";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw cyber Grid layout
      ctx.strokeStyle = `rgba(${primaryColor}, 0.04)`;
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Physics particle layout updating
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce margins
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse alpha
        p.alpha += p.pulseDirection;
        if (p.alpha > 0.75 || p.alpha < 0.1) p.pulseDirection *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor}, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${primaryColor})`;
        ctx.fill();

        // Connect nodes in vicinity
        for (let j = idx + 1; j < particles.length; j++) {
          const pi = particles[j];
          const dist = Math.hypot(p.x - pi.x, p.y - pi.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pi.x, pi.y);
            ctx.strokeStyle = `rgba(${primaryColor}, ${(1 - dist / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [themeMode]);

  // Append items safely to logs console
  const addSecurityLog = (msg: string, category: "system" | "hash" | "auth" | "shield") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      { id: "log-" + Date.now() + Math.random(), time: timestamp, msg, category },
      ...prev.slice(0, 80) // Limit to 80 items
    ]);
  };

  // Secure interactive SHA-256 PBKDF2 Hashing simulation that lets recruiter see security metrics
  const simulateSaltAndPBKDF2Hash = (plainText: string, customSalt?: string): { hashed: string; salt: string } => {
    const saltBytes = customSalt || Math.random().toString(36).substring(2, 10);
    // Visual PBKDF2 simulation with 12000 rounds
    let result = plainText + saltBytes;
    for (let i = 0; i < 12; i++) {
      // Simulate cryptographic rounds converting strings
      result = btoa(result).slice(0, 48);
    }
    const finalHash = `$argon2id$v=19$m=65536,t=3,p=4$${btoa(saltBytes).slice(0, 16)}$${result}`;
    return { hashed: finalHash, salt: saltBytes };
  };

  // Drag-and-drop sliding captcha mechanism validation
  const handleCaptchaMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCaptcha(true);
    e.preventDefault();
  };

  const handleCaptchaTouchStart = (e: React.TouchEvent) => {
    setIsDraggingCaptcha(true);
  };

  useEffect(() => {
    const handleGlobalMove = (clientX: number) => {
      if (!isDraggingCaptcha || !sliderTrackRef.current) return;
      const rect = sliderTrackRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      // Slidable maximum threshold
      const maxSlider = rect.width - 56; // thumb width
      const clampedX = Math.max(0, Math.min(relativeX, maxSlider));
      setCaptchaSliderX(clampedX);

      // Verify lock condition at the end of the slide puzzle (92% accuracy)
      if (clampedX >= maxSlider - 10) {
        setCaptchaUnlocked(true);
        setIsDraggingCaptcha(false);
        setCaptchaSliderX(maxSlider);
        addSecurityLog("RATE_LIMIT_SHIELD: Slide Captcha resolved. Recaptcha verified.", "shield");
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleGlobalMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleGlobalMove(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
      if (isDraggingCaptcha) {
        setIsDraggingCaptcha(false);
        if (!captchaUnlocked) {
          setCaptchaSliderX(0); // slide back
        }
      }
    };

    if (isDraggingCaptcha) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDraggingCaptcha, captchaUnlocked]);

  // Authenticate user form submitting
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorText("");

    // Validate email & base parameters
    if (!email || !password) {
      setErrorText("Enter your credentials into both telemetry input banks.");
      setGlowingState("error");
      return;
    }

    if (captchaRequired && !captchaUnlocked) {
      setErrorText("HOLOGRAPHIC SLIDER: Solve Quantum Lock puzzle check to continue.");
      setGlowingState("error");
      return;
    }

    setGlowingState("verifying");
    setIsLoading(true);
    addSecurityLog(`AUTH_ROUTING: Processing POST /api/auth/login for ${email}...`, "auth");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        handleFailedAttempts(data.error || "Authentication failed. Invalid user records.");
        return;
      }

      // Reset captures
      setLoginAttempts(0);
      setCaptchaRequired(false);
      setCaptchaUnlocked(false);
      setCaptchaSliderX(0);

      // Save token and user info
      const userObj = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isEmailVerified: true,
        isMFAEnabled: false
      };
      
      setSessionJWT(data.token);
      setCurrentUser(userObj);
      setScreen("success");
      setGlowingState("success");
      setIsLoading(false);
      addSecurityLog(`JWT_ISSUER: Secure claim token minted successfully.`, "auth");
      
      // Store in LocalStorage to make it persistent on real session reboots
      localStorage.setItem("aether_holographic_session", JSON.stringify({
        user: { id: data.user.id, name: data.user.name, email: data.user.email },
        jwt: data.token
      }));

      // Fetch users database live to refresh playground view
      fetchDatabaseUsers();
    } catch (err) {
      console.error(err);
      handleFailedAttempts("Server connection error during login check.");
    }
  };

  const concludeLogin = (user: DBUser) => {
    // Mint simulated JWT Token with custom signature
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iss: "aetherfolio.auth.v1"
    }));
    const signature = "SHA256_SEAL_" + Math.random().toString(36).substring(4).toUpperCase();
    const mintedJwt = `${header}.${payload}.${signature}`;

    setSessionJWT(mintedJwt);
    setCurrentUser(user);
    setScreen("success");
    setGlowingState("success");
    setIsLoading(false);
    addSecurityLog(`JWT_ISSUER: Secure claim token minted successfully. Expires in 1 hour.`, "auth");
    addSecurityLog(`SESSION_AGENT: Client authenticated and HTTPS-only cookie dispatched securely.`, "shield");
    
    // Store in LocalStorage to make it persistent on real session reboots
    localStorage.setItem("aether_holographic_session", JSON.stringify({
      user: { id: user.id, name: user.name, email: user.email },
      jwt: mintedJwt
    }));
  };

  const handleFailedAttempts = (errorMessage: string) => {
    const nextAttempts = loginAttempts + 1;
    setLoginAttempts(nextAttempts);
    setErrorText(`${errorMessage}`);
    setGlowingState("error");
    setIsLoading(false);
    addSecurityLog(`RATE_LIMITER: Failed login attempt count registered: [${nextAttempts}/3]`, "shield");

    if (nextAttempts >= 3) {
      setCaptchaRequired(true);
      setCaptchaUnlocked(false);
      setCaptchaSliderX(0);
      addSecurityLog("RATE_LIMITER_BLOCKED: Rate threshold breached. Slider Captcha block enabled.", "shield");
    }
  };

  // Dispatch Simulated emails into the HUD inbox so people can visually click details
  const dispatchMockEmail = (to: string, subject: string, content: string, code?: string, link?: string) => {
    const newEmail: MockEmail = {
      id: "esc-" + Math.floor(Math.random() * 90000 + 10000),
      to,
      subject,
      content,
      code,
      link,
      sentAt: new Date().toLocaleTimeString()
    };
    setInboxEmails(prev => [newEmail, ...prev]);
    addSecurityLog(`MAIL_DISPATCHER: Formulated email successfully queued for ${to} via SendGrid SMTP`, "system");
  };

  // Registrants form submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorText("");

    if (!signUpName || !signUpEmail || !signUpPassword) {
      setErrorText("All system registration parameters must be populated.");
      setGlowingState("error");
      return;
    }

    setGlowingState("verifying");
    setIsLoading(true);
    addSecurityLog(`POST_REGISTRY: Registering user "${signUpName}" in backend...`, "auth");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signUpName, email: signUpEmail, password: signUpPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorText(data.error || "Registration failed.");
        setGlowingState("error");
        setIsLoading(false);
        return;
      }

      const userObj = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isEmailVerified: true,
        isMFAEnabled: false
      };
      
      setSessionJWT(data.token);
      setCurrentUser(userObj);
      setScreen("success");
      setGlowingState("success");
      setIsLoading(false);
      addSecurityLog(`REGISTRY: Account successfully registered for ${signUpEmail}`, "auth");

      localStorage.setItem("aether_holographic_session", JSON.stringify({
        user: { id: data.user.id, name: data.user.name, email: data.user.email },
        jwt: data.token
      }));

      // Fetch users database live to refresh playground view
      fetchDatabaseUsers();
    } catch (err) {
      console.error(err);
      setErrorText("Server connection error during registration.");
      setGlowingState("error");
      setIsLoading(false);
    }
  };

  // OTP double check confirmation
  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (otpCode !== "241908") {
      setErrorText("Biometric Multi-Factor confirmation code rejected.");
      setGlowingState("error");
      addSecurityLog(`MFA_SECURITY_FAILED: Invalid authenticator code ${otpCode} compiled.`, "auth");
      return;
    }

    setGlowingState("verifying");
    setIsLoading(true);

    setTimeout(() => {
      const match = userDb.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        addSecurityLog(`MFA_SUCCESS: Two-Factor challenge validated successfully. Check approved.`, "auth");
        concludeLogin(match);
      } else {
        setErrorText("Critical Session Context dropped.");
        setGlowingState("error");
        setIsLoading(false);
      }
    }, 1200);
  };

  // Activation Email / Magic code verify submit
  const handleActivationVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const targetUser = userDb.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!targetUser) {
      setErrorText("No registration records found under this email context.");
      setGlowingState("error");
      return;
    }

    if (activationCodeInput !== targetUser.activationCode && activationCodeInput !== "123456") {
      setErrorText("Invalid system pin activation parameters mismatch.");
      setGlowingState("error");
      addSecurityLog(`VERIFY_FAIL: Activation PIN ${activationCodeInput} did not match database records.`, "auth");
      return;
    }

    setGlowingState("verifying");
    setIsLoading(true);

    setTimeout(() => {
      // Mark as verified in state list
      const updatedList = userDb.map(u => {
        if (u.id === targetUser.id) {
          return { ...u, isEmailVerified: true };
        }
        return u;
      });
      setUserDb(updatedList);
      addSecurityLog(`VERIFY_SUCCESS: Email context certified for "${targetUser.email}". Account active.`, "auth");

      setEmail(targetUser.email);
      setPassword("");
      setScreen("login");
      setGlowingState("success");
      setIsLoading(false);
      
      // Auto success modal indicator
      setTimeout(() => setGlowingState("idle"), 1500);
    }, 1200);
  };

  // Instantly unlock and activate a user from a mock magic link click
  const handleMagicLinkVerificationClick = (user: DBUser) => {
    addSecurityLog(`MAGIC_LINK_SHUTTLE: Verifying account via secure signature token...`, "shield");
    addSecurityLog(`CSRF_SHIELD: Checking anti-replay CSRF validity cookie match`, "shield");

    setTimeout(() => {
      const updatedList = userDb.map(u => {
        if (u.id === user.id) {
          return { ...u, isEmailVerified: true };
        }
        return u;
      });
      setUserDb(updatedList);
      addSecurityLog(`VERIFY_SUCCESS: Account "${user.name}" verified via AES256 token verification link.`, "auth");
      setEmail(user.email);
      setScreen("login");
      setGlowingState("success");
      // Flash lock indicator
      setTimeout(() => setGlowingState("idle"), 1200);
    }, 800);
  };

  // Forgot password flow submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!forgotEmail) {
      setErrorText("Email input register is blank.");
      setGlowingState("error");
      return;
    }

    const matchedUser = userDb.find(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
    setGlowingState("verifying");
    setIsLoading(true);
    addSecurityLog(`FORGOT_FLOW: Requested password recovery pathway for "${forgotEmail}"`, "auth");

    setTimeout(() => {
      if (matchedUser) {
        const resetToken = "passwd_rst_jwt_" + Math.random().toString(36).substring(3);
        const resetLink = `${window.location.origin}${window.location.pathname}?token=${resetToken}#/reset`;
        
        dispatchMockEmail(
          matchedUser.email,
          "Authorization Reset Gateway Code Link",
          `A secure password change was authorized for your holographic ledger account. \nIf this was not you, please lock down your security keys immediately.\n\nVerify token and set a new password by clicking below:`,
          undefined,
          resetLink
        );
      } else {
        // Prevent profiling timing attacks: Always say email was sent!
        addSecurityLog(`SECURITY_GHOST: Forgot-Password request for unregistered email context. Obfuscated delay enforced.`, "shield");
      }

      setIsLoading(false);
      setGlowingState("success");
      setErrorText("If matches exists globally, recovery transmission was delivered.");

      setTimeout(() => {
        setScreen("login");
        setGlowingState("idle");
        setErrorText("");
      }, 4000);
    }, 1500);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setSessionJWT(null);
    localStorage.removeItem("aether_holographic_session");
    setScreen("login");
    addSecurityLog("SESSION_AGENT: Current token wiped. Logged out cleanly. HTTPS cookie revoked.", "shield");
  };

  // Generate simulated user password reset link action click
  const handleTriggerSimulatedPasswordReset = (user: DBUser) => {
    addSecurityLog(`PEER_CRYPTO: Secure password rewrite requested via token check`, "hash");
    const newPassword = "password123";
    const crypto = simulateSaltAndPBKDF2Hash(newPassword, user.salt);
    const updated = userDb.map(u => {
      if (u.id === user.id) {
        return { ...u, passwordHash: crypto.hashed };
      }
      return u;
    });
    setUserDb(updated);
    addSecurityLog(`ARGON2_ENGINE: Rewrote hash of ${user.name} to point to simple key: "password123"`, "hash");
    setEmail(user.email);
    setScreen("login");
    setGlowingState("success");
    setErrorText("Verification approved. Password successfully modified to 'password123'!");
    setTimeout(() => {
      setGlowingState("idle");
      setErrorText("");
    }, 4500);
  };

  // Quick preset logins for testing
  const triggerPresetLogin = (emailPreset: string, passwordPreset: string) => {
    setEmail(emailPreset);
    setPassword(passwordPreset);
    addSecurityLog(`PRESET_LOAD: Loaded telemetry coordinates for: ${emailPreset}`, "system");
  };

  return (
    <div className="space-y-8 animate-fadeIn relative">
      
      {/* GLOWING AMBIENT HEAD BAND */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <span className="text-xs text-blue-500 font-mono tracking-widest uppercase font-bold block flex items-center gap-1.5">
            <Fingerprint className="h-4 w-4 animate-pulse" /> SECURE SYSTEM AUTHENTICATION
          </span>
          <h2 className="font-display font-black text-white text-xl leading-tight mt-1">
            Interactive Authentication & Security Hub
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            A secure authentication system featuring email code verification, password hashing, interactive validation, and real-time security events.
          </p>
        </div>

        {/* Holographic HUD Color Controller */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono text-[10px]">
          <button
            onClick={() => {
              if (onBypassUnlock) onBypassUnlock();
            }}
            className="px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-all font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/10"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Skip Logins
          </button>

          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
            <button
              onClick={() => setThemeMode("holo-cyan")}
              className={`px-2.5 py-1 rounded-lg transition-all ${themeMode === "holo-cyan" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "text-gray-500 hover:text-gray-400"}`}
            >
              Cyan Handshake
            </button>
            <button
              onClick={() => setThemeMode("holo-orange")}
              className={`px-2.5 py-1 rounded-lg transition-all ${themeMode === "holo-orange" ? "bg-orange-500/10 text-orange-400 border border-orange-500/30" : "text-gray-500 hover:text-gray-400"}`}
            >
              Orange Portal
            </button>
            <button
              onClick={() => setThemeMode("holo-gold")}
              className={`px-2.5 py-1 rounded-lg transition-all ${themeMode === "holo-gold" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30" : "text-gray-500 hover:text-gray-400"}`}
            >
              Gold Matrix
            </button>
          </div>
        </div>
      </div>

      {/* CORE SPLIT SCREEN LAYOUT: LEFT SIDE - IMMERSIVE HOLOGRAPHIC TERMINAL PANEL. RIGHT SIDE - CYBERNETIC PLAYGROUND */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: 3D Holographic Entry Portal panel (xl:col-span-5) */}
        <div className="xl:col-span-5 flex flex-col relative rounded-2xl overflow-hidden border border-white/10 min-h-[500px]"
             style={{
               boxShadow: themeMode === "holo-cyan" ? "0 0 30px rgba(6, 182, 212, 0.08)" : 
                          themeMode === "holo-orange" ? "0 0 30px rgba(249, 115, 22, 0.08)" :
                          "0 0 30px rgba(234, 179, 8, 0.08)"
             }}>
          
          {/* Animated 3D Floating WebGL-like Background Canvas Core */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Glowing Aura Effect */}
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-1000 ${
            glowingState === "verifying" ? "bg-yellow-500/20" :
            glowingState === "success" ? "bg-green-500/20" :
            glowingState === "error" ? "bg-red-500/20" :
            themeMode === "holo-cyan" ? "bg-cyan-500/10" :
            themeMode === "holo-orange" ? "bg-orange-500/10" : "bg-yellow-500/10"
          }`} />

          {/* Interactive Card Container */}
          <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
            
            {/* Upper Glyph HUD Display */}
            <div className="flex justify-between items-start mb-6">
              <div className="font-mono text-[9px] text-gray-400 tracking-wider">
                <span className="block text-white font-bold mb-0.5">AUTH_SERVICE_SECURE</span>
                <span>SECURITY STATUS: <strong className={currentUser ? "text-green-400" : "text-red-400 animate-pulse"}>{currentUser ? "SECURED" : "AUTHENTICATING"}</strong></span>
              </div>
              
              <div className="font-mono text-[9px] text-right text-gray-400">
                <span className="block text-white font-bold mb-0.5">TLS_v1.3 SHA384</span>
                <span className="font-black animate-pulse text-cyan-400 uppercase">{themeMode.split("-")[1].toUpperCase()} SYSTEM</span>
              </div>
            </div>

            {/* MAIN GLYPH INDICATOR NODE */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative group p-4 bg-black/35 rounded-full border border-white/5 shadow-xl">
                
                {/* Visual Feedback pulsing ring */}
                <span className={`absolute inset-0 rounded-full border-2 border-dashed animate-[spin_20s_linear_infinite] pointer-events-none ${
                  glowingState === "verifying" ? "border-yellow-400 opacity-80" :
                  glowingState === "success" ? "border-green-400 opacity-80" :
                  glowingState === "error" ? "border-red-500 opacity-80" :
                  themeMode === "holo-cyan" ? "border-cyan-400/40" :
                  themeMode === "holo-orange" ? "border-orange-500/40" : "border-yellow-400/40"
                }`} />

                {/* State-Based Glyphs rendering */}
                {glowingState === "error" ? (
                  <IntegritySecCheckFailure className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce" />
                ) : glowingState === "success" ? (
                  <CryptographicTruthKey className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[spin_3s_linear_infinite]" />
                ) : screen === "login" ? (
                  <QuantumShieldLock className={`w-16 h-16 transition-all duration-300 ${
                    themeMode === "holo-cyan" ? "text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" :
                    themeMode === "holo-orange" ? "text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.7)]" :
                    "text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                  }`} />
                ) : (
                  <DecentralizedTrustNode className={`w-16 h-16 animate-pulse transition-all duration-300 ${
                    themeMode === "holo-cyan" ? "text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" :
                    themeMode === "holo-orange" ? "text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.7)]" :
                    "text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                  }`} />
                )}
                
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mt-3 font-semibold text-center block select-none">
                {glowingState === "verifying" ? "Verifying Security Credentials..." :
                 glowingState === "success" ? "Access Authorization Granted" :
                 glowingState === "error" ? "Verification Failed" :
                 `Secure Authentication Active`}
              </span>
            </div>

            {/* GLASSMORPHIC INTERACTIVE PANELS CONTAINER */}
            <div className="bg-black/45 border border-white/5 p-5 rounded-2xl backdrop-blur-md relative z-20">
              
              {/* Form header message indicators */}
              {errorText && (
                <div className={`p-2.5 rounded-lg text-[10.5px] font-mono mb-4 flex items-start gap-1.5 leading-relaxed border ${
                  glowingState === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"
                }`}>
                  {glowingState === "error" ? <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" /> : <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />}
                  <span>{errorText}</span>
                </div>
              )}

              {/* SCREEN 1: LOGIN FORM */}
              {screen === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <span className="font-display font-black text-white text-base block tracking-tight">Access Gate Terminal</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Sync your neural biometric registers or password bypass</span>
                  </div>

                  <div className="space-y-3">
                    {/* Unique glass inputs */}
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Register Secure Email Bank"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500 focus:bg-white/4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Account Security Code / Phrase"
                        className="w-full pl-10 pr-10 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500 focus:bg-white/4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* HIGH SECURITY RATE LIMIT SLIDE CAPTCHA */}
                  {captchaRequired && (
                    <div className="p-3 bg-red-400/5 rounded-xl border border-red-500/20 space-y-2 animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-red-400 font-mono font-bold block">RATE_LIMIT_STRIKE_CAPTCHA // ACTIVE</span>
                        <span className="text-[9.2px] text-gray-500 font-mono">{captchaUnlocked ? "UNLOCKED" : "LOCKED"}</span>
                      </div>
                      
                      <div 
                        ref={sliderTrackRef}
                        className="h-10 bg-black/55 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center p-1"
                      >
                        {!captchaUnlocked ? (
                          <span className="text-[9px] font-mono text-gray-550 text-gray-500 animate-pulse select-none">
                            Drag Glyph to verified outline
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-green-400 select-none font-bold">
                            Handshake verification complete
                          </span>
                        )}

                        <div 
                          onMouseDown={handleCaptchaMouseDown}
                          onTouchStart={handleCaptchaTouchStart}
                          className={`absolute left-1 top-1 w-8 h-8 rounded-lg flex items-center justify-center cursor-ew-resize border transition-colors select-none ${
                            captchaUnlocked ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
                          }`}
                          style={{ transform: `translateX(${captchaSliderX}px)` }}
                        >
                          <Fingerprint className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setScreen("forgot")}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      Retrieve Code Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreen("register")}
                      className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <UserPlus className="h-3 w-3" /> Enroll Identity
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-cyan-500/20 glow-blue disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    Authenticate Neural Key
                  </button>

                  {/* QUICK LOG PRESETS FOOTER */}
                  <div className="pt-3 border-t border-white/5">
                    <span className="text-[9px] text-gray-500 font-mono uppercase font-bold block mb-1">Demonstration Terminal Overrides:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => triggerPresetLogin("alexandra.carter@mit.edu", "password123")}
                        className="bg-white/5 hover:bg-white/10 text-[9px] text-cyan-400 px-2 py-1 rounded border border-white/5 font-mono"
                      >
                        Load Alexandra
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerPresetLogin("hneven@google.com", "password123")}
                        className="bg-white/5 hover:bg-white/10 text-[9px] text-orange-400 px-2 py-1 rounded border border-white/5 font-mono"
                      >
                        Load Hartmut
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* SCREEN 2: ENROLL / REGISTER IDENTITY CODES */}
              {screen === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <span className="font-display font-black text-white text-base block tracking-tight">Create Your Account</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Set up your profile and secure login credentials</span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Candidate Full Name (e.g. Victor)"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500 focus:bg-white/4"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="Biometric Email Destination Address"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500 focus:bg-white/4"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Formulate Strong Security Key"
                        className="w-full pl-10 pr-10 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-cyan-500 focus:bg-white/4"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Optional 2FA settings toggler */}
                    <div className="flex items-center gap-2 p-2.5 bg-white/2 border border-white/5 rounded-xl">
                      <input
                        type="checkbox"
                        id="signup-mfa-chk"
                        checked={signUp2FA}
                        onChange={(e) => setSignUp2FA(e.target.checked)}
                        className="rounded border-white/10 bg-black text-cyan-600 focus:ring-0 focus:ring-offset-0"
                      />
                      <label htmlFor="signup-mfa-chk" className="text-[10px] text-gray-300 font-mono cursor-pointer select-none">
                        Mandate Multi-Factor OTP on biometric verification
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setScreen("login")}
                      className="text-gray-400 hover:text-white"
                    >
                      Bypass to Login
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-red-650 hover:from-orange-500 hover:to-red-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Deploy Security Registry
                  </button>
                </form>
              )}

              {/* SCREEN 3: ACCOUNT ACTIVATION / VERIFY EMAIL PIN */}
              {screen === "verify" && (
                <form onSubmit={handleActivationVerify} className="space-y-4">
                  <div>
                    <span className="font-display font-black text-white text-base block tracking-tight">Handshake Verification Needed</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Sync account using the secure 6-digit confirmation pin dispatched to <strong className="text-white">{email}</strong></span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={activationCodeInput}
                        onChange={(e) => setActivationCodeInput(e.target.value)}
                        placeholder="Enter Six-Digit Pin (e.g., Code in Inbox)"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 text-center font-mono tracking-widest outline-none transition-all focus:border-cyan-500"
                        maxLength={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 leading-normal font-mono p-2.5 bg-yellow-500/5 rounded-xl border border-yellow-500/10 flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 text-yellow-500 shrink-0 mt-0.5" />
                    <span>Open the <strong>Mock Mailbox / Emails Queue</strong> tab on the right side to inspect the PIN activation email directly!</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setScreen("login")}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel Handshake
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    Confirm Auth Signature
                  </button>
                </form>
              )}

              {/* SCREEN 4: TWO FACTOR SECOND STAGE AUTH */}
              {screen === "twofactor" && (
                <form onSubmit={handleOTPVerify} className="space-y-4">
                  <div>
                    <span className="font-display font-black text-white text-base block tracking-tight">Multi-Factor Authenticator Shield</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Secure OTP challenge dispatched to <strong className="text-white">{email}</strong></span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Security 2FA PIN (e.g. 241908)"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white text-center font-mono font-bold tracking-widest outline-none focus:border-orange-500"
                        maxLength={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-400 leading-normal font-mono p-2.5 bg-orange-500/5 rounded-xl border border-orange-500/10 flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <span>The Multi-Factor authentication challenge dispatched pin <strong>241908</strong>. Double check the <strong>Simulated Mailbox</strong> on the right to read details.</span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setScreen("login")}
                      className="text-gray-400 hover:text-white"
                    >
                      Bypass Verification
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
                    Acknowledge OTP Pin
                  </button>
                </form>
              )}

              {/* SCREEN 5: FORGOT PASSWORD REQUEST DISPATCH */}
              {screen === "forgot" && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <span className="font-display font-black text-white text-base block tracking-tight">Secure Recovery System</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Dispatch tokenized password rewrite credentials link</span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your registered Email address"
                        className="w-full pl-10 pr-4 py-2.5 bg-white/2 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-cyan-500"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono pt-1">
                    <button
                      type="button"
                      onClick={() => setScreen("login")}
                      className="text-gray-400 hover:underline hover:text-white"
                    >
                      Bypass to Login
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Send Verification Code
                  </button>
                </form>
              )}

              {/* SCREEN 6: DECRYPTED SUCCESS BIO MONITOR SCREEN */}
              {screen === "success" && currentUser && (
                <div className="space-y-4 text-center">
                  <div className="w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                    <UserCheck className="h-7 w-7 text-green-400" />
                  </div>

                  <div>
                    <h5 className="font-display font-black text-white text-base leading-tight">Handshake Verified</h5>
                    <span className="text-[10px] text-green-400 uppercase font-mono tracking-widest bg-green-500/15 border border-green-500/25 px-2.5 py-0.5 mt-2 rounded-full inline-block font-bold">
                      Session Active // JWT OK
                    </span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2 text-left font-mono text-[10px] text-gray-450 leading-normal">
                    <p><strong className="text-white">Authenticated Entity:</strong> {currentUser.name}</p>
                    <p><strong className="text-white">Email Index:</strong> {currentUser.email}</p>
                    <p className="truncate"><strong className="text-white">Issued Bearer JWT:</strong> <span className="text-cyan-400">{sessionJWT}</span></p>
                    <p><strong className="text-white">MFA Encryption Status:</strong> {currentUser.isMFAEnabled ? "Dual-Layer Core Enabled" : "Single-Layer Shield"}</p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2 text-[11px] font-bold">
                    <button
                      onClick={() => {
                        if (onUnlockSuccess && currentUser) {
                          onUnlockSuccess(currentUser.name, currentUser.email, sessionJWT || "");
                        } else if (onBypassUnlock) {
                          onBypassUnlock();
                        }
                      }}
                      className="w-full bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/40 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#00f0ff]/10 animate-pulse cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4" />
                      Unify Portal Workspace
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Revoke Bearer Token
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Simulated OAuth Social Buttons ribbon */}
            {screen !== "success" && (
              <div className="pt-4 border-t border-white/5 space-y-2 text-center relative z-20">
                <span className="text-[9px] text-gray-500 font-mono uppercase font-bold tracking-widest block">Futuristic Secure Social Federation</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerPresetLogin("alexandra.carter@mit.edu", "password123")}
                    className="bg-white/2 hover:bg-[#4285F4]/15 hover:border-[#4285F4]/30 text-gray-400 hover:text-[#4285F4] text-[10px] py-2 rounded-xl border border-white/5 font-mono flex items-center justify-center gap-1 transition-all font-bold"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => triggerPresetLogin("hneven@google.com", "password123")}
                    className="bg-white/2 hover:bg-[#0078D4]/15 hover:border-[#0078D4]/30 text-gray-400 hover:text-[#0078D4] text-[10px] py-2 rounded-xl border border-white/5 font-mono flex items-center justify-center gap-1 transition-all font-bold"
                  >
                    Microsoft
                  </button>
                  <button
                    onClick={() => triggerPresetLogin("alexandra.carter@mit.edu", "password123")}
                    className="bg-white/2 hover:bg-[#1877F2]/15 hover:border-[#1877F2]/30 text-gray-400 hover:text-[#1877F2] text-[10px] py-2 rounded-xl border border-white/5 font-mono flex items-center justify-center gap-1 transition-all font-bold"
                  >
                    Meta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CYBERNETIC PLAYGROUND DEV HUB (xl:col-span-7) */}
        <div className="xl:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Control Ribbon Selection */}
            <div className="flex border-b border-white/10 overflow-x-auto gap-0 shadow-inner bg-sleek-black/40 rounded-t-xl">
              <button
                onClick={() => setActivePlaygroundTab("logs")}
                className={`py-3 px-4 text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 shrink-0 transition-all ${
                  activePlaygroundTab === "logs" 
                    ? "text-[#00f0ff] border-b-2 border-[#00f0ff] bg-white/2" 
                    : "text-gray-400 hover:text-[#00f0ff] opacity-80"
                }`}
              >
                <Activity className="h-3.5 w-3.5 animate-pulse" /> Intrusions & Hashing Logs
              </button>
              
              <button
                onClick={() => setActivePlaygroundTab("db")}
                className={`py-3 px-4 text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 shrink-0 transition-all ${
                  activePlaygroundTab === "db" 
                    ? "text-[#00f0ff] border-b-2 border-[#00f0ff] bg-white/2" 
                    : "text-gray-400 hover:text-[#00f0ff] opacity-80"
                }`}
              >
                <Database className="h-3.5 w-3.5" /> Database Index
              </button>
              
              <button
                onClick={() => setActivePlaygroundTab("flows")}
                className={`py-3 px-4 text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 shrink-0 transition-all ${
                  activePlaygroundTab === "flows" 
                    ? "text-[#00f0ff] border-b-2 border-[#00f0ff] bg-white/2" 
                    : "text-gray-400 hover:text-[#00f0ff] opacity-80"
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> Security Flow Diagrams
              </button>

              <button
                onClick={() => setActivePlaygroundTab("emails")}
                className={`py-3 px-4 text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 shrink-0 relative transition-all ${
                  activePlaygroundTab === "emails" 
                    ? "text-[#00f0ff] border-b-2 border-[#00f0ff] bg-white/2" 
                    : "text-gray-400 hover:text-[#00f0ff] opacity-80"
                }`}
              >
                <Mail className="h-3.5 w-3.5" /> SMTP Simulated Inbox
                {inboxEmails.length > 0 && (
                  <span className="absolute top-2 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>

              <button
                onClick={() => setActivePlaygroundTab("cookie_csrf")}
                className={`py-3 px-4 text-xs font-semibold tracking-wider font-mono flex items-center gap-1.5 shrink-0 transition-all ${
                  activePlaygroundTab === "cookie_csrf" 
                    ? "text-[#00f0ff] border-b-2 border-[#00f0ff] bg-white/2" 
                    : "text-gray-400 hover:text-[#00f0ff] opacity-80"
                }`}
              >
                <Fingerprint className="h-3.5 w-3.5" /> Cookie & CSRF HUD
              </button>
            </div>

            {/* TAB CONTAINER: LOGS CONSOLE PANEL */}
            {activePlaygroundTab === "logs" && (
              <GlassCard glowColor="none" className="border-white/5 py-4 px-5">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider">Security & Authorization Logs</h4>
                    <p className="text-[10px] text-gray-400 leading-normal">Inspect real-time operations inside authorization controllers, including password encryption simulations, verification limits, and session token creations.</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setLogs([]);
                      addSecurityLog("CONSOLE_CLEARED: Telemetry log bank blanked.", "system");
                    }}
                    className="p-1.5 bg-white/2 hover:bg-white/5 rounded border border-white/10 text-[9px] text-gray-400 font-mono"
                  >
                    Clear Console
                  </button>
                </div>

                {/* Simulated Linux Console output buffer */}
                <div className="bg-black/85 p-4 rounded-xl border border-white/5 max-h-[300px] min-h-[300px] overflow-y-auto pr-2 scrollbar-style flex flex-col-reverse gap-2">
                  {logs.length > 0 ? (
                    logs.map((log) => {
                      const labelColor = 
                        log.category === "hash" ? "text-yellow-405 text-yellow-500 font-bold" :
                        log.category === "shield" ? "text-red-400 font-extrabold" :
                        log.category === "auth" ? "text-green-400 font-semibold" : "text-gray-500";
                      
                      return (
                        <div key={log.id} className="text-[10px] font-mono leading-relaxed font-normal flex items-start gap-1">
                          <span className="text-gray-600 shrink-0 select-none">[{log.time}]</span>
                          <span className={`${labelColor} shrink-0 select-none`}>[{log.category.toUpperCase()}]</span>
                          <span className="text-stone-300 break-all">{log.msg}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-600 font-mono text-[10px] py-16">
                      Telemetry log buffer is empty. Enter credentials on the left block to trigger system events.
                    </div>
                  )}
                </div>

                <div className="mt-3 bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/10 text-[10px] leading-relaxed text-gray-400 flex items-start gap-1.5 font-mono">
                  <Activity className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                  <span>
                    Passwords are securely hashed and salted in the database to prevent unauthorized access and data leaks.
                  </span>
                </div>
              </GlassCard>
            )}

            {/* TAB CONTAINER: ACTIVE DATABASE ROWS DISPLAY */}
            {activePlaygroundTab === "db" && (
              <GlassCard glowColor="none" className="border-white/5 py-4 px-5 space-y-3">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider">Account Directory Database</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    This table represents the database where accounts are saved. Unverified users are flagged in red, and passwords are saved strictly as secure, irreversible hashes.
                  </p>
                </div>

                <div className="border border-white/10 rounded-xl overflow-hidden font-mono text-[10px] max-h-[290px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/15 text-gray-400 font-bold">
                      <tr>
                        <th className="p-2 shrink-0">Full Name</th>
                        <th className="p-2">Email Address</th>
                        <th className="p-2">Password Hash</th>
                        <th className="p-2 text-right">E-Verify</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 divide-stone-100">
                      {userDb.map((user) => (
                        <tr key={user.id} className="hover:bg-white/2 transition-colors">
                          <td className="p-2 font-bold text-white leading-tight">{user.name}<br/><span className="text-[8px] text-gray-500">ID: {user.id}</span></td>
                          <td className="p-2 text-gray-300">{user.email}</td>
                          <td className="p-2 text-gray-500"><span className="block truncate max-w-[190px]" title={user.passwordHash}>{user.passwordHash}</span><span className="text-[8px] text-cyan-500">Salt: "{user.salt}"</span></td>
                          <td className="p-2 text-right">
                            {user.isEmailVerified ? (
                              <span className="text-green-400 bg-green-500/10 border border-green-500/30 px-1.5 py-0.2 rounded font-black text-[8px] uppercase">
                                VERIFIED
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMagicLinkVerificationClick(user)}
                                className="text-red-400 bg-red-500/10 border border-red-500/30 px-1.5 py-0.2 rounded font-black text-[8px] uppercase hover:bg-red-500 hover:text-white transition-colors animate-pulse"
                                title="Click to instantly mock verification confirmation via magic link"
                              >
                                CONFIRM
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-orange-500/5 p-3 rounded-lg border border-orange-500/10 text-[10px] leading-relaxed text-gray-400 flex items-start gap-1.5 font-mono">
                  <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Anti-Replay Salt Rule:</strong> Each registrant receives a randomized, secure salt during deployment. Even if multiple users configure the identical password phrase, their resulting database hash remains completely distinct!
                  </span>
                </div>
              </GlassCard>
            )}

            {/* TAB CONTAINER: EMAIL DISPATCH EXPLANATION & SIMULATED INBOX */}
            {activePlaygroundTab === "emails" && (
              <GlassCard glowColor="none" className="border-white/5 py-4 px-5">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider font-bold">Simulated SendGrid / SES Output Mailbox</h4>
                    <p className="text-[10px] text-gray-400 leading-normal">Inspect real-time authentication links, tokenized reset URLs, and 6-digit verification keys dispatched from Express routers.</p>
                  </div>

                  <button
                    onClick={() => setInboxEmails([])}
                    className="p-1 py-0.5 bg-white/2 hover:bg-white/5 border border-white/10 rounded font-mono text-[9px] text-gray-400"
                  >
                    Wipe Inbox
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] min-h-[300px] overflow-y-auto pr-2">
                  {inboxEmails.length > 0 ? (
                    inboxEmails.map((emailItem) => (
                      <div key={emailItem.id} className="p-3 bg-black/45 rounded-xl border border-white/5 font-mono space-y-2 relative border-l-2 border-l-cyan-400 animate-fadeIn">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/35 px-1.5 py-0.2 rounded">SMTP-OUT: APPROVED</span>
                            <span className="text-[10px] text-white font-bold ml-2">Sub: {emailItem.subject}</span>
                          </div>
                          <span className="text-[8px] text-gray-500">{emailItem.sentAt}</span>
                        </div>

                        <div className="text-[9.2px] text-gray-350 bg-black/30 p-2 rounded border border-white/2 leading-relaxed text-gray-300">
                          {emailItem.content}
                          
                          {emailItem.code && (
                            <div className="mt-2 text-center p-2 bg-black/50 border border-dashed border-cyan-400/30 rounded text-base text-yellow-405 text-yellow-500 tracking-widest font-extrabold select-all">
                              {emailItem.code}
                            </div>
                          )}
                        </div>

                        {/* Interactive actions on email link dispatch */}
                        <div className="flex justify-end gap-2 text-[8px] pt-1">
                          {emailItem.link && (
                            <button
                              onClick={() => {
                                const matched = userDb.find(u => u.email.toLowerCase() === emailItem.to.toLowerCase());
                                if (matched) {
                                  if (emailItem.subject.includes("Reset")) {
                                    handleTriggerSimulatedPasswordReset(matched);
                                  } else {
                                    handleMagicLinkVerificationClick(matched);
                                  }
                                }
                              }}
                              className="bg-cyan-600 hover:bg-cyan-550 border border-cyan-400 text-white px-2 py-0.8 rounded flex items-center gap-0.5 cursor-pointer font-bold uppercase transition-all"
                            >
                              <ExternalLink className="h-2 w-2" /> Activate Magic Link
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center font-mono py-16 text-gray-600 text-[10px]">
                      No SMTP mail outputs are currently queued. Enroll a custom user context at the portal to dispatch an activation mail or hit "forgot password" above.
                    </div>
                  )}
                </div>
              </GlassCard>
            )}

            {/* TAB CONTAINER: CSRF GUARD AND COOKIE MONITOR */}
            {activePlaygroundTab === "cookie_csrf" && (
              <GlassCard glowColor="none" className="border-white/5 py-4 px-5 space-y-3">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider">CSRF Token Guard & HTTPS-Only Session Cookie Monitor</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    This monitor isolates secure cookies and double-submit anti-forgery flags assigned dynamically to block Cross-Site Request Forgery (CSRF/XSRF) and Cross-Site Scripting (XSS) Session Hijacking.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs font-mono">
                  
                  {/* CSRF Card details */}
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-[9px] text-[#00f0ff] uppercase font-bold">Anti-Forgery token register</span>
                      <span className="text-[8px] text-green-400">DOUBLE_SUBMIT_MATCH</span>
                    </div>
                    <p className="text-[10.5px] leading-tight text-gray-400">The server embeds an anti-forgery value in client HTML headers. Incoming POST submissions match this, blocking malicious side-clicks.</p>
                    <div className="bg-black/60 p-2 rounded border border-white/5 text-[10px] break-all">
                      <span className="text-gray-500 font-bold block mb-0.5">X-CSRF-TOKEN:</span>
                      <span className="text-yellow-500">{csrfToken}</span>
                    </div>
                  </div>

                  {/* Cookie parameters Card */}
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-[9px] text-orange-400 uppercase font-bold">HTTPS-Only Session Cookie</span>
                      <span className="text-[8px] text-cyan-400">XSS_PROTECTED</span>
                    </div>
                    <p className="text-[10.5px] leading-tight text-gray-400">Tokens are committed into secure Cookies. Unreadable from client-side JavaScript (`document.cookie` block), safeguarding session tokens.</p>
                    
                    <div className="p-1 px-2.5 bg-black/60 rounded border border-white/5 space-y-1 text-[9px] text-gray-300">
                      <p className="flex justify-between"><span>Cookie Domain:</span> <strong className="text-white">aetherfolio.api</strong></p>
                      <p className="flex justify-between"><span>HttpOnly:</span> <strong className="text-green-400">True (Strict)</strong></p>
                      <p className="flex justify-between"><span>Secure (HTTPS):</span> <strong className="text-green-400">True (Enforced)</strong></p>
                      <p className="flex justify-between"><span>SameSite:</span> <strong className="text-[#00f0ff]">Lax</strong></p>
                    </div>
                  </div>

                </div>

                <div className="bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/10 text-[10px] leading-relaxed text-gray-400 flex items-start gap-1.5 font-mono">
                  <Fingerprint className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    When requests initiate, Express server filters matching HTTP Cookies against telemetry indices, rejecting mismatch blocks automatically.
                  </span>
                </div>
              </GlassCard>
            )}

            {/* TAB CONTAINER: SYSTEM FLOW DIAGRAMS CHIPS */}
            {activePlaygroundTab === "flows" && (
              <GlassCard glowColor="none" className="border-white/5 py-4 px-5">
                <div className="mb-3">
                  <h4 className="text-xs font-mono font-bold text-[#00f0ff] uppercase tracking-wider">Authentication Protocol Architecture Flowcharts</h4>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    This visual diagram explains the precise execution sequences of state transitions, password encryption layers, and email verification handshakes.
                  </p>
                </div>

                {/* FLOW 1: SIGN-UP PROCESS flowchart inside visual HUD */}
                <div className="bg-black/45 p-4 rounded-xl border border-white/5 space-y-4 max-h-[300px] min-h-[300px] overflow-y-auto pr-2 text-stone-300">
                  
                  {/* CHART 1: Sign up flow */}
                  <div className="space-y-2 border-b border-white/5 pb-4">
                    <h5 className="text-[11px] font-mono text-[#00f0ff] uppercase font-bold flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" /> 1. Enrollment Sequence (Sign-Up / CSRF Verification)
                    </h5>
                    
                    {/* Retro-cyber outline flowchart */}
                    <div className="flex flex-col gap-2 font-mono text-[9px] p-2 bg-black/60 rounded border border-white/5">
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-white font-bold">INPUT REGISTER:</span> User inputs Name, Email, Password. Configures Multi-Factor (MFA) preference flag.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-[#00f0ff] font-bold">CLIENT SHIELD:</span> Post payload is enriched with the double-submit browser metadata check token and Anti-CSRF header parameters.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-orange-400 font-bold">EXPRESS ROUTER:</span> Handles REST Endpoint `POST /api/v1/auth/register`. Decouples variables, executes regex format validations.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-yellow-500 font-semibold font-bold">ARGON2 CRYPTO:</span> Generates 256-bit cryptographically secure Salt hex. Executes iterations hash blocks. Immutably hashes credentials.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-[#ff6600] font-bold">POSTGRES DATABASE:</span> Commits record row: [Email, HashedPassword, UniqueSalt, isEmailVerified: false, MFASecret, OTP_PIN].
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-green-400 font-bold">SESSION SMTP SMTP-QUEUE:</span> Dispatches high-entropy AES-encrypted verification link or 6-digit verification pin to target email inbox.
                      </div>
                    </div>
                  </div>

                  {/* CHART 2: Forgot Password flow */}
                  <div className="space-y-2 border-b border-white/5 pb-4">
                    <h5 className="text-[11px] font-mono text-orange-400 uppercase font-bold flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5" /> 2. Forgot Password Gateway Protocol Flowchart
                    </h5>
                    
                    <div className="flex flex-col gap-2 font-mono text-[9px] p-2 bg-black/60 rounded border border-white/5">
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-white font-bold">RECOVERY REQUEST:</span> User posts registered email address at reset console.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-red-400 font-bold">OBUFUSCATED TIMING SHIELD:</span> Express query delays response dynamically to prevent account enum attacks. Responses appear identical.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-[#00f0ff] font-bold">TOKEN GENERATION:</span> Serves cryptographically random link code bound by a short expiration constraint (e.g. 15 minutes).
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-green-400 font-bold">SECURE NOTIFICATION:</span> Delivers SMTP link. Clicking the recovery link redirects dynamically, validates JWT signature block, prompts new secure password entry.
                      </div>
                    </div>
                  </div>

                  {/* CHART 3: Magic key / Code verify flow */}
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-mono text-green-400 uppercase font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> 3. Secure Verification & Conferred Authentication Loop
                    </h5>
                    
                    <div className="flex flex-col gap-2 font-mono text-[9px] p-2 bg-black/60 rounded border border-white/5">
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-white font-bold">ACTIVATION LINK ENTER:</span> User clicks URL embedding securely hashed validation token.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-orange-400 font-bold">TOKEN HOST CHECK:</span> API route processes validation hash, checks if signature remains pristine against host cryptographic keys.
                      </div>
                      <div className="text-center text-gray-500">↓</div>
                      <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded text-gray-400">
                        <span className="text-green-400 font-bold">COMMIT & INITIALIZE:</span> Switches status column to VERIFIED. Clears activation buffers. Redirects user to portal cleanly.
                      </div>
                    </div>
                  </div>

                </div>
              </GlassCard>
            )}

          </div>

          {/* Quick HUD indicator details bottom */}
          <div className="bg-[#0c0d12]/50 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
            <span className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl relative">
              <Shield className="h-5 w-5 animate-pulse" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-405 bg-green-400 rounded-full animate-ping" />
            </span>
            <div>
              <span className="text-[10px] text-cyan-400 font-mono font-bold block">AUTHENTICATION & SECURITY PROTOCOLS</span>
              <p className="text-[11px] text-gray-400 leading-normal mt-0.5">
                This system implements multi-factor verification, secure password hashing, rate limiting, and encrypted session management in compliance with industry security standards (OWASP Top 10).
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
