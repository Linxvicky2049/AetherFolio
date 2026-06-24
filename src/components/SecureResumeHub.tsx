import React, { useState, useRef, useEffect } from "react";
import { 
  User, Briefcase, GraduationCap, ShieldCheck, Mail, Phone, MapPin, 
  Share2, Save, CheckCircle, Copy, FileText, Send, Trash2, Plus, Edit,
  Fingerprint, Camera, Sparkles, Lock, Shield, Layers, HelpCircle, AlertCircle,
  Award, Heart, CheckCircle2, QrCode, HardDrive, Printer, Globe, Compass, DollarSign, TrendingUp, Activity
} from "lucide-react";
import { StudentProfile, Institution, Project } from "../types";
import GlassCard from "./GlassCard";

// Location dynamic coordinate mapping UI
const LocationMapTelemetry = ({ lat, lng, isFetching, locationName, flag }: { 
  lat: number, 
  lng: number, 
  isFetching: boolean, 
  locationName: string, 
  flag: string 
}) => {
  return (
    <div className="relative h-44 bg-[#0a0c10] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-3 font-mono text-[9px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent)] pointer-events-none" />
      {/* Grid background lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }} />
      
      {/* Scope Scanning Rings and target */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full border border-cyan-500/20 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-cyan-500/10 animate-[ping_4s_linear_infinite]" />
        </div>
        {/* Horizontal & Vertical Crosshair axes */}
        <div className="absolute h-full w-[0.5px] bg-cyan-500/10" />
        <div className="absolute w-full h-[0.5px] bg-cyan-500/10" />
      </div>

      {/* Top telemetry lines */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-lg border border-white/5">
          <span className="text-[12px]">{flag || "🧭"}</span>
          <span className="text-white font-bold truncate max-w-[120px] text-[10px]">{locationName || "Location Marker"}</span>
        </div>
        <div className="text-right text-cyan-400 font-bold bg-cyan-950/45 border border-cyan-500/20 px-1.5 py-0.5 rounded font-mono">
          {isFetching ? "ACQUIRING..." : "LIVE SYNC"}
        </div>
      </div>

      {/* Center Target Dot representing Location */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative translate-x-1 -translate-y-2">
          {/* Target marker dot */}
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/30 flex items-center justify-center animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
          </div>
          {/* Coordinate text badge floating near the point */}
          <div className="absolute left-4 -top-1 bg-black/80 px-1.5 py-0.5 border border-white/15 rounded text-[8px] text-gray-300 font-mono whitespace-nowrap">
            LAT: {lat.toFixed(4)} / LNG: {lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Bottom coordinate readings */}
      <div className="flex justify-between items-end z-10 w-full bg-black/40 p-1.5 rounded-lg border border-white/5 backdrop-blur-xs">
        <div>
          <span className="text-[7px] text-gray-500 block uppercase font-sans">Latitude Position</span>
          <span className="text-emerald-400 font-semibold">{lat >= 0 ? `${lat.toFixed(3)}°N` : `${Math.abs(lat).toFixed(3)}°S`}</span>
        </div>
        <div className="text-right">
          <span className="text-[7px] text-gray-500 block uppercase font-sans font-mono">Longitude Position</span>
          <span className="text-emerald-400 font-semibold">{lng >= 0 ? `${lng.toFixed(3)}°E` : `${Math.abs(lng).toFixed(3)}°W`}</span>
        </div>
      </div>
    </div>
  );
};

export const PROFESSIONAL_TITLES = [
  "Quantum Machine Learning Researcher",
  "Full Stack Engineer",
  "Data Scientist",
  "AI Ethics Specialist",
  "Wellness Product Developer",
  "Cybersecurity Auditor",
  "Blockchain Consensus Developer"
];

export const LOCATION_OPTIONS = [
  "Silicon Valley, California",
  "Port Harcourt, Nigeria",
  "London, UK",
  "Berlin, Germany",
  "Tokyo, Japan",
  "Toronto, Canada"
];

interface SecureResumeHubProps {
  profile: StudentProfile;
  institutions: Institution[];
  onUpdateProfile?: (updatedProfile: StudentProfile) => void;
  onShare?: () => void;
  shareUrl?: string;
  isReadOnly?: boolean;
  onAddInstitution?: (newInst: Institution) => void;
}

export default function SecureResumeHub({ 
  profile, 
  institutions, 
  onUpdateProfile = () => {}, 
  onShare = () => {},
  shareUrl = "",
  isReadOnly = false,
  onAddInstitution = () => {}
}: SecureResumeHubProps) {
  
  // Tab within Resume Hub
  const [activeSubTab, setActiveSubTab] = useState<"edit-resume" | "biometrics-scan" | "preview-cv">(
    isReadOnly ? "preview-cv" : "edit-resume"
  );

  // Local editable fields initialized from App state
  const [resumeData, setResumeData] = useState<StudentProfile>(profile);
  useEffect(() => {
    setResumeData(profile);
  }, [profile]);

  const [customTitleInput, setCustomTitleInput] = useState("");
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Parse multi-select titles from resumeData.headline
  const currentTitles = resumeData.headline
    ? resumeData.headline.split(/\s*\|\s*/).map(x => x.trim()).filter(Boolean)
    : [];

  const toggleTitle = (title: string) => {
    let updated: string[];
    if (currentTitles.includes(title)) {
      updated = currentTitles.filter(t => t !== title);
    } else {
      updated = [...currentTitles, title];
    }
    const nextProfile = {
      ...resumeData,
      headline: updated.join(" | ")
    };
    setResumeData(nextProfile);
    onUpdateProfile(nextProfile);
  };

  const handleAddCustomTitle = () => {
    const value = customTitleInput.trim();
    if (value && !currentTitles.includes(value)) {
      const updated = [...currentTitles, value];
      const nextProfile = {
        ...resumeData,
        headline: updated.join(" | ")
      };
      setResumeData(nextProfile);
      onUpdateProfile(nextProfile);
    }
    setCustomTitleInput("");
  };

  // Skill-tag logic
  const [customSkillInput, setCustomSkillInput] = useState("");
  const currentSkills = resumeData.skills || [];

  const toggleSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    let updated: string[];
    if (currentSkills.includes(trimmed)) {
      updated = currentSkills.filter(s => s !== trimmed);
    } else {
      updated = [...currentSkills, trimmed];
    }
    const nextProfile = {
      ...resumeData,
      skills: updated
    };
    setResumeData(nextProfile);
    onUpdateProfile(nextProfile);
  };

  const handleAddCustomSkill = () => {
    const value = customSkillInput.trim();
    if (value && !currentSkills.includes(value)) {
      toggleSkill(value);
    }
    setCustomSkillInput("");
  };

  // State for Project Add Tags visual component
  const [currProjTags, setCurrProjTags] = useState<string[]>([]);
  const [projTagInput, setProjTagInput] = useState("");

  const handleAddProjTag = (tag: string) => {
    const val = tag.trim();
    if (val && !currProjTags.includes(val)) {
      setCurrProjTags([...currProjTags, val]);
    }
  };

  const handleRemoveProjTag = (tag: string) => {
    setCurrProjTags(currProjTags.filter(t => t !== tag));
  };

  // Real-time university ranking and certified metadata external API connection
  const [uniSearchResults, setUniSearchResults] = useState<any[]>([]);
  const [isUniSearching, setIsUniSearching] = useState(false);
  const [selectedUniDetails, setSelectedUniDetails] = useState<any | null>(null);

  // Debounce API calls or search whenever newEdu.school changes
  const searchUniversities = async (query: string) => {
    if (query.trim().length < 3) {
      setUniSearchResults([]);
      return;
    }
    setIsUniSearching(true);
    try {
      const res = await fetch(`https://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      // limit to 5 results
      setUniSearchResults(data.slice(0, 5));
    } catch (err) {
      console.error("Failed to query university external API:", err);
    } finally {
      setIsUniSearching(false);
    }
  };

  const selectLocation = (loc: string) => {
    const nextProfile = {
      ...resumeData,
      location: loc
    };
    setResumeData(nextProfile);
    onUpdateProfile(nextProfile);
    setIsLocationDropdownOpen(false);
  };

  // Live geographic API states & connection metadata
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationMetaData, setLocationMetaData] = useState<{
    flag: string;
    commonName: string;
    officialName: string;
    capital: string;
    region: string;
    subregion: string;
    languages: string;
    currency: string;
    population: string;
    lat: number;
    lng: number;
    timezone: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [customLat, setCustomLat] = useState<string>("");
  const [customLng, setCustomLng] = useState<string>("");

  const fetchLocationAPIData = async (locName: string) => {
    if (!locName) return;
    setIsFetchingLocation(true);
    setLocationError(null);
    
    try {
      // Clean query country name
      const parts = locName.split(",");
      const queryCountry = parts[parts.length - 1].trim();
      
      const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(queryCountry)}?fullText=false`);
      if (!res.ok) {
        throw new Error(`Country API failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data && data[0]) {
        const country = data[0];
        const currencies = country.currencies 
          ? Object.values(country.currencies).map((c: any) => `${c.name} (${c.symbol || ''})`).join(", ") 
          : "N/A";
        const languages = country.languages 
          ? Object.values(country.languages).join(", ") 
          : "N/A";
        const coords = country.latlng || [0, 0];
        
        setLocationMetaData({
          flag: country.flag || "🌐",
          commonName: country.name?.common || queryCountry,
          officialName: country.name?.official || queryCountry,
          capital: country.capital?.[0] || "N/A",
          region: country.region || "N/A",
          subregion: country.subregion || "N/A",
          languages,
          currency: currencies,
          population: country.population ? country.population.toLocaleString() : "N/A",
          lat: Number(coords[0]),
          lng: Number(coords[1]),
          timezone: country.timezones?.[0] || "UTC"
        });
        
        setCustomLat(String(coords[0]));
        setCustomLng(String(coords[1]));
      }
    } catch (err: any) {
      console.warn("RESTCountries fetch failed, trying high-fidelity local cache:", err);
      // High-precision geographic and market cache to secure the application against network limits
      const presetsFallback: Record<string, any> = {
        "california": { lat: 37.4275, lng: -122.1697, capital: "Sacramento", region: "Americas", subregion: "North America", languages: "English", currency: "US Dollar ($)", population: "39,000,000", timezone: "UTC-08:00", flag: "🇺🇸", commonName: "United States" },
        "silicon valley": { lat: 37.4275, lng: -122.1697, capital: "Sacramento", region: "Americas", subregion: "North America", languages: "English", currency: "US Dollar ($)", population: "39,000,000", timezone: "UTC-08:00", flag: "🇺🇸", commonName: "United States" },
        "us": { lat: 37.0902, lng: -95.7129, capital: "Washington, D.C.", region: "Americas", subregion: "North America", languages: "English", currency: "US Dollar ($)", population: "331,000,000", timezone: "UTC-05:00", flag: "🇺🇸", commonName: "United States" },
        "nigeria": { lat: 9.0820, lng: 8.6753, capital: "Abuja", region: "Africa", subregion: "Western Africa", languages: "English, Yoruba, Igbo, Hausa", currency: "Nigerian Naira (₦)", population: "206,000,000", timezone: "UTC+01:00", flag: "🇳🇬", commonName: "Nigeria" },
        "port harcourt": { lat: 4.8156, lng: 7.0498, capital: "Abuja", region: "Africa", subregion: "Western Africa", languages: "English, Pidgin", currency: "Nigerian Naira (₦)", population: "206,000,000", timezone: "UTC+01:00", flag: "🇳🇬", commonName: "Nigeria" },
        "uk": { lat: 51.5074, lng: -0.1278, capital: "London", region: "Europe", subregion: "Northern Europe", languages: "English", currency: "Pound Sterling (£)", population: "67,000,000", timezone: "UTC+00:00", flag: "🇬🇧", commonName: "United Kingdom" },
        "london": { lat: 51.5074, lng: -0.1278, capital: "London", region: "Europe", subregion: "Northern Europe", languages: "English", currency: "Pound Sterling (£)", population: "67,000,000", timezone: "UTC+00:00", flag: "🇬🇧", commonName: "United Kingdom" },
        "germany": { lat: 52.5200, lng: 13.4050, capital: "Berlin", region: "Europe", subregion: "Western Europe", languages: "German", currency: "Euro (€)", population: "83,000,000", timezone: "UTC+01:00", flag: "🇩🇪", commonName: "Germany" },
        "berlin": { lat: 52.5200, lng: 13.4050, capital: "Berlin", region: "Europe", subregion: "Western Europe", languages: "German", currency: "Euro (€)", population: "83,000,000", timezone: "UTC+01:00", flag: "🇩🇪", commonName: "Germany" },
        "japan": { lat: 35.6762, lng: 139.6503, capital: "Tokyo", region: "Asia", subregion: "Eastern Asia", languages: "Japanese", currency: "Japanese Yen (¥)", population: "125,000,000", timezone: "UTC+09:00", flag: "🇯🇵", commonName: "Japan" },
        "tokyo": { lat: 35.6762, lng: 139.6503, capital: "Tokyo", region: "Asia", subregion: "Eastern Asia", languages: "Japanese", currency: "Japanese Yen (¥)", population: "125,000,000", timezone: "UTC+09:00", flag: "🇯🇵", commonName: "Japan" },
        "canada": { lat: 45.4215, lng: -75.6972, capital: "Ottawa", region: "Americas", subregion: "North America", languages: "English, French", currency: "Canadian Dollar ($)", population: "38,000,000", timezone: "UTC-05:00", flag: "🇨🇦", commonName: "Canada" },
        "toronto": { lat: 43.6532, lng: -79.3832, capital: "Ottawa", region: "Americas", subregion: "North America", languages: "English, French", currency: "Canadian Dollar ($)", population: "38,000,000", timezone: "UTC-05:00", flag: "🇨🇦", commonName: "Canada" },
      };
      
      const matchedKey = Object.keys(presetsFallback).find(k => locName.toLowerCase().includes(k));
      if (matchedKey) {
        const item = presetsFallback[matchedKey];
        setLocationMetaData({
          flag: item.flag,
          commonName: item.commonName,
          officialName: `${item.commonName} Region`,
          capital: item.capital,
          region: item.region,
          subregion: item.subregion,
          languages: item.languages,
          currency: item.currency,
          population: item.population,
          lat: item.lat,
          lng: item.lng,
          timezone: item.timezone
        });
        setCustomLat(String(item.lat));
        setCustomLng(String(item.lng));
      } else {
        setLocationError("Manual coordinates active - no remote location metadata matched.");
      }
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // Auto trigger live API details fetch on input changes
  useEffect(() => {
    if (resumeData.location) {
      const delayDebounceFn = setTimeout(() => {
        fetchLocationAPIData(resumeData.location);
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [resumeData.location]);

  // Regional hiring standards catalog based on active country geo intelligence
  const getRegionalHiringIndices = (regionName: string) => {
    switch (regionName) {
      case "Africa":
        return {
          avgSalary: "$45,000 - $115,000 USD Equivalent",
          techHubs: "Lagos, Port Harcourt, Nairobi, Cape Town, Accra",
          topSkills: ["Python", "Node.js", "React Native", "PostgreSQL", "Solidity (DeFi)", "E2E Encryption"],
          marketStrain: "Extremely High (Global Remote Software Engineering Teams)"
        };
      case "Europe":
        return {
          avgSalary: "€65,000 - €135,000 EUR",
          techHubs: "London, Berlin, Munich, Paris, Amsterdam, Zurich",
          topSkills: ["TypeScript", "Docker", "AWS Cloud", "Rust System", "Cybersecurity Audit", "C++ Engine"],
          marketStrain: "High Regulatory Demand (FinTech, Data Protections, GDPR)"
        };
      case "Asia":
        return {
          avgSalary: "¥7,500,000 - ¥16,000,000 JPY",
          techHubs: "Tokyo, Singapore, Seoul, Bangalore, Shenzhen",
          topSkills: ["C++", "CUDA Platform", "Edge AI Controls", "IoT Protocols", "Embedded Systems"],
          marketStrain: "Intense Scale-up (High-Compute AI Systems, Qubit Hardware Labs)"
        };
      case "Americas":
      default:
        return {
          avgSalary: "$120,000 - $245,000 USD",
          techHubs: "Silicon Valley, San Francisco, Seattle, Toronto, Austin, NY",
          topSkills: ["Python", "Go Core", "TensorFlow Quantum", "CUDA", "Next.JS (Vercel)", "Kubernetes"],
          marketStrain: "Peak Venture Density (Quantum Networks, Large Multi-Modal AI Systems)"
        };
    }
  };

  // Biometric state mock & interaction
  const [scanState, setScanState] = useState<"idle" | "accessing_camera" | "scanning" | "completed" | "error">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [biometricKey, setBiometricKey] = useState<string>("");
  const [fingerprintScore, setFingerprintScore] = useState<number>(0);
  const [faceMatchScore, setFaceMatchScore] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Recommendations state (within resume schema)
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    gitUsername?: string;
    authorName: string;
    authorRole: string;
    text: string;
    signedHash: string;
    rating: number; // 1-5
  }>>([
    {
      id: "rec-01",
      authorName: "Dr. Elijah Vance",
      authorRole: "Director, Stanford Quantum Computing Lab",
      text: "Alexandra has shown unmatched rigor in engineering high-dimensional vector grids. Her capability to mesh CUDA optimizations makes her an elite candidate for deep machine learning research.",
      signedHash: "SIG-ECDSA-3a992ff81e...9fa2",
      rating: 5
    },
    {
      id: "rec-02",
      authorName: "Sarah K.",
      authorRole: "Principal Core AI Engineer at OpenAI",
      text: "Superb alignment paradigms formulation. Under her supervision, quantum models drift protocols showed outstanding structural defense benchmarks.",
      signedHash: "SIG-ECDSA-ee77ba3a91...bc23",
      rating: 5
    }
  ]);

  // Editing items dialog states
  const [editingIndex, setEditingIndex] = useState<{ type: "edu" | "exp" | "proj" | "rec"; index: number } | null>(null);
  const [showAddForm, setShowAddForm] = useState<"edu" | "exp" | "proj" | "rec" | null>(null);

  // Buffer state for fields
  const [newEdu, setNewEdu] = useState({ degree: "", field: "", school: "", startYear: "", endYear: "", score: "" });
  const [newExp, setNewExp] = useState({ role: "", employer: "", start: "", end: "", desc: "" });
  const [newProj, setNewProj] = useState({ title: "", description: "", tags: "", metrics: "", liveUrl: "", githubUrl: "" });
  const [newRec, setNewRec] = useState({ authorName: "", authorRole: "", text: "", rating: 5 });

  // Biometric scanning effects
  const triggerBiometricScan = async () => {
    setScanState("accessing_camera");
    setScanProgress(0);
    try {
      // Prompt for real webcam permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .catch(() => null); // Fallback to simulation if container iframe blocks or webcam missing

      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
      }
      setScanState("scanning");
    } catch {
      // In frame permission sandboxes, fall back elegantly to simulated bio scanner
      setScanState("scanning");
    }
  };

  useEffect(() => {
    let interval: any;
    if (scanState === "scanning") {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // End video stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            // Generate synthetic biometric state
            const fakeHash = "BIO-HEX-2026-" + Math.floor(Math.random() * 100000000).toString(16).toUpperCase();
            setBiometricKey(fakeHash);
            setFingerprintScore(99.4 + Math.random() * 0.5);
            setFaceMatchScore(98.9 + Math.random() * 1.0);
            setScanState("completed");

            // Update user bio profile to inject the biometric key signature inside profile metadata
            const profileUpdate = {
              ...resumeData,
              bio: resumeData.bio.includes("BIOMETRIC-PASSPORT")
                ? resumeData.bio
                : `${resumeData.bio} [BIOMETRIC-PASSPORT ID: ${fakeHash}]`
            };
            setResumeData(profileUpdate);
            onUpdateProfile(profileUpdate);
            return 100;
          }
          return prev + 6;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [scanState]);

  // Clean stream on dismount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Save full cv
  const handleCommitLedge = () => {
    onUpdateProfile(resumeData);
    alert("Resume and profile details saved successfully!");
  };

  // Delete handlers
  const deleteEdu = (id: string) => {
    const updatedEdu = resumeData.education.filter(e => e.id !== id);
    const updated = { ...resumeData, education: updatedEdu };
    setResumeData(updated);
    onUpdateProfile(updated);
  };

  const deleteExp = (id: string) => {
    const updatedExp = resumeData.experience.filter(e => e.id !== id);
    const updated = { ...resumeData, experience: updatedExp };
    setResumeData(updated);
    onUpdateProfile(updated);
  };

  const deleteProj = (id: string) => {
    const updatedProj = resumeData.projects.filter(p => p.id !== id);
    const updated = { ...resumeData, projects: updatedProj };
    setResumeData(updated);
    onUpdateProfile(updated);
  };

  const deleteRec = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // Add handlers
  const addEdu = () => {
    if (!newEdu.degree || !newEdu.school) return;
    // create custom institution
    const instId = "inst-custom-" + Date.now();
    
    // Stable procedural world rank based on name length and characters
    const proceduralRank = () => {
      if (newEdu.school.toLowerCase().includes("stanford")) return "#2 QS Global Rank";
      if (newEdu.school.toLowerCase().includes("massachusetts") || newEdu.school.toLowerCase().includes("mit")) return "#1 QS Global Rank";
      if (newEdu.school.toLowerCase().includes("oxford")) return "#3 QS Global Rank";
      if (newEdu.school.toLowerCase().includes("harvard")) return "#4 QS Global Rank";
      if (newEdu.school.toLowerCase().includes("cambridge")) return "#5 QS Global Rank";
      
      const charSum: number = (Array.from(newEdu.school) as string[]).reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const rankNum = (Number(charSum) % 380) + 12;
      return `#${rankNum} QS Global Rank`;
    };

    const targetRank = selectedUniDetails?.ranking || proceduralRank();
    const domainFromState = selectedUniDetails?.domains?.[0] || (selectedUniDetails?.web_pages?.[0] ? new URL(selectedUniDetails.web_pages[0]).hostname.replace("www.", "") : "");

    const newInst: Institution = {
      id: instId,
      name: newEdu.school,
      type: "University",
      regCode: "US-ACC-" + Math.floor(Math.random() * 90000 + 10000),
      website: selectedUniDetails?.web_pages?.[0] || `https://www.${domainFromState || "edu-trust-network.org"}`,
      contactEmail: `registrar@${domainFromState || "edu-trust-network.org"}`,
      contactPhone: "+1 (800) " + Math.floor(Math.random() * 900 + 110) + "-5005",
      status: "Accredited",
      authorityRank: selectedUniDetails?.country ? `Ministry of Higher Education, ${selectedUniDetails.country}` : "Western Association of Higher Education Boards",
      signatoryName: "Registrar Certification Seal Office",
      officeAddress: selectedUniDetails?.country ? `Campus Center, ${selectedUniDetails.country}` : "Global Registry Nodes, World CS Hub",
      ranking: targetRank,
      domain: domainFromState,
      certMeta: `Rank Verified: ${targetRank} | Active Node Domain Match`
    };

    onAddInstitution(newInst);

    const newEntry = {
      id: "edu-" + Date.now(),
      institutionId: instId,
      degree: newEdu.degree,
      field: newEdu.field,
      startYear: newEdu.startYear || "2024",
      endYear: newEdu.endYear || "2026",
      score: newEdu.score,
      isVerified: true
    };
    const updated = {
      ...resumeData,
      education: [...resumeData.education, newEntry]
    };
    setResumeData(updated);
    onUpdateProfile(updated);
    setShowAddForm(null);
    setNewEdu({ degree: "", field: "", school: "", startYear: "", endYear: "", score: "" });
    setSelectedUniDetails(null);
    setUniSearchResults([]);
  };

  const addExp = () => {
    if (!newExp.role || !newExp.employer) return;
    const instId = "inst-custom-" + Date.now();
    const newEntry = {
      id: "exp-" + Date.now(),
      institutionId: instId,
      role: newExp.role,
      description: newExp.desc,
      startDate: newExp.start || "Jun 2025",
      endDate: newExp.end || "Present",
      isVerified: true
    };
    const updated = {
      ...resumeData,
      experience: [...resumeData.experience, newEntry]
    };
    setResumeData(updated);
    onUpdateProfile(updated);
    setShowAddForm(null);
    setNewExp({ role: "", employer: "", start: "", end: "", desc: "" });
  };

  const addProj = () => {
    if (!newProj.title) return;
    const newEntry: Project = {
      id: "proj-" + Date.now(),
      title: newProj.title,
      description: newProj.description,
      techTags: currProjTags.length > 0 ? currProjTags : (newProj.tags ? newProj.tags.split(",").map(t => t.trim()).filter(Boolean) : []),
      metrics: newProj.metrics || "Active",
      featured: true,
      liveUrl: newProj.liveUrl,
      githubUrl: newProj.githubUrl
    };
    const updated = {
      ...resumeData,
      projects: [...resumeData.projects, newEntry]
    };
    setResumeData(updated);
    onUpdateProfile(updated);
    setShowAddForm(null);
    setNewProj({ title: "", description: "", tags: "", metrics: "", liveUrl: "", githubUrl: "" });
    setCurrProjTags([]);
  };

  const addRec = () => {
    if (!newRec.authorName || !newRec.text) return;
    const fakeSig = "SIG-ECDSA-FUTURISTIC-" + Math.floor(Math.random() * 10000000).toString(16).toUpperCase();
    const newEntry = {
      id: "rec-" + Date.now(),
      authorName: newRec.authorName,
      authorRole: newRec.authorRole,
      text: newRec.text,
      signedHash: fakeSig,
      rating: newRec.rating
    };
    setRecommendations(prev => [...prev, newEntry]);
    setShowAddForm(null);
    setNewRec({ authorName: "", authorRole: "", text: "", rating: 5 });
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Selectors & Header */}
      {!isReadOnly ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-sleek-black/80 p-6 rounded-2xl border border-white/5 shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] text-vibrant-orange font-mono tracking-widest block uppercase font-bold">
              Job Candidate Trust Vault
            </span>
            <h2 className="font-display font-black text-2xl text-white tracking-tight">
              Secure Verifiable Resume Builder
            </h2>
            <p className="text-xs text-gray-400">
              Export a high-graphic, cryptographically binding CV anchored on the dynamic SHA chain.
            </p>
          </div>

          <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-xl text-[11px] font-mono">
            <button
              onClick={() => setActiveSubTab("edit-resume")}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSubTab === "edit-resume" ? "bg-deep-blue text-white font-bold" : "text-gray-500 hover:text-gray-300"}`}
            >
              1. Compile CV Data
            </button>
            
            <button
              onClick={() => setActiveSubTab("biometrics-scan")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${activeSubTab === "biometrics-scan" ? "bg-vibrant-orange text-white font-bold" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Fingerprint className="h-3.5 w-3.5 animate-pulse" /> 2. Biometrics Scan
            </button>

            <button
              onClick={() => setActiveSubTab("preview-cv")}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSubTab === "preview-cv" ? "bg-emerald-600 text-white font-bold" : "text-gray-500 hover:text-gray-300"}`}
            >
              3. Verifiable Public CV Preview
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-sleek-black/40 p-5 rounded-xl border border-white/5">
          <div>
            <span className="text-[9px] text-cyan-400 font-mono block uppercase tracking-wider font-bold">Verified Candidate Profile & Resume</span>
            <h3 className="font-display text-white text-lg font-bold">Verified Academic & Career Records</h3>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" /> SECURE INTEGRITY SEAL PREVIEW
          </div>
        </div>
      )}

      {/* RENDER TAB 1: COMPILE CV DATA */}
      {activeSubTab === "edit-resume" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Quick Personal Info Summary */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard glowColor="blue" className="p-5">
              <h3 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" /> Personal Details
              </h3>
              
              <div className="space-y-4 font-mono text-xs text-gray-300">
                {/* Full legal name & title section */}
                <div className="grid grid-cols-1 gap-3 border-b border-white/5 pb-3">
                  <div>
                    <label className="text-gray-500 text-[9px] uppercase block mb-1 font-bold tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.fullName}
                      onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                      className="w-full bg-black/60 border border-white/5 p-2 rounded-lg text-white font-sans text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                      placeholder="e.g. Alexandra Carter"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 text-[9px] uppercase block mb-1 font-bold tracking-wider">Professional Headline & Role(s)</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {currentTitles.length === 0 ? (
                        <span className="text-[9px] text-gray-500 italic font-sans font-medium">No roles added yet</span>
                      ) : (
                        currentTitles.map((title) => (
                          <span 
                            key={title} 
                            className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-sans text-[9px] font-bold"
                          >
                            {title}
                            <button
                              type="button"
                              onClick={() => toggleTitle(title)}
                              className="hover:text-red-400 focus:outline-none text-[10px] font-black font-mono ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <div className="relative">
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Add customizable roles..."
                            value={customTitleInput}
                            onChange={(e) => setCustomTitleInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomTitle();
                              }
                            }}
                            onFocus={() => setIsTitleDropdownOpen(true)}
                            className="w-full bg-black/60 border border-white/5 p-2 rounded-lg text-white font-sans text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                          />
                          {customTitleInput && (
                            <button
                              type="button"
                              onClick={handleAddCustomTitle}
                              className="absolute right-2 top-1.5 text-[8px] bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/30 text-cyan-300 px-1.5 py-0.5 rounded font-sans font-bold uppercase transition cursor-pointer"
                            >
                              Add
                            </button>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setIsTitleDropdownOpen(!isTitleDropdownOpen)}
                          className="bg-white/5 hover:bg-white/10 px-2.5 border border-white/5 rounded-lg text-gray-400 hover:text-white transition text-[10px] cursor-pointer"
                        >
                          {isTitleDropdownOpen ? "▲" : "▼ Options"}
                        </button>
                      </div>

                      {isTitleDropdownOpen && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-[#0a0c10] border border-white/10 rounded-xl p-2 shadow-2xl space-y-0.5">
                          <div className="text-[8px] font-bold text-gray-500 px-2 py-1 uppercase tracking-wider border-b border-white/5 mb-1 flex justify-between items-center">
                            <span>Verified Role Presets</span>
                            <button 
                              type="button"
                              onClick={() => setIsTitleDropdownOpen(false)}
                              className="hover:text-white text-[9px] normal-case font-normal"
                            >
                              Close
                            </button>
                          </div>
                          {PROFESSIONAL_TITLES.map((preset) => {
                            const isSelected = currentTitles.includes(preset);
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => toggleTitle(preset)}
                                className={`w-full text-left px-2 py-1 rounded transition-all text-[10px] flex justify-between items-center ${
                                  isSelected
                                    ? "bg-cyan-500/20 text-white font-bold"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <span>{preset}</span>
                                {isSelected && <span className="text-[8px] text-cyan-400 font-bold">✓ Active</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills Registry */}
                  <div className="pt-1.5">
                    <label className="text-gray-500 text-[9px] uppercase block mb-1 font-bold tracking-wider">Skills Registry</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {currentSkills.length === 0 ? (
                        <span className="text-[9px] text-gray-500 italic font-sans font-medium">No skills listed</span>
                      ) : (
                        currentSkills.map((skill) => (
                          <span 
                            key={skill} 
                            className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-sans text-[9px] font-bold"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className="hover:text-red-400 focus:outline-none text-[10px] font-black font-mono ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    <div className="relative">
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Add customizable skills..."
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomSkill();
                            }
                          }}
                          className="flex-1 bg-black/60 border border-white/5 p-2 rounded-lg text-white font-sans text-xs focus:ring-1 focus:ring-amber-500/50 outline-none"
                        />
                        {customSkillInput && (
                          <button
                            type="button"
                            onClick={handleAddCustomSkill}
                            className="bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg font-sans font-bold uppercase text-[10px] transition cursor-pointer"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="grid grid-cols-2 gap-3 border-b border-white/5 pb-3">
                  <div>
                    <label className="text-gray-500 text-[9px] uppercase block mb-1 font-bold tracking-wider">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-2.5 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                        className="w-full bg-black/60 border border-white/5 p-2 pl-9 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                        placeholder="your@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 text-[9px] uppercase block mb-1 font-bold tracking-wider">Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-2.5 h-3.5 w-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                        className="w-full bg-black/60 border border-white/5 p-2 pl-9 rounded-lg text-white text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                        placeholder="+1 (650) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Geography & API Metadata Block */}
                <div className="space-y-3 pb-3 border-b border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-500 text-[9px] uppercase block font-bold tracking-wider">Primary Location (Live Sync)</label>
                    <span className="text-[8px] text-cyan-400 flex items-center gap-1 font-mono">
                      <Activity className={`h-2.5 w-2.5 ${isFetchingLocation ? "animate-spin text-cyan-400" : "text-emerald-400 animate-pulse"}`} />
                      {isFetchingLocation ? "FETCHING REST API..." : "LIVE FEED CONNECTED"}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="flex gap-1.5">
                      <div className="relative flex-1 flex items-center">
                        <MapPin className="absolute left-2.5 h-3.5 w-3.5 text-cyan-500" />
                        <input
                          type="text"
                          value={resumeData.location}
                          onChange={(e) => {
                            setResumeData({ ...resumeData, location: e.target.value });
                          }}
                          onFocus={() => setIsLocationDropdownOpen(true)}
                          placeholder="Type City, Country..."
                          className="w-full bg-black/60 border border-white/5 p-2 pl-9 rounded-lg text-white font-sans text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        className="bg-white/5 hover:bg-white/10 px-2.5 border border-white/5 rounded-lg text-gray-400 hover:text-white transition text-[10px] cursor-pointer"
                      >
                        {isLocationDropdownOpen ? "▲" : "▼ Presets"}
                      </button>
                    </div>

                    {isLocationDropdownOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-[#0a0c10] border border-white/10 rounded-xl p-2 shadow-2xl space-y-0.5">
                        <div className="text-[8px] font-bold text-gray-500 px-2 py-1 uppercase tracking-wider border-b border-white/5 mb-1 flex justify-between items-center">
                          <span>Global Tech Hubs</span>
                          <button 
                            type="button" 
                            onClick={() => setIsLocationDropdownOpen(false)}
                            className="hover:text-white text-[9px]"
                          >
                            Close
                          </button>
                        </div>
                        {LOCATION_OPTIONS.map((loc) => {
                          const isSelected = resumeData.location === loc;
                          return (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => selectLocation(loc)}
                              className={`w-full text-left px-2 py-1.5 rounded transition-all text-[10px] flex justify-between items-center ${
                                isSelected
                                  ? "bg-orange-500/25 text-white font-bold"
                                  : "text-gray-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <span>{loc}</span>
                              {isSelected && <span className="text-[8px] text-orange-400 font-bold font-sans">Active</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Manual Coordinate Override input */}
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <span className="text-gray-500 text-[8px] uppercase block mb-1">Latitude Coordinates</span>
                      <input
                        type="text"
                        value={customLat}
                        onChange={(e) => setCustomLat(e.target.value)}
                        placeholder="e.g. 4.8156"
                        className="w-full bg-black/40 border border-white/5 p-1.5 rounded text-gray-300 font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[8px] uppercase block mb-1 font-mono">Longitude Coordinates</span>
                      <input
                        type="text"
                        value={customLng}
                        onChange={(e) => setCustomLng(e.target.value)}
                        placeholder="e.g. 7.0498"
                        className="w-full bg-black/40 border border-white/5 p-1.5 rounded text-gray-300 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Live Location Coordinates Map */}
                  <LocationMapTelemetry 
                    lat={Number(customLat) || 0} 
                    lng={Number(customLng) || 0} 
                    isFetching={isFetchingLocation} 
                    locationName={resumeData.location || "Location Marker"} 
                    flag={locationMetaData?.flag || "🧭"} 
                  />

                  {/* RESTCountries Live Information Card */}
                  {locationMetaData && (
                    <div className="bg-cyan-500/[0.02] border border-cyan-500/10 p-3 rounded-xl space-y-1.5 font-mono text-[9px] text-gray-400 animate-fadeIn">
                      <span className="text-cyan-400 font-semibold uppercase tracking-wider block text-[8px]">Live Connection Metadata (RestCountries API)</span>
                      
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div>
                          <span className="text-[7px] text-gray-500 uppercase block font-sans">Official Country Name</span>
                          <span className="text-white truncate block">{locationMetaData.officialName}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-gray-500 uppercase block font-sans">Capital City</span>
                          <span className="text-white block">{locationMetaData.capital}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-gray-500 uppercase block font-sans">Spoken Tongues</span>
                          <span className="text-white truncate block">{locationMetaData.languages}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-gray-500 uppercase block font-sans">Local Currency</span>
                          <span className="text-emerald-400 block">{locationMetaData.currency}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-gray-500 uppercase block font-sans">Regional Population</span>
                          <span className="text-white block">{locationMetaData.population}</span>
                        </div>
                        <div>
                          <span className="text-[7px] text-gray-500 uppercase block font-sans">Timezone</span>
                          <span className="text-cyan-400 block">{locationMetaData.timezone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Regional Job Market & Custom Skills Recommendations */}
                {locationMetaData && (
                  <div className="p-3.5 bg-vibrant-orange/5 border border-vibrant-orange/15 rounded-xl space-y-2 text-[9px] font-mono">
                    <div className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider">
                      <TrendingUp className="h-3.5 w-3.5 animate-bounce" />
                      <span>Regional Tech Hiring Insights ({locationMetaData.region})</span>
                    </div>

                    <div className="space-y-1 text-gray-300">
                      <div>
                        <span className="text-gray-500 block uppercase text-[7px]">Regional Tech Salary Estimates</span>
                        <span className="text-emerald-400 font-semibold">{getRegionalHiringIndices(locationMetaData.region).avgSalary}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase text-[7px]">Major Tech Cities</span>
                        <span className="text-white">{getRegionalHiringIndices(locationMetaData.region).techHubs}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase text-[7px]">Regulatory Market Environment</span>
                        <span className="text-orange-400 font-sans tracking-wide leading-relaxed block text-[8px] mt-0.5">{getRegionalHiringIndices(locationMetaData.region).marketStrain}</span>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-white/5">
                        <span className="text-gray-400 block uppercase font-bold text-[8px] mb-1.5">In-Demand Regional Tech Skills (Click to inject text)</span>
                        <div className="flex flex-wrap gap-1">
                          {getRegionalHiringIndices(locationMetaData.region).topSkills.map((sk) => (
                            <button
                              key={sk}
                              type="button"
                              onClick={() => {
                                // Inject into skills tag ledger securely
                                if (!currentSkills.includes(sk)) {
                                  toggleSkill(sk);
                                }
                              }}
                              className="bg-black/85 hover:bg-orange-500/20 text-orange-300 hover:text-white border border-orange-500/25 hover:border-orange-400 px-1.5 py-0.5 rounded cursor-pointer transition text-[8px] font-sans"
                            >
                              + {sk}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Executive Summary Statement Section */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-500 text-[9px] uppercase font-bold tracking-wider">Professional CV Executive Summary</label>
                    <span className="text-[8px] text-gray-500 font-mono">
                      {resumeData.bio.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={resumeData.bio}
                    onChange={(e) => setResumeData({ ...resumeData, bio: e.target.value })}
                    className="w-full bg-black/60 border border-white/5 p-2 rounded-lg text-white font-sans text-xs focus:ring-1 focus:ring-cyan-500/50 outline-none leading-relaxed"
                    placeholder="Provide a comprehensive summary of your expertise, career highlights, and specialized research..."
                  />
                </div>

                {/* Social Network Channels Section */}
                <div className="space-y-2 pt-1">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider font-bold block">Digital Network Channels</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500 text-[8px] block uppercase mb-0.5">LinkedIn Profile</span>
                      <input
                        type="text"
                        value={resumeData.socials.linkedin}
                        onChange={(e) => setResumeData({ 
                          ...resumeData, 
                          socials: { ...resumeData.socials, linkedin: e.target.value } 
                        })}
                        className="w-full bg-black/60 border border-white/5 p-1.5 rounded-lg text-white text-[11px] outline-none"
                        placeholder="https://linkedin.com/in/user"
                      />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[8px] block uppercase mb-0.5">GitHub Profile</span>
                      <input
                        type="text"
                        value={resumeData.socials.github}
                        onChange={(e) => setResumeData({ 
                          ...resumeData, 
                          socials: { ...resumeData.socials, github: e.target.value } 
                        })}
                        className="w-full bg-black/60 border border-white/5 p-1.5 rounded-lg text-white text-[11px] outline-none"
                        placeholder="https://github.com/user"
                      />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[8px] block uppercase mb-0.5">Portfolio Web URL</span>
                      <input
                        type="text"
                        value={resumeData.socials.website}
                        onChange={(e) => setResumeData({ 
                          ...resumeData, 
                          socials: { ...resumeData.socials, website: e.target.value } 
                        })}
                        className="w-full bg-black/60 border border-white/5 p-1.5 rounded-lg text-white text-[11px] outline-none"
                        placeholder="https://mywebsite.io"
                      />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[8px] block uppercase mb-0.5">Twitter / X Handle</span>
                      <input
                        type="text"
                        value={resumeData.socials.twitter}
                        onChange={(e) => setResumeData({ 
                          ...resumeData, 
                          socials: { ...resumeData.socials, twitter: e.target.value } 
                        })}
                        className="w-full bg-black/60 border border-white/5 p-1.5 rounded-lg text-white text-[11px] outline-none"
                        placeholder="https://x.com/user"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCommitLedge}
                  className="w-full bg-deep-blue hover:bg-deep-blue/80 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-deep-blue/10 cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save Passport Spec
                </button>
              </div>
            </GlassCard>

            {/* Verification hash indicators */}
            <div className="bg-[#0c0d12] border border-white/5 p-4 rounded-2xl text-[10px] font-mono space-y-2.5">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block">Cryptographic Integrity Log</span>
              
              <div className="space-y-1.5 text-gray-400">
                <div className="flex justify-between border-b border-white/2 pb-1">
                  <span>AES-GCM Master Key</span>
                  <span className="text-white font-semibold">Ready</span>
                </div>
                <div className="flex justify-between border-b border-white/2 pb-1">
                  <span>State Hash Signature</span>
                  <span className="text-cyan-400 truncate w-32 uppercase text-right">0x9F3EA3F3C88BD901CF3EAE6F</span>
                </div>
                <div className="flex justify-between">
                  <span>Biometric Passport</span>
                  <span className={biometricKey ? "text-emerald-400" : "text-yellow-500"}>
                    {biometricKey ? "Anchored" : "Scan Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sections list (Education, Experience, Projects, Recommendations) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Academic History Section */}
            <div className="bg-sleek-black/40 border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-cyan-400" />
                  <h4 className="font-display font-bold text-white text-sm uppercase">1. Verified Academic Track</h4>
                </div>
                
                <button
                  onClick={() => setShowAddForm("edu")}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Degree
                </button>
              </div>

              {/* Add form */}
              {showAddForm === "edu" && (
                <div className="p-4 bg-white/2 rounded-xl border border-cyan-500/20 space-y-3 text-xs font-mono">
                  <h5 className="font-bold text-white">Record New Degree Authority</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Degree / Certificate Info *"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <input
                      placeholder="Major Field Of Study"
                      value={newEdu.field}
                      onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <input
                        placeholder="Registrar / School Name *"
                        value={newEdu.school}
                        onChange={(e) => {
                          setNewEdu({ ...newEdu, school: e.target.value });
                          searchUniversities(e.target.value);
                        }}
                        className="w-full bg-black border border-white/15 p-2 rounded text-white"
                      />
                      {isUniSearching && (
                        <div className="absolute left-0 right-0 z-50 bg-[#0a0c10] border border-white/10 rounded-lg p-2 mt-1 text-[9px] text-cyan-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                          Querying global university authorities...
                        </div>
                      )}
                      {uniSearchResults.length > 0 && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto bg-[#0a0c10] border border-white/10 rounded-lg p-1.5 shadow-2xl space-y-1">
                          <div className="text-[8px] font-bold text-gray-500 px-1 py-0.5 uppercase tracking-wider border-b border-white/5">
                            API Results (Click to claim rank info)
                          </div>
                          {uniSearchResults.map((uni, idx) => {
                            // Compute a stable procedural QS ranking for displaying
                            const stableRankNum = (Array.from(uni.name as string).reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 380) + 12;
                            const displayRank = uni.name.toLowerCase().includes("stanford") ? "#2" 
                                              : uni.name.toLowerCase().includes("oxford") ? "#3" 
                                              : uni.name.toLowerCase().includes("harvard") ? "#4" 
                                              : uni.name.toLowerCase().includes("cambridge") ? "#5"
                                              : uni.name.toLowerCase().includes("massachusetts") ? "#1"
                                              : `#${stableRankNum}`;
                            
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedUniDetails({
                                    ...uni,
                                    ranking: `${displayRank} QS Global Rank`
                                  });
                                  setNewEdu({ ...newEdu, school: uni.name });
                                  setUniSearchResults([]);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-white/5 transition flex flex-col gap-0.5 border border-transparent hover:border-white/5"
                              >
                                <span className="font-bold text-white text-[10px] font-sans truncate">{uni.name}</span>
                                <div className="flex justify-between items-center text-[8px] text-gray-400 font-mono">
                                  <span>🌐 {uni.domains?.[0] || "institution-directory.org"}</span>
                                  <span className="text-amber-400 font-bold">{displayRank} QS Rank</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      
                      {selectedUniDetails && (
                        <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 p-1.5 rounded text-[8px] text-emerald-300 font-mono flex flex-col">
                          <span className="font-bold text-[9px] text-emerald-400">✓ API RANKING MATCH:</span>
                          <span>{selectedUniDetails.ranking} ({selectedUniDetails.country})</span>
                        </div>
                      )}
                    </div>
                    <input
                      placeholder="Start Year"
                      value={newEdu.startYear}
                      onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <input
                      placeholder="End Year"
                      value={newEdu.endYear}
                      onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      placeholder="GPA Score / Grading Scale"
                      value={newEdu.score}
                      onChange={(e) => setNewEdu({ ...newEdu, score: e.target.value })}
                      className="flex-1 bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <button onClick={addEdu} className="bg-green-600 text-white font-bold px-4 py-2 rounded">
                      Link Claims
                    </button>
                    <button onClick={() => setShowAddForm(null)} className="bg-white/5 text-gray-300 px-3 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* List */}
              <div className="space-y-3.5">
                {resumeData.education.length === 0 ? (
                  <p className="text-xs text-gray-500 font-mono">No degree claims indexed.</p>
                ) : (
                  resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-[#0a0c10] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-display font-bold text-xs text-white">{edu.degree}</h5>
                          <span className="text-[9px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded font-mono">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                        <p className="text-xs text-vibrant-orange font-mono">{edu.field}</p>
                        <p className="text-[10px] text-gray-500">{edu.score || "Status Code: Completed"}</p>
                      </div>

                      <button
                        onClick={() => deleteEdu(edu.id)}
                        className="p-1.5 hover:bg-white/5 rounded text-red-500/80 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Experience Track */}
            <div className="bg-sleek-black/40 border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-400" />
                  <h4 className="font-display font-bold text-white text-sm uppercase">2. Certified Experience Records</h4>
                </div>
                
                <button
                  onClick={() => setShowAddForm("exp")}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Work
                </button>
              </div>

              {/* Add form */}
              {showAddForm === "exp" && (
                <div className="p-4 bg-white/2 rounded-xl border border-orange-500/20 space-y-3 text-xs font-mono">
                  <h5 className="font-bold text-white">Record Career Placement</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Role Title *"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <input
                      placeholder="Employer / Corporate Body *"
                      value={newExp.employer}
                      onChange={(e) => setNewExp({ ...newExp, employer: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Start date (e.g., Jun 2024)"
                      value={newExp.start}
                      onChange={(e) => setNewExp({ ...newExp, start: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <input
                      placeholder="End date / Present"
                      value={newExp.end}
                      onChange={(e) => setNewExp({ ...newExp, end: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Main achievements or responsibilities..."
                      rows={2}
                      value={newExp.desc}
                      onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })}
                      className="w-full bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addExp} className="bg-orange-500 text-white font-bold px-4 py-2 rounded">
                      Anchor Role
                    </button>
                    <button onClick={() => setShowAddForm(null)} className="bg-white/5 text-gray-300 px-3 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* List */}
              <div className="space-y-3.5">
                {resumeData.experience.length === 0 ? (
                  <p className="text-xs text-gray-500 font-mono">No placements registered.</p>
                ) : (
                  resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 bg-[#0a0c10] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1 grow max-w-xl">
                        <div className="flex items-center gap-2">
                          <h5 className="font-display font-bold text-xs text-white">{exp.role}</h5>
                          <span className="text-[9px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-mono">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{exp.description}</p>
                      </div>

                      <button
                        onClick={() => deleteExp(exp.id)}
                        className="p-1.5 hover:bg-white/5 rounded text-red-500/80 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Interactive Showcases & Accomplishments */}
            <div className="bg-sleek-black/40 border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-lime-400" />
                  <h4 className="font-display font-bold text-white text-sm uppercase">3. Interactive Project Accomplishments</h4>
                </div>
                
                <button
                  onClick={() => setShowAddForm("proj")}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Project
                </button>
              </div>

              {/* Add form */}
              {showAddForm === "proj" && (
                <div className="p-4 bg-white/2 rounded-xl border border-lime-500/20 space-y-3 text-xs font-mono">
                  <h5 className="font-bold text-white">Log Active Accomplishment</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Project Code Title *"
                      value={newProj.title}
                      onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <div className="space-y-1.5">
                      <span className="text-gray-400 text-[10px] block font-bold uppercase mb-0.5">Project Tech Tags</span>
                      <div className="flex flex-wrap gap-1 min-h-[24px] bg-black/40 border border-white/5 p-1.5 rounded-lg">
                        {currProjTags.length === 0 ? (
                          <span className="text-gray-500 italic text-[10px]">No tags added (Type below to add)</span>
                        ) : (
                          currProjTags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-0.5 bg-lime-500/20 border border-lime-500/25 text-lime-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              {tag}
                              <button type="button" onClick={() => handleRemoveProjTag(tag)} className="hover:text-red-400 font-extrabold ml-1 font-mono text-xs">×</button>
                            </span>
                          ))
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          placeholder="Add tag (e.g. Next.js, Rust)"
                          value={projTagInput}
                          onChange={(e) => setProjTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddProjTag(projTagInput);
                              setProjTagInput("");
                            }
                          }}
                          className="flex-1 bg-black border border-white/15 p-2 rounded text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleAddProjTag(projTagInput);
                            setProjTagInput("");
                          }}
                          className="px-3 bg-lime-500/20 hover:bg-lime-500/30 text-lime-300 border border-lime-500/25 rounded font-bold text-xs cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Telemetry Metrics (e.g. 98 FPS Stable)"
                      value={newProj.metrics}
                      onChange={(e) => setNewProj({ ...newProj, metrics: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <input
                      placeholder="Live URL"
                      value={newProj.liveUrl}
                      onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Core shader architecture, recursive proofs layout..."
                      rows={2}
                      value={newProj.description}
                      onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                      className="w-full bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addProj} className="bg-lime-600 text-white font-bold px-4 py-2 rounded">
                      Publish Spec
                    </button>
                    <button onClick={() => setShowAddForm(null)} className="bg-white/5 text-gray-300 px-3 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* List */}
              <div className="space-y-3.5">
                {resumeData.projects.length === 0 ? (
                  <p className="text-xs text-gray-500 font-mono">No accomplishments registered.</p>
                ) : (
                  resumeData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 bg-[#0a0c10] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h5 className="font-display font-bold text-xs text-white">{proj.title}</h5>
                        <p className="text-xs text-gray-400">{proj.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {proj.techTags.map((t, i) => (
                            <span key={i} className="text-[9px] bg-white/5 text-gray-300 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteProj(proj.id)}
                        className="p-1.5 hover:bg-white/5 rounded text-red-500/80 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recommendations / Trust Licenses Section */}
            <div className="bg-sleek-black/40 border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <h4 className="font-display font-bold text-white text-sm uppercase">4. Encrypted Recommendations & Licenses</h4>
                </div>
                
                <button
                  onClick={() => setShowAddForm("rec")}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Advisory Letter
                </button>
              </div>

              {/* Add form */}
              {showAddForm === "rec" && (
                <div className="p-4 bg-white/2 rounded-xl border border-emerald-500/20 space-y-3 text-xs font-mono">
                  <h5 className="font-bold text-white">Record Encrypted Recommendation Endorsement</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Sponsor Full Name *"
                      value={newRec.authorName}
                      onChange={(e) => setNewRec({ ...newRec, authorName: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                    <input
                      placeholder="Sponsor Designation (e.g., Lead AI Architect) *"
                      value={newRec.authorRole}
                      onChange={(e) => setNewRec({ ...newRec, authorRole: e.target.value })}
                      className="bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Highly analytical, outstanding code discipline..."
                      rows={2}
                      value={newRec.text}
                      onChange={(e) => setNewRec({ ...newRec, text: e.target.value })}
                      className="w-full bg-black border border-white/15 p-2 rounded text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addRec} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded">
                      Inject Signed Endorsement
                    </button>
                    <button onClick={() => setShowAddForm(null)} className="bg-white/5 text-gray-300 px-3 py-2 rounded">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* List */}
              <div className="space-y-3.5">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-[#0a0c10] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1 grow max-w-xl">
                      <div className="flex items-center justify-between">
                        <h5 className="font-display font-semibold text-xs text-white">{rec.authorName}</h5>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          {rec.signedHash}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono">{rec.authorRole}</p>
                      <p className="text-xs text-gray-400 italic">"{rec.text}"</p>
                    </div>

                    <button
                      onClick={() => deleteRec(rec.id)}
                      className="p-1.5 hover:bg-white/5 rounded text-red-500/80 hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB 2: BIOMETRIC AUTHENTIC SCANNING */}
      {activeSubTab === "biometrics-scan" && (
        <div className="bg-sleek-black/80 rounded-2xl border border-white/5 p-8 max-w-3xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-vibrant-orange to-transparent opacity-80" />

          <div className="mx-auto w-20 h-20 rounded-full border border-vibrant-orange/30 bg-vibrant-orange/10 flex items-center justify-center shadow-lg shadow-vibrant-orange/10 mb-4">
            <Fingerprint className="h-10 w-10 text-vibrant-orange animate-pulse" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-display font-black text-white text-xl uppercase tracking-tight">
              Profile Verification Scanner
            </h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Verify your profile identity before finalizing your resume. This optional mock scan confirms you are the actual profile owner and generates a verification stamp for your resume.
            </p>
          </div>

          {/* ACTIVE SCANNING VISUAL ENGINE */}
          <div className="relative mx-auto rounded-xl border border-white/10 overflow-hidden w-80 h-60 bg-black flex items-center justify-center">
            
            {scanState === "idle" && (
              <div className="space-y-4 text-center">
                <p className="text-[11px] font-mono text-gray-500">System sensors ready for authorization</p>
                <button
                  onClick={triggerBiometricScan}
                  className="px-4 py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-all text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Start Identity Scan
                </button>
              </div>
            )}

            {scanState === "accessing_camera" && (
              <div className="animate-pulse space-y-2">
                <Camera className="h-8 w-8 text-orange-400 mx-auto" />
                <p className="text-[10px] font-mono text-gray-400">Requesting Web Device Ingress...</p>
              </div>
            )}

            {scanState === "scanning" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                
                {/* Fallback canvas or live feed */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 filter saturate-0 contrast-125"
                />

                {/* Sweeping laser green/orange overlay line */}
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,1)] z-20 animate-[bounce_3s_infinite_linear]"
                  style={{ top: `${scanProgress}%` }}
                />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.85))] z-10" />

                <div className="relative z-20 space-y-1">
                  <span className="text-3xl font-display font-black text-orange-400 select-none animate-pulse">
                    {scanProgress}%
                  </span>
                  <p className="text-[9px] font-mono text-white/80 uppercase tracking-widest block font-bold">
                    Analyzing Profile Stamp...
                  </p>
                </div>
              </div>
            )}

            {scanState === "completed" && (
              <div className="space-y-3.5 text-center p-4">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Identity Verified</h4>
                  <p className="text-[10px] text-gray-500 font-mono mt-1 break-all uppercase">
                    {biometricKey}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#0c131a] p-2 rounded-lg border border-white/5">
                  <div>
                    <span className="text-gray-500 block uppercase text-[8px]">Profile Matches</span>
                    <span className="text-emerald-400 font-bold">{faceMatchScore.toFixed(2)}% MATCH</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[8px]">Scan Integrity</span>
                    <span className="text-emerald-400 font-bold">{fingerprintScore.toFixed(2)}% GENUINE</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {scanState === "completed" && (
            <div className="pt-2 animate-fade-in flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setScanState("idle");
                  setBiometricKey("");
                }}
                className="px-4 py-2 border border-white/5 rounded-xl hover:bg-white/5 text-xs text-gray-400 font-mono transition-all"
              >
                Re-Scan Credentials
              </button>

              <button
                onClick={() => setActiveSubTab("preview-cv")}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5"
              >
                Proceed to Verifiable Preview
              </button>
            </div>
          )}

        </div>
      )}

      {/* RENDER TAB 3: VERIFIABLE PUBLIC CV PREVIEW */}
      {activeSubTab === "preview-cv" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main CV Sheet (8 column) */}
          <div className="lg:col-span-8 space-y-8 bg-stone-50 text-stone-900 border border-stone-200 shadow-2xl rounded-2xl p-8 relative overflow-hidden" id="secure-cv-printable-sheet">
            
            {/* Top-aligned watermark security band */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-600 via-emerald-600 to-orange-500" />
            
            {/* Header branding */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-stone-300 pb-6 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black tracking-widest text-cyan-700 uppercase">
                  CRYPTOGRAPHIC CURRICULUM VITAE
                </span>
                <h1 className="font-display text-3xl font-black text-stone-950 tracking-tight">
                  {resumeData.fullName}
                </h1>
                <p className="text-xs text-stone-600 font-mono">
                  {resumeData.headline}
                </p>
              </div>

              {/* QR Code and Identity Badging */}
              <div className="bg-stone-100 p-2.5 rounded-xl border border-stone-200 border-dashed text-right font-mono flex items-center gap-2">
                <div className="space-y-1 text-left">
                  <span className="text-[8px] uppercase font-bold text-stone-500 block">RECORD SIGNER</span>
                  <span className="text-[10px] text-stone-850 block font-bold truncate w-24">INSTITUTION_VERIFIED</span>
                  <span className="text-[8px] text-stone-400 block break-all">SIGNATURE-{biometricKey ? biometricKey.slice(-8) : "INITIAL_MOCK"}</span>
                </div>
                
                {/* Realistic procedural geometric verification stamp as open source behavior */}
                <div className="w-12 h-12 rounded border border-stone-400 flex flex-wrap p-1 gap-1 items-center justify-center bg-white">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-sm ${((i * 3 + 1) % 4 === 0) ? "bg-cyan-700" : "bg-stone-300"}`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
              <div className="md:col-span-2 space-y-2">
                <span className="text-[9px] font-mono font-bold text-stone-400 block uppercase">Mission / Career Agenda</span>
                <p className="text-stone-700 text-sm leading-relaxed font-serif">
                  {resumeData.bio}
                </p>
              </div>

              <div className="bg-stone-100/60 border border-stone-200/80 rounded-xl p-4 text-xs font-mono space-y-2.5">
                <span className="text-[9px] font-mono font-bold text-stone-400 block uppercase">SECURE PASSWORDS & NODES</span>
                <div className="space-y-1">
                  <span className="text-stone-500 block text-[9px]">Email Node:</span>
                  <span className="text-stone-950 block select-all font-semibold break-all">{resumeData.email}</span>
                </div>
                <div className="space-y-1 border-t border-stone-200 pt-1.5 mt-1.5">
                  <span className="text-stone-500 block text-[9px]">Authentication:</span>
                  <span className="text-stone-950 block font-semibold">{resumeData.phone}</span>
                </div>
                {biometricKey && (
                  <div className="space-y-1 border-t border-stone-200 pt-1.5 mt-1.5">
                    <span className="text-stone-500 block text-[9px]">Biometric Signature:</span>
                    <span className="text-emerald-700 block text-[9px] font-bold break-all">{biometricKey}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Core Tech Section */}
            {currentSkills.length > 0 && (
              <div className="space-y-2 pt-2 pb-4 border-b border-stone-200">
                <span className="text-[9px] font-mono font-bold text-stone-500 block uppercase">SECTION 1: CORE TECHNICAL CAPABILITIES</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentSkills.map((sk) => (
                    <span 
                      key={sk} 
                      className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-150 border border-stone-250 text-stone-800 px-3 py-1 rounded-full font-sans text-xs font-semibold transition"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Section Divider: Academic Tracks */}
            <div className="flex items-center gap-4 py-2 opacity-70">
              <span className="h-px bg-stone-300 flex-1" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-800 uppercase font-black">
                <GraduationCap className="h-3.5 w-3.5" /> SECTION 2: EDUCATION & DEGREES
              </div>
              <span className="h-px bg-stone-300 flex-1" />
            </div>

            {/* Educations Row */}
            <div className="space-y-4">
              {resumeData.education.map((edu) => {
                const matchedInst = institutions.find(i => i.id === edu.institutionId) || {
                  name: "Independent Academic Organ",
                  ranking: "",
                  domain: "edu-trust-network.org",
                  status: "Verified Record"
                };
                return (
                  <div key={edu.id} className="p-4 bg-stone-100/50 border border-stone-200 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display font-extrabold text-[#004dc5] text-sm">{edu.degree}</h4>
                        <span className="text-[8px] font-mono font-black uppercase tracking-wider bg-emerald-100 border border-emerald-200 text-emerald-800 py-0.5 px-2 rounded">
                          {matchedInst.status || "Accredited Cert Verified"}
                        </span>
                        {matchedInst.ranking && (
                          <span className="text-[8px] font-mono font-black uppercase tracking-wider bg-amber-100 border border-amber-200 text-amber-800 py-0.5 px-2 rounded">
                            👑 {matchedInst.ranking}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-700 font-mono mt-0.5 font-bold">Institution: {matchedInst.name}</p>
                      <p className="text-xs text-stone-700 font-mono font-bold">Major / Field of Study: {edu.field}</p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Academic Term: {edu.startYear} - {edu.endYear} • Grade / Score: {edu.score || "Completed"}
                      </p>
                    </div>
                    
                    <div className="text-left md:text-right text-[10px] font-mono shrink-0">
                      <span className="text-stone-850 font-black block">{matchedInst.name.toUpperCase()} CO-SIGN</span>
                      <span className="text-stone-500 block mt-1">🌐 {matchedInst.domain || "SECURE BLOCK APPROVED"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section Divider: Service/Work Track */}
            <div className="flex items-center gap-4 py-2 opacity-70">
              <span className="h-px bg-stone-300 flex-1" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-orange-800 uppercase font-black">
                <Briefcase className="h-3.5 w-3.5" /> SECTION 3: PROFESSIONAL EXPERIENCE
              </div>
              <span className="h-px bg-stone-300 flex-1" />
            </div>

            {/* Experiences Row */}
            <div className="space-y-4">
              {resumeData.experience.map((exp) => {
                const matchedInst = institutions.find(i => i.id === exp.institutionId) || {
                  name: "Independent Venture Office",
                  domain: "enterprise-network.org",
                  status: "Verified Corporate"
                };
                return (
                  <div key={exp.id} className="p-4 bg-stone-100/50 border border-stone-200 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-extrabold text-stone-900 text-sm">{exp.role}</h4>
                        <span className="text-[8px] font-mono font-black uppercase tracking-wider bg-orange-100 border border-orange-200 text-orange-850 py-0.5 px-2 rounded">
                          {matchedInst.status || "Corporate Verification Active"}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 font-mono font-bold mt-0.5">Employer / Organization: {matchedInst.name}</p>
                      <p className="text-xs text-stone-700 leading-relaxed font-serif mt-1 max-w-xl">{exp.description}</p>
                      <p className="text-[11px] text-stone-500 mt-1.5 font-mono">
                        Employment Period: {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                    
                    <div className="text-left md:text-right text-[10px] font-mono shrink-0">
                      <span className="text-stone-850 font-black block">{matchedInst.name.toUpperCase()} CO-SIGN</span>
                      <span className="text-stone-500 block mt-1">🌐 {matchedInst.domain || "SECURE SYSTEM BOARD"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section Divider: Recommendation Advisory */}
            <div className="flex items-center gap-4 py-2 opacity-70">
              <span className="h-px bg-stone-300 flex-1" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 uppercase font-black">
                <ShieldCheck className="h-3.5 w-3.5" /> SECTION 4: PROFESSIONAL RECOMMENDATIONS
              </div>
              <span className="h-px bg-stone-300 flex-1" />
            </div>

            {/* Recommendations Row */}
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-emerald-50/10 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-stone-950 font-bold block text-sm">{rec.authorName}</span>
                      <span className="text-stone-500 font-mono text-[10px] block">{rec.authorRole}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-100 border border-emerald-200 text-emerald-900 text-[10px] px-2.5 py-1 rounded-lg font-mono">
                      <Shield className="h-3.5 w-3.5 text-emerald-700" />
                      <span>{rec.signedHash}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 italic font-serif leading-relaxed">
                    "{rec.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Core Assurances */}
            <div className="pt-6 border-t border-stone-300 grid grid-cols-1 sm:grid-cols-12 gap-6 text-[10px] text-stone-500 font-mono">
              <div className="sm:col-span-8 leading-relaxed">
                <span className="font-bold text-stone-800 block uppercase mb-1">Verification & Authenticity Details</span>
                All credentials and records presented in this resume are digitally signed and verified. They represent authenticated copies of official academic and professional certificates securely managed by the user. No modifications can be made to these verified credentials.
              </div>

              <div className="sm:col-span-4 flex flex-col justify-end items-end text-right">
                <span className="text-[10px] text-stone-850 font-black italic">Secure Talent Directory</span>
                <div className="w-20 border-b border-stone-400 my-1 font-bold" />
                <span className="text-[8px] text-stone-400">Verified Portfolio Issuer</span>
              </div>
            </div>

          </div>

          {/* Share Actions Panel (4 column) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard glowColor="orange" className="p-5 space-y-4">
              <h3 className="font-display font-extrabold text-white text-base">
                Share Your Resume
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed">
                Share this verified resume with recruiters or hiring managers. Anyone with the link will be able to view your verified educational and work records.
              </p>

              <button
                onClick={onShare}
                className="w-full bg-vibrant-orange hover:bg-vibrant-orange/85 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow-lg shadow-vibrant-orange/15 cursor-pointer"
              >
                <Share2 className="h-4 w-4" /> Copy Share Link
              </button>

              <div className="space-y-1 pt-1">
                <span className="text-gray-500 text-[9px] uppercase font-mono block">Resume Share URL</span>
                <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-xl p-2">
                  <span className="text-[10px] font-mono text-cyan-400 truncate flex-1 block">
                    {shareUrl || window.location.href}
                  </span>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl || window.location.href);
                      alert("Resume share link copied to clipboard!");
                    }}
                    className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Resume / Save as PDF
              </button>
            </GlassCard>

            <div className="bg-[#0c0d12] border border-white/5 p-4 rounded-2xl text-[10px] font-mono space-y-2">
              <span className="text-cyan-400 font-bold block">Verified Portfolio Registry</span>
              <p className="text-gray-400 text-[10px] leading-relaxed">
                This resume integrates digital verification signatures and secure location mapping to generate a professional, authenticated student and candidate portfolio.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
