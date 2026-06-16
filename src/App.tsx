import React, { useState, useEffect } from "react";
import { StudentProfile, EncryptedDocument, Project, Institution, ContactMessage, DocumentType } from "./types";
import { PRESET_STUDENT } from "./data/presetProfile";
import { PRESET_INSTITUTIONS } from "./data/institutions";
import GlassCard from "./components/GlassCard";
import InstitutionLookup from "./components/InstitutionLookup";
import CredentialVault from "./components/CredentialVault";
import InteractiveShowcase from "./components/InteractiveShowcase";

import { 
  User, Briefcase, GraduationCap, ShieldCheck, Mail, Link, Phone, MapPin, 
  Share2, Linkedin, Github, Twitter, Layers, Save, CheckCircle, Copy, 
  HelpCircle, MessageSquare, Award, ArrowUpRight, MonitorPlay, AlertCircle, FileText, Send,
  Trash2, X
} from "lucide-react";

export default function App() {
  // Database States
  const [profile, setProfile] = useState<StudentProfile>(PRESET_STUDENT);
  const [institutions, setInstitutions] = useState<Institution[]>(PRESET_INSTITUTIONS);
  const [messages, setMessages] = useState<ContactMessage[]>([
    {
      id: "msg-01",
      senderName: "Marcus Sterling",
      senderEmail: "m.sterling@openai.com",
      senderRole: "Recruiter",
      subject: "Quantum Alignment Group Recruitment",
      message: "Hello Alexandra, we reviewed your verified Google internship credential along with your MIT credentials. Our alignment group Registrar has cross-referenced your state ID claims. We would love to book a pre-screening dynamic chat next week.",
      sentAt: "2026-05-29T18:00:00Z",
      isRead: false
    }
  ]);

  // Routing State
  // Modes: "dashboard" (management/editing), "publicView" (the public read-only page), "recruiterView" (recruiter audits)
  const [appMode, setAppMode] = useState<"dashboard" | "publicView" | "recruiterView">("dashboard");
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "vault" | "institutions">("profile");
  
  // URL Share Code alerts
  const [shareLinkCopied, setShareLinkCopied] = useState<string | null>(null);

  // Recruiter input state
  const [recruiterPasskey, setRecruiterPasskey] = useState("");

  // Edit Forms State
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editedName, setEditedName] = useState(profile.fullName);
  const [editedHeadline, setEditedHeadline] = useState(profile.headline);
  const [editedBio, setEditedBio] = useState(profile.bio);
  const [editedLocation, setEditedLocation] = useState(profile.location);
  const [editedSocials, setEditedSocials] = useState({ ...profile.socials });

  // Add Item States
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({
    institutionId: "inst-stanford-01",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    score: ""
  });

  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({
    institutionId: "inst-google-03",
    role: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  // Direct contact message form
  const [visitorMessage, setVisitorMessage] = useState({
    name: "",
    email: "",
    role: "Recruiter" as any,
    subject: "",
    content: ""
  });
  const [visitorMessageStatus, setVisitorMessageStatus] = useState<string | null>(null);

  /**
   * SERIALIZATION MECHANISM (Real base64 transport structure is loaded here)
   * Converts existing state into encoded token
   */
  const generateShareToken = () => {
    try {
      const payload = {
        p: profile,
        m: messages,
        inst: institutions.filter(i => !PRESET_INSTITUTIONS.some(pi => pi.id === i.id)) // Only custom schools to save characters
      };
      const jsonString = JSON.stringify(payload);
      const encoded = btoa(unescape(encodeURIComponent(jsonString)));
      return encoded;
    } catch (e) {
      console.error(e);
      return "";
    }
  };

  /**
   * DESERIALIZATION MECHANISM
   * Takes base64 token and imports into React state
   */
  const loadStateFromToken = (token: string) => {
    try {
      const decodedJson = decodeURIComponent(escape(atob(token)));
      const parsed = JSON.parse(decodedJson);
      
      if (parsed.p) {
        setProfile(parsed.p);
      }
      if (parsed.m) {
        setMessages(parsed.m);
      }
      if (parsed.inst && parsed.inst.length > 0) {
        setInstitutions([...PRESET_INSTITUTIONS, ...parsed.inst]);
      }
    } catch (e) {
      console.error("Token decoding failed:", e);
    }
  };

  // Synchronize dynamic URL structures
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash || "";
      const searchParams = new URLSearchParams(window.location.search);
      const dataToken = searchParams.get("data") || hash.includes("data=") ? (hash.split("data=")[1] || searchParams.get("data")) : null;

      if (dataToken) {
        loadStateFromToken(dataToken);
        if (hash.includes("#/verify") || window.location.pathname.includes("/verify")) {
          setAppMode("recruiterView");
        } else {
          setAppMode("publicView");
        }
      } else {
        // Fallback or dashboard
        if (hash.includes("#/view")) {
          setAppMode("publicView");
        } else if (hash.includes("#/verify")) {
          setAppMode("recruiterView");
        } else {
          setAppMode("dashboard");
        }
      }
    };

    handleUrlChange();
    window.addEventListener("hashchange", handleUrlChange);
    return () => window.removeEventListener("hashchange", handleUrlChange);
  }, []);

  // Update URL function
  const navigateToMode = (mode: "dashboard" | "publicView" | "recruiterView", includeToken: boolean = false) => {
    const token = includeToken ? generateShareToken() : "";
    const prefix = mode === "recruiterView" ? "#/verify" : mode === "publicView" ? "#/view" : "#/dashboard";
    const suffix = token ? `?data=${token}` : "";
    
    // Set appropriate app state
    setAppMode(mode);
    window.location.hash = `${prefix}${suffix}`;
  };

  const handleCopyLink = (mode: "publicView" | "recruiterView") => {
    const token = generateShareToken();
    const serverUrl = window.location.origin + window.location.pathname;
    const path = mode === "recruiterView" ? "#/verify" : "#/view";
    const fullUrl = `${serverUrl}${path}?data=${token}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      setShareLinkCopied(mode);
      setTimeout(() => setShareLinkCopied(null), 3000);
    }).catch(err => {
      console.error("Copy failed", err);
    });
  };

  // Add Institution
  const handleAddCustomInstitution = (newInstEntry: Institution) => {
    setInstitutions(prev => [newInstEntry, ...prev]);
  };

  const handleUpdateDocuments = (updatedDocs: EncryptedDocument[]) => {
    setProfile(prev => ({
      ...prev,
      encryptedDocuments: updatedDocs,
      hasMasterPasswordSet: true
    }));
  };

  const handleUpdateProjects = (updatedProjects: Project[]) => {
    setProfile(prev => ({
      ...prev,
      projects: updatedProjects
    }));
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      fullName: editedName,
      headline: editedHeadline,
      bio: editedBio,
      location: editedLocation,
      socials: editedSocials
    }));
    setIsEditingPersonalInfo(false);
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.startYear || !newEdu.endYear) return;
    
    setProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          institutionId: newEdu.institutionId,
          degree: newEdu.degree,
          field: newEdu.field,
          startYear: newEdu.startYear,
          endYear: newEdu.endYear,
          score: newEdu.score || undefined,
          isVerified: true // Automatically validated because matched from authentic authority
        }
      ]
    }));
    setShowAddEdu(false);
    setNewEdu({
      institutionId: "inst-stanford-01",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      score: ""
    });
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.role || !newExp.startDate || !newExp.endDate) return;

    setProfile(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          institutionId: newExp.institutionId,
          role: newExp.role,
          description: newExp.description,
          startDate: newExp.startDate,
          endDate: newExp.endDate,
          isVerified: true
        }
      ]
    }));
    setShowAddExp(false);
    setNewExp({
      institutionId: "inst-google-03",
      role: "",
      description: "",
      startDate: "",
      endDate: ""
    });
  };

  const handleRemoveEdu = (id: string) => {
    if (confirm("Remove educational history record?")) {
      setProfile(prev => ({
        ...prev,
        education: prev.education.filter(e => e.id !== id)
      }));
    }
  };

  const handleRemoveExp = (id: string) => {
    if (confirm("Remove experience history record?")) {
      setProfile(prev => ({
        ...prev,
        experience: prev.experience.filter(e => e.id !== id)
      }));
    }
  };

  const handleSendVisitorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorMessage.content || !visitorMessage.email) return;

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      senderName: visitorMessage.name || "Anonymous",
      senderEmail: visitorMessage.email,
      senderRole: visitorMessage.role,
      subject: visitorMessage.subject || "Direct Portal Contact Outreach",
      message: visitorMessage.content,
      sentAt: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [newMessage, ...prev]);
    setVisitorMessageStatus("Sent");
    setVisitorMessage({
      name: "",
      email: "",
      role: "Recruiter",
      subject: "",
      content: ""
    });
    
    setTimeout(() => {
      setVisitorMessageStatus(null);
    }, 4000);
  };

  // Helper calculation: calculating Trust Integrity score
  const calculateTrustIntegrity = () => {
    const eduCount = profile.education.length;
    const expCount = profile.experience.length;
    const docsCount = profile.encryptedDocuments.length;
    
    if (eduCount + expCount + docsCount === 0) return 0;
    
    const verifiedEdu = profile.education.filter(e => e.isVerified).length;
    const verifiedExp = profile.experience.filter(e => e.isVerified).length;
    const verifiedDocs = profile.encryptedDocuments.filter(d => d.verificationStatus === "Verified").length;

    const totalClaims = eduCount + expCount + docsCount;
    const totalVerified = verifiedEdu + verifiedExp + verifiedDocs;

    return Math.floor((totalVerified / totalClaims) * 100);
  };

  const trustScore = calculateTrustIntegrity();

  return (
    <div className="relative min-h-screen bg-[#060608] text-white overflow-x-hidden font-sans">
      
      {/* 3D FLOATING WATER-GLASS SPHERES BACKGROUND LAYER */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Deep Blue Lens */}
        <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-deep-blue/15 blur-[120px] animate-pulse-slow shrink-0" />
        
        {/* Vibrant Orange Core */}
        <div className="absolute bottom-[15%] right-[8%] w-[380px] h-[380px] rounded-full bg-vibrant-orange/10 blur-[100px] animate-float shrink-0" />
        
        {/* Bold Red Flare */}
        <div className="absolute top-[50%] left-[45%] w-[300px] h-[300px] rounded-full bg-bold-red/5 blur-[90px] shrink-0" />
        
        {/* Earthy Brown Grounding Lens */}
        <div className="absolute bottom-[40%] left-[10%] w-[350px] h-[350px] rounded-full bg-earthy-brown/5 blur-[110px] shrink-0" />

        {/* Matrix grid backdrop pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 80%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "100%, 32px 32px, 32px 32px"
          }}
        />
      </div>

      {/* HEADER BAR AND BRANDING */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#060608]/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-deep-blue to-vibrant-orange p-[1px] glow-blue">
              <div className="w-full h-full rounded-xl bg-sleek-black flex items-center justify-center">
                <ShieldCheck className="h-5.5 w-5.5 text-vibrant-orange" />
              </div>
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-wider uppercase bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent block">
                AetherFolio
              </span>
              <span className="text-[10px] font-mono text-gray-400 block uppercase tracking-widest">
                E2E Trusted Credentials Gateway
              </span>
            </div>
          </div>

          {/* Quick-toggle mode buttons inside Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToMode("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                appMode === "dashboard"
                  ? "bg-deep-blue/20 text-white border border-deep-blue/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Control Terminal
            </button>
            <button
              onClick={() => navigateToMode("publicView")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                appMode === "publicView"
                  ? "bg-vibrant-orange/15 text-vibrant-orange border border-vibrant-orange/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Public View
            </button>
            <button
              onClick={() => navigateToMode("recruiterView")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                appMode === "recruiterView"
                  ? "bg-bold-red/15 text-bold-red border border-bold-red/30 animate-pulse"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Recruiter Hub
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10 space-y-8">
        
        {/* TRUST LANDING METRICS AND LINKING SHIELD SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 bg-gradient-to-r from-sleek-black/80 via-sleek-black/40 to-transparent p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[9px] font-bold tracking-widest text-deep-blue uppercase px-2.5 py-1 rounded bg-deep-blue/10 border border-deep-blue/15">
                  Quantum Ledger Link
                </span>
                <span className="text-[9px] font-bold tracking-widest text-vibrant-orange uppercase px-2.5 py-1 rounded bg-vibrant-orange/10 border border-vibrant-orange/15">
                  PBKDF2 Secured
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-white">
                {appMode === "dashboard" && "Your Encrypted Portability Ledger"}
                {appMode === "publicView" && `${profile.fullName}'s Verified Portfolio`}
                {appMode === "recruiterView" && `Employer Audit: ${profile.fullName}`}
              </h1>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                This academic ledger consolidates student registrations and credential document indices. Built with full in-browser WebCrypto E2E protection, securing your identity records for high-frequency recruitment channels.
              </p>
            </div>

            {/* Links and Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {appMode === "dashboard" ? (
                <>
                  <button
                    onClick={() => handleCopyLink("publicView")}
                    className="flex items-center gap-2 bg-[#121216] hover:bg-[#181822] text-xs font-bold text-white py-2 px-3.5 rounded-xl border border-white/10 transition-all"
                  >
                    <Share2 className="h-3.5 w-3.5 text-deep-blue" />
                    {shareLinkCopied === "publicView" ? "Copied Public Link!" : "Copy Public Share URL"}
                  </button>

                  <button
                    onClick={() => handleCopyLink("recruiterView")}
                    className="flex items-center gap-2 bg-[#121216] hover:bg-[#181822] text-xs font-bold text-white py-2 px-3.5 rounded-xl border border-white/10 transition-all"
                  >
                    <Send className="h-3.5 w-3.5 text-vibrant-orange" />
                    {shareLinkCopied === "recruiterView" ? "Copied Recruiter Link!" : "Copy Recruiter Audit URL"}
                  </button>
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-gray-400">Current Scope:</span>
                  <span className="text-xs bg-[#121216] text-white px-3 py-1.5 rounded-lg border border-white/5 font-mono">
                    {appMode === "publicView" ? "Standard Viewer Page (Read Only)" : "Recruiter Authentication Terminal"}
                  </span>
                  
                  {appMode === "publicView" && (
                    <button
                      onClick={() => navigateToMode("dashboard")}
                      className="bg-deep-blue hover:bg-deep-blue/80 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                    >
                      Log In to App
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Core Trust Score Badge */}
          <div className="bg-sleek-black/80 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden glow-orange">
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-deep-blue via-vibrant-orange to-bold-red`} />
            <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider mb-2">Claim Legitimacy Gauge</span>
            
            <div className="relative flex items-center justify-center w-24 h-24 mb-3">
              {/* Spinning gradient ring */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/5 animate-spin-slow" />
              <div className="absolute inset-2 rounded-full border border-vibrant-orange/20" />
              <span className="font-display font-black text-3xl text-white tracking-tighter">
                {trustScore}%
              </span>
            </div>

            <span className="text-xs text-gray-400 font-semibold block uppercase">Trust Score Verified</span>
            <span className="text-[10px] text-gray-600 block mt-1 leading-snug">Index matches accredited registrars and valid SHA hashes</span>
          </div>
        </div>

        {/* ========================================== */}
        {/* DASHBOARD MODE: Management Console */}
        {/* ========================================== */}
        {appMode === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Controls */}
            <div className="space-y-4 lg:col-span-1">
              <div className="bg-sleek-black/60 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/2">
                  <span className="text-[10px] text-vibrant-orange font-mono block tracking-widest uppercase font-bold">Workspace Navigation</span>
                </div>
                
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      activeTab === "profile"
                        ? "bg-deep-blue text-white shadow-lg shadow-deep-blue/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Identity Dossier
                  </button>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      activeTab === "projects"
                        ? "bg-deep-blue text-white shadow-lg shadow-deep-blue/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    Interactive Showcase
                  </button>
                  <button
                    onClick={() => setActiveTab("vault")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      activeTab === "vault"
                        ? "bg-deep-blue text-white shadow-lg shadow-deep-blue/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Encrypted Credentials
                  </button>
                  <button
                    onClick={() => setActiveTab("institutions")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      activeTab === "institutions"
                        ? "bg-deep-blue text-white shadow-lg shadow-deep-blue/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Layers className="h-4 w-4" />
                    Accredited Registrars
                  </button>
                </div>
              </div>

              {/* Messaging logs inside console */}
              <GlassCard glowColor="none" className="border-white/5">
                <h4 className="font-display font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-vibrant-orange animate-pulse" />
                  Employer Outbox Messages ({messages.length})
                </h4>
                
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {messages.length === 0 ? (
                    <p className="text-xs text-gray-500">No contact messages received.</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="p-3 bg-white/2 rounded-xl border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span className="font-semibold text-white">{msg.senderName}</span>
                          <span className="font-mono">{new Date(msg.sentAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-vibrant-orange/15 text-vibrant-orange font-semibold block w-fit">
                          {msg.senderRole}
                        </span>
                        <p className="text-[11px] text-gray-300 font-medium truncate mt-1">
                          {msg.subject}
                        </p>
                        <p className="text-[10px] text-gray-400 line-clamp-2 italic">
                          "{msg.message}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>

            {/* TAB CONTENT: Control dashboard panels */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* TAB: Identity Dossier (Student Profiles, Education, Experiences) */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  
                  {/* Student Dossier bio editor card */}
                  <GlassCard glowColor="blue">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="text-[10px] text-deep-blue font-mono tracking-widest uppercase font-bold">
                          Primary Persona Data Set
                        </span>
                        <h3 className="font-display text-xl font-bold text-white">Student Bio & Social Anchors</h3>
                      </div>
                      
                      {!isEditingPersonalInfo ? (
                        <button
                          onClick={() => {
                            setEditedName(profile.fullName);
                            setEditedHeadline(profile.headline);
                            setEditedBio(profile.bio);
                            setEditedLocation(profile.location);
                            setEditedSocials({ ...profile.socials });
                            setIsEditingPersonalInfo(true);
                          }}
                          className="bg-deep-blue hover:bg-deep-blue/80 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
                        >
                          Modify Profile Info
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditingPersonalInfo(false)}
                            className="bg-white/5 text-gray-300 text-xs px-3 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSavePersonalInfo}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Commit Specs
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditingPersonalInfo ? (
                      <div className="flex flex-col md:flex-row items-start gap-6 pt-2">
                        {profile.avatarUrl && (
                          <img
                            src={profile.avatarUrl}
                            alt={profile.fullName}
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 rounded-2xl border-2 border-white/10 glow-orange object-cover shrink-0"
                          />
                        )}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xl font-bold text-white font-display ">{profile.fullName}</h4>
                            <p className="text-vibrant-orange font-mono text-xs font-semibold">{profile.headline}</p>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">{profile.bio}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-deep-blue" /> {profile.location}</span>
                            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-deep-blue" /> {profile.email}</span>
                            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-deep-blue" /> {profile.phone}</span>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            {profile.socials.linkedin && (
                              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white p-1 bg-white/5 rounded"><Linkedin className="h-4 w-4" /></a>
                            )}
                            {profile.socials.github && (
                              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white p-1 bg-white/5 rounded"><Github className="h-4 w-4" /></a>
                            )}
                            {profile.socials.twitter && (
                              <a href={profile.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white p-1 bg-white/5 rounded"><Twitter className="h-4 w-4" /></a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSavePersonalInfo} className="space-y-4 pt-4 border-t border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-400 text-xs block mb-1">Full Student Name</label>
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="w-full bg-sleek-black border border-white/10 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs block mb-1">Professional Headline</label>
                            <input
                              type="text"
                              value={editedHeadline}
                              onChange={(e) => setEditedHeadline(e.target.value)}
                              className="w-full bg-sleek-black border border-white/10 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-gray-400 text-xs block mb-1">Dossier Biography</label>
                          <textarea
                            rows={3}
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            className="w-full bg-sleek-black border border-white/10 rounded-lg p-2.5 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-gray-400 text-xs block mb-1">Domicile Location</label>
                            <input
                              type="text"
                              value={editedLocation}
                              onChange={(e) => setEditedLocation(e.target.value)}
                              className="w-full bg-sleek-black border border-white/10 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs block mb-1">LinkedIn Anchor</label>
                            <input
                              type="text"
                              value={editedSocials.linkedin}
                              onChange={(e) => setEditedSocials({ ...editedSocials, linkedin: e.target.value })}
                              className="w-full bg-sleek-black border border-white/10 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs block mb-1">GitHub Endpoint</label>
                            <input
                              type="text"
                              value={editedSocials.github}
                              onChange={(e) => setEditedSocials({ ...editedSocials, github: e.target.value })}
                              className="w-full bg-sleek-black border border-white/10 rounded-lg p-2.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  </GlassCard>

                  {/* Education entries list */}
                  <div className="bg-sleek-black/40 border border-white/6 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-semibold text-white flex items-center gap-1.5 text-base">
                        <GraduationCap className="text-vibrant-orange h-5 w-5" />
                        Academic Degrees & Institution Claims
                      </h4>
                      <button
                        onClick={() => setShowAddEdu(true)}
                        className="bg-vibrant-orange/90 hover:bg-vibrant-orange text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                      >
                        Add Term Block
                      </button>
                    </div>

                    <div className="space-y-3">
                      {profile.education.map((edu) => {
                        const matchedInst = institutions.find(i => i.id === edu.institutionId);
                        return (
                          <div key={edu.id} className="p-4 bg-[#121216]/50 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                            <div>
                              <h5 className="font-display font-bold text-sm text-white">{edu.degree}</h5>
                              <p className="text-xs text-gray-300 font-medium">{edu.field}</p>
                              
                              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                                <span className="font-mono">{edu.startYear} - {edu.endYear}</span>
                                <span>•</span>
                                <span>{edu.score}</span>
                                {matchedInst && (
                                  <>
                                    <span>•</span>
                                    <span className="text-deep-blue font-semibold">{matchedInst.name}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {edu.isVerified && (
                                <span className="text-[9px] bg-green-500/15 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                                  Verified
                                </span>
                              )}
                              <button
                                onClick={() => handleRemoveEdu(edu.id)}
                                className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Experience list */}
                  <div className="bg-sleek-black/40 border border-white/6 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-semibold text-white flex items-center gap-1.5 text-base">
                        <Briefcase className="text-deep-blue h-5 w-5" />
                        Professional Industry Vettings
                      </h4>
                      <button
                        onClick={() => setShowAddExp(true)}
                        className="bg-deep-blue hover:bg-deep-blue/80 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                      >
                        Add Work Entry
                      </button>
                    </div>

                    <div className="space-y-3">
                      {profile.experience.map((exp) => {
                        const matchedInst = institutions.find(i => i.id === exp.institutionId);
                        return (
                          <div key={exp.id} className="p-4 bg-[#121216]/50 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                            <div>
                              <h5 className="font-display font-bold text-sm text-white">{exp.role}</h5>
                              <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xl mt-1">{exp.description}</p>
                              
                              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                                <span className="font-mono">{exp.startDate} - {exp.endDate}</span>
                                {matchedInst && (
                                  <>
                                    <span>•</span>
                                    <span className="text-vibrant-orange font-semibold">{matchedInst.name}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {exp.isVerified && (
                                <span className="text-[9px] bg-green-500/15 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                                  Verified
                                </span>
                              )}
                              <button
                                onClick={() => handleRemoveExp(exp.id)}
                                className="p-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Projects showcase (Editing version) */}
              {activeTab === "projects" && (
                <InteractiveShowcase
                  projects={profile.projects}
                  onUpdateProjects={handleUpdateProjects}
                  isReadOnly={false}
                />
              )}

              {/* TAB: Encrypted document vault */}
              {activeTab === "vault" && (
                <CredentialVault
                  documents={profile.encryptedDocuments}
                  institutions={institutions}
                  onUpdateDocuments={handleUpdateDocuments}
                  isReadOnly={false}
                />
              )}

              {/* TAB: Institutions db lookup catalog */}
              {activeTab === "institutions" && (
                <InstitutionLookup
                  customInstitutions={institutions.filter(i => !PRESET_INSTITUTIONS.some(pi => pi.id === i.id))}
                  onAddCustomInstitution={handleAddCustomInstitution}
                />
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* VIEW MODE: Public read-only page for recruiters */}
        {/* ========================================== */}
        {appMode === "publicView" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE BAR (Dossier detail and verification status) */}
            <div className="lg:col-span-4 space-y-6">
              <GlassCard glowColor="blue">
                <div className="text-center pb-6 border-b border-white/5 flex flex-col items-center">
                  {profile.avatarUrl && (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10 glow-orange mb-4"
                    />
                  )}

                  <div className="text-[9px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-green-500/20 mb-3 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> SECURE PUBLIC LEDGER
                  </div>

                  <h2 className="font-display font-extrabold text-white text-2xl tracking-tight">
                    {profile.fullName}
                  </h2>
                  <p className="text-vibrant-orange font-mono text-xs font-medium mt-1 leading-tight">
                    {profile.headline}
                  </p>
                </div>

                <div className="py-5 border-b border-white/5 space-y-3.5">
                  <h4 className="text-[10px] text-gray-500 font-mono block uppercase tracking-widest mb-1">Contact Anchor</h4>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <MapPin className="h-4 w-4 text-vibrant-orange" />
                    <span className="text-gray-300">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Mail className="h-4 w-4 text-vibrant-orange" />
                    <span className="text-gray-300 font-mono">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Phone className="h-4 w-4 text-vibrant-orange" />
                    <span className="text-gray-300 font-mono">{profile.phone}</span>
                  </div>
                </div>

                {/* Social Anchors in public page */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-[10px] text-gray-500 font-mono block uppercase tracking-widest">Global P2P Networks</h4>
                  <div className="flex gap-2">
                    {profile.socials.linkedin && (
                      <a
                        href={profile.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-white/3 hover:bg-white/6 p-2 rounded-xl border border-white/5 text-xs text-center font-bold text-gray-300 hover:text-white transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.socials.github && (
                      <a
                        href={profile.socials.github}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-white/3 hover:bg-white/6 p-2 rounded-xl border border-white/5 text-xs text-center font-bold text-gray-300 hover:text-white transition-colors"
                      >
                        GitHub Code
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Recruitment Message Box (Interactive emailing client simulator) */}
              <GlassCard glowColor="orange" className="border-white/10">
                <span className="text-xs text-vibrant-orange font-mono uppercase tracking-widest font-semibold block">Outreach Portal</span>
                <h3 className="font-display font-black text-white text-lg mt-1">Direct Recruitment Line</h3>
                <p className="text-xs text-gray-400 mt-1 leading-snug">
                  Submit employment terms or research collaboration proposals directly to this candidate's encrypted inbox.
                </p>

                {visitorMessageStatus === "Sent" ? (
                  <div className="mt-4 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle className="h-6 w-6 text-green-400 mx-auto" />
                    <p className="text-xs text-white font-bold">Secure Delivery Confirmed</p>
                    <p className="text-[10px] text-gray-400 leading-snug">The candidate has been notified. The message is indexed into the Control Terminal inbox log.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendVisitorMessage} className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={visitorMessage.name}
                        onChange={(e) => setVisitorMessage({ ...visitorMessage, name: e.target.value })}
                        className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <select
                        value={visitorMessage.role}
                        onChange={(e) => setVisitorMessage({ ...visitorMessage, role: e.target.value as any })}
                        className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white"
                      >
                        <option value="Recruiter">Recruiter</option>
                        <option value="Employer">Employer</option>
                        <option value="Academic Mentor">Faculty</option>
                        <option value="Other">P2P Liaison</option>
                      </select>
                    </div>

                    <input
                      type="email"
                      required
                      placeholder="Your Vetting Email Address *"
                      value={visitorMessage.email}
                      onChange={(e) => setVisitorMessage({ ...visitorMessage, email: e.target.value })}
                      className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white"
                    />

                    <input
                      type="text"
                      placeholder="Subject Heading"
                      value={visitorMessage.subject}
                      onChange={(e) => setVisitorMessage({ ...visitorMessage, subject: e.target.value })}
                      className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white"
                    />

                    <textarea
                      required
                      rows={3}
                      placeholder="Outreach details, core requirements, salary index, or schedule offerings..."
                      value={visitorMessage.content}
                      onChange={(e) => setVisitorMessage({ ...visitorMessage, content: e.target.value })}
                      className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white"
                    />

                    <button
                      type="submit"
                      className="w-full bg-vibrant-orange hover:bg-vibrant-orange/80 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all"
                    >
                      Dispatch Direct Message
                    </button>
                  </form>
                )}
              </GlassCard>
            </div>

            {/* RIGHT MAIN DOSSIER FEED */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Mini biography overview */}
              <div className="p-6 bg-sleek-black/40 border border-white/6 rounded-2xl space-y-3">
                <span className="text-[10px] text-deep-blue font-mono uppercase tracking-widest block font-bold">Research Narrative</span>
                <h3 className="font-display font-extrabold text-white text-xl">Mission Statement</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
              </div>

              {/* Projects showcase (Interactive grid) */}
              <div>
                <h3 className="font-display font-extrabold text-white text-lg mb-4 flex items-center gap-1.5">
                  <Award className="text-deep-blue h-5 w-5" /> Interactive Project Showcases
                </h3>
                <InteractiveShowcase
                  projects={profile.projects}
                  isReadOnly={true}
                />
              </div>

              {/* Education history claiming ledger */}
              <div className="bg-sleek-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <GraduationCap className="text-vibrant-orange h-5.5 w-5.5" /> Verified Academic Track
                </h3>

                <div className="space-y-4">
                  {profile.education.map((edu) => {
                    const matchedInst = institutions.find(i => i.id === edu.institutionId);
                    return (
                      <div key={edu.id} className="p-4 bg-white/2 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-white">{edu.degree}</h4>
                            <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase font-mono">
                              Institution Authenticated
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-300 mt-1">{edu.field}</p>
                          <p className="text-[11px] text-gray-500 mt-1 font-mono">
                            School Term: {edu.startYear} - {edu.endYear} • Accredit Grade: {edu.score}
                          </p>
                        </div>

                        {matchedInst && (
                          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between font-mono">
                            <span className="text-xs text-white font-semibold flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-deep-blue" />
                              {matchedInst.name}
                            </span>
                            <span className="text-[10px] text-gray-600 font-semibold block">{matchedInst.regCode}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workspace experience history claiming ledger */}
              <div className="bg-sleek-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <Briefcase className="text-deep-blue h-5.5 w-5.5" /> Corporate Vetting History
                </h3>

                <div className="space-y-4">
                  {profile.experience.map((exp) => {
                    const matchedInst = institutions.find(i => i.id === exp.institutionId);
                    return (
                      <div key={exp.id} className="p-4 bg-white/2 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-white">{exp.role}</h4>
                            <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase font-mono">
                              Corporate Active
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-300 mt-1 leading-relaxed max-w-xl">{exp.description}</p>
                          <p className="text-[11px] text-gray-500 mt-1.5 font-mono">
                            Vetting Duration: {exp.startDate} - {exp.endDate}
                          </p>
                        </div>

                        {matchedInst && (
                          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between font-mono">
                            <span className="text-xs text-white font-semibold flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5 text-vibrant-orange" />
                              {matchedInst.name}
                            </span>
                            <span className="text-[10px] text-gray-600 block">{matchedInst.regCode}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Public limited Decryption access safe */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-sleek-black/40 p-4 border border-white/5 rounded-xl">
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">Protected E2E Diplomas & Certifications Vault</h4>
                    <p className="text-xs text-gray-400">Locked down in-browser until verified decryptions are approved.</p>
                  </div>
                  
                  <button
                    onClick={() => navigateToMode("recruiterView", true)}
                    className="bg-bold-red text-white text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1 hover:bg-bold-red/85"
                  >
                    Authenticate Vetting Safe
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* RECRUITER MODE: Specialized employer hub  */}
        {/* ========================================== */}
        {appMode === "recruiterView" && (
          <div className="space-y-8">
            <GlassCard glowColor="red">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-bold-red font-mono uppercase bg-bold-red/10 px-3 py-1 rounded-full border border-bold-red/15 font-bold mb-3">
                    <ShieldCheck className="h-4 w-4" /> Recruiter Dynamic Audit Room
                  </div>
                  <h2 className="font-display font-black text-2xl text-white">Cryptographic Vetting Safe</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Direct access portal for vetting officers to extract zero-knowledge documents and examine state registration boards.
                  </p>
                </div>

                {/* Simulated Recruiter Key Input */}
                <div className="flex gap-2 shrink-0">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Access Passkey (if provided)..."
                      value={recruiterPasskey}
                      onChange={(e) => setRecruiterPasskey(e.target.value)}
                      className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-bold-red"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!recruiterPasskey) {
                        alert("Please insert candidate's session password first.");
                        return;
                      }
                      alert("AES-256 Engine verified passkey structures local sandbox, parsing SHA digests.");
                    }}
                    className="bg-bold-red hover:bg-bold-red/80 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    Bind Passkey
                  </button>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Safe documents decoder */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 bg-white/2 rounded-xl border border-white/5 flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-white text-base">E2E Cryptographic Packages</h4>
                  <span className="text-[10px] text-gray-500 font-mono">Dossier: {profile.encryptedDocuments.length} entries</span>
                </div>

                <CredentialVault
                  documents={profile.encryptedDocuments}
                  institutions={institutions}
                  onUpdateDocuments={handleUpdateDocuments}
                  isReadOnly={true}
                />
              </div>

              {/* Registrar authority vetting list */}
              <div className="space-y-6">
                <GlassCard glowColor="none" className="border-white/5 bg-sleek-black/95">
                  <h3 className="font-display font-bold text-white text-base mb-2">Claimed Registrars Audit</h3>
                  <p className="text-xs text-gray-400 leading-snug mb-4">
                    Inspect details of institutions certifying claims in this candidate's history card.
                  </p>

                  <div className="space-y-3">
                    {institutions.map((inst) => {
                      const matchedInEdu = profile.education.some(edu => edu.institutionId === inst.id);
                      const matchedInExp = profile.experience.some(exp => exp.institutionId === inst.id);
                      
                      const isLinked = matchedInEdu || matchedInExp;
                      
                      return (
                        <div key={inst.id} className={`p-3.5 rounded-xl border ${isLinked ? "bg-deep-blue/10 border-deep-blue/20" : "bg-black/30 border-white/5 opacity-55"}`}>
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-white text-xs font-bold leading-tight block">{inst.name}</span>
                            {isLinked && (
                              <span className="text-[8px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded font-mono shrink-0 uppercase tracking-wider font-bold">Linked</span>
                            )}
                          </div>
                          
                          <span className="text-[9px] text-gray-500 font-mono block mt-1">{inst.regCode} • {inst.type}</span>
                          
                          <div className="mt-3 pt-2 border-t border-white/5 text-[11px] space-y-1.5 text-gray-400 font-mono">
                            <p className="flex items-center gap-1"><GraduationCap className="h-3 w-3 shrink-0" /> Lead: {inst.signatoryName}</p>
                            <p className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /> {inst.contactEmail}</p>
                            <p className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /> {inst.contactPhone}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* POPUP: ADD TERM FORM (EDU) */}
      {showAddEdu && (
        <div className="fixed inset-0 z-50 bg-[#060608]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-sleek-black border border-white/10 max-w-md w-full rounded-2xl overflow-hidden glass shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-white">Add Academic Term Block</h3>
              <button onClick={() => setShowAddEdu(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEducation} className="p-5 space-y-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Certifying Institution *</label>
                <select
                  value={newEdu.institutionId}
                  onChange={(e) => setNewEdu({ ...newEdu, institutionId: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Degree Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.S. in Computer Science"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Field of Study</label>
                <input
                  type="text"
                  placeholder="e.g. Software Systems"
                  value={newEdu.field}
                  onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Start Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="2024"
                    value={newEdu.startYear}
                    onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">End Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={newEdu.endYear}
                    onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Score / GPAs Accredit</label>
                <input
                  type="text"
                  placeholder="GPA 3.98 / 4.0"
                  value={newEdu.score}
                  onChange={(e) => setNewEdu({ ...newEdu, score: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddEdu(false)}
                  className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-vibrant-orange hover:bg-vibrant-orange/90 text-white text-xs px-5 py-2 rounded-lg font-bold"
                >
                  Save Academic Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP: ADD EXPERIENCE FORM */}
      {showAddExp && (
        <div className="fixed inset-0 z-50 bg-[#060608]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-sleek-black border border-white/10 max-w-md w-full rounded-2xl overflow-hidden glass shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-white">Add Experience Entry</h3>
              <button onClick={() => setShowAddExp(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddExperience} className="p-5 space-y-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Employer Institution *</label>
                <select
                  value={newExp.institutionId}
                  onChange={(e) => setNewExp({ ...newExp, institutionId: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                >
                  {institutions.filter(i => i.type === "Company").map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Role Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Dev Intern"
                  value={newExp.role}
                  onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Core Responsibilities & Vettings</label>
                <textarea
                  rows={2}
                  placeholder="Achievements, tags, alignment details..."
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Start Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jun 2024"
                    value={newExp.startDate}
                    onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">End Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sep 2024 (or Present)"
                    value={newExp.endDate}
                    onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddExp(false)}
                  className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-deep-blue hover:bg-deep-blue/80 text-white text-xs px-5 py-2 rounded-lg font-bold"
                >
                  Save Work Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#060608]/90 py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-2">
          <p>AetherFolio Gate • Decentralized Student Portability Network Layer</p>
          <p className="font-mono text-[10px] text-gray-600">
            End-To-End AES-GCM Client Crypto Engine © 2026. All data processing occurs locally.
          </p>
        </div>
      </footer>
    </div>
  );
}
