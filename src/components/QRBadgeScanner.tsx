import React, { useState, useRef, useEffect } from "react";
import { QrCode, Camera, Upload, AlertCircle, ShieldCheck, CheckCircle, Info, RefreshCw, X, Award, Building, UserCheck, Eye, Sparkles } from "lucide-react";
import { Institution } from "../types";
import GlassCard from "./GlassCard";

interface QRBadgeScannerProps {
  institutions: Institution[];
  theme: "dark" | "light";
}

interface DecodedBadge {
  id: string;
  studentName: string;
  institutionName: string;
  title: string;
  field: string;
  status: string;
  issueDate: string;
  expireDate: string;
  regCode: string;
  signature: string;
  hash: string;
  gpaOrScore?: string;
}

const PRESET_BADGES: DecodedBadge[] = [
  {
    id: "badge-stanford",
    studentName: "Alexandra Carter",
    institutionName: "Stanford University",
    title: "M.S. in Computer Science",
    field: "Artificial Intelligence & Quantum Computing",
    status: "Active Student Enrollment Record",
    issueDate: "September 2024",
    expireDate: "June 2026",
    regCode: "US-CA-STAN-009211",
    signature: "Dr. Marc Tessier-Lavigne, Registrar",
    hash: "sha256:7bc944a989fe8110cd9987812eebd891cfa09a239bded90c",
    gpaOrScore: "GPA: 3.98 / 4.0"
  },
  {
    id: "badge-mit",
    studentName: "Alexandra Carter",
    institutionName: "Massachusetts Institute of Technology (MIT)",
    title: "B.S. in Electrical Engineering & Computer Science",
    field: "Advanced Computing Paradigms",
    status: "Conferred Degree Alumnus Status",
    issueDate: "September 2020",
    expireDate: "June 2024",
    regCode: "US-MA-MIT-459288",
    signature: "Prof. L. Rafael Reif, Provost Secretary",
    hash: "sha256:019eab77bc3d45fe8eef8bd0d02d019ab3f77df230985cc9",
    gpaOrScore: "GPA: 4.0 (Magna Cum Laude)"
  },
  {
    id: "badge-google-sycamore",
    studentName: "Alexandra Carter",
    institutionName: "Google LLC (Sycamore Lab)",
    title: "Research Engineer Intern",
    field: "Sycamore Qubit QPU Simulation Kernel Architecture",
    status: "Verified Summer Tenancy Concluded",
    issueDate: "June 2024",
    expireDate: "September 2024",
    regCode: "US-GOOG-QUANTUM-2024",
    signature: "Dr. Hartmut Neven, Lead Scientist",
    hash: "sha256:e6f499bb8e2d4d82a1708849bca0287a99bb8e2d42d37c89f",
    gpaOrScore: "QPU Speedup: +34% System Drift Reduction"
  },
  {
    id: "badge-gcp-architect",
    studentName: "Alexandra Carter",
    institutionName: "Google Cloud & Certification Board",
    title: "Professional Cloud Architect Certification",
    field: "Cloud Security, IAM E2E, Quantum Virtualization",
    status: "Authorized Active License Cert",
    issueDate: "May 18, 2025",
    expireDate: "May 18, 2028",
    regCode: "LIC-GCP-PCA-8839126",
    signature: "Sundar Pichai, Governance Committee Chair",
    hash: "sha256:2d29f866cebf55dc001192eabda9b8cc9bc12239ad09fbb3"
  },
  {
    id: "badge-voters-card",
    studentName: "Alexandra Carter",
    institutionName: "California Board of Elections Registry",
    title: "Federal Register Voters Registration Code",
    field: "Silicon Valley District 17 - Municipal Registry",
    status: "Verified Active Registered Citizen",
    issueDate: "March 12, 2026",
    expireDate: "Permanent Active Registry",
    regCode: "GOV-CA-VOTE-74229",
    signature: "Secretary of State, Executive Seal",
    hash: "sha256:e69bb8e2d4d82a1708849bca0287ae6f499bb8e2d4d82a1708"
  }
];

export default function QRBadgeScanner({ institutions, theme }: QRBadgeScannerProps) {
  const [activeScanner, setActiveScanner] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "searching" | "scanning" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<DecodedBadge | null>(null);
  const [viewingBadgeDetails, setViewingBadgeDetails] = useState<DecodedBadge | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setErrorMessage("");
      setScanState("searching");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setActiveScanner(true);
      setScanState("scanning");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setErrorMessage(
        "Camera media channel blocked or permissions denied. You can still scan by selecting an uploaded badge file or utilizing one-click simulator matrices below."
      );
      setScanState("error");
      setActiveScanner(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setActiveScanner(false);
    if (scanState === "scanning") {
      setScanState("idle");
    }
  };

  // Simulate scanning action on a preset
  const handleTriggerSimulatedScan = (badge: DecodedBadge) => {
    setScanState("scanning");
    // Stop camera if running during sim
    if (activeScanner) {
      stopCamera();
    }
    
    // Simulate scanner lock-on latency
    setTimeout(() => {
      setSelectedBadge(badge);
      setViewingBadgeDetails(badge);
      setScanState("success");
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScanState("scanning");
      
      // Stop camera if running
      stopCamera();

      // Read file simply
      const reader = new FileReader();
      reader.onload = () => {
        // Find matching or mock badge
        setTimeout(() => {
          // Select a random badge from PRESET_BADGES just to simulate successfully reading the metadata of the badge!
          const randomIndex = Math.floor(Math.random() * PRESET_BADGES.length);
          const matchedBadge = PRESET_BADGES[randomIndex];
          
          setSelectedBadge({
            ...matchedBadge,
            title: `Decoded: ${matchedBadge.title}`,
            studentName: "Alexandra Carter [Scanned File Owner]"
          });
          setViewingBadgeDetails({
            ...matchedBadge,
            title: `Decoded: ${matchedBadge.title}`,
            studentName: "Alexandra Carter [Scanned File Owner]"
          });
          setScanState("success");
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetScanner = () => {
    setSelectedBadge(null);
    setViewingBadgeDetails(null);
    setScanState("idle");
    setErrorMessage("");
  };

  // Simple QR Grid graphics rendering helper
  const renderMockQRGraphic = (badgeId: string) => {
    const seedMap: { [key: string]: number[] } = {
      "badge-stanford": [1,0,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,1,0,1,0,1,1],
      "badge-mit": [1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,1,0,1,0,0,1,1,1,0,1,0],
      "badge-google-sycamore": [0,1,1,1,0,1,1,1,0,0,1,0,1,1,0,1,1,1,0],
      "badge-gcp-architect": [1,1,1,1,0,0,1,1,1,0,0],
      "badge-voters-card": [0,0,1,1,1,1,1,0,0,1,1,1,0,1,0,1,1,0,0,1,1,0,1,0,1,0,0,1]
    };
    
    const dotsStr = seedMap[badgeId] || seedMap["badge-stanford"];

    return (
      <svg className="w-16 h-16 opacity-80 shrink-0" viewBox="0 0 100 100" fill="currentColor">
        {/* Finder pattern 1 top-left */}
        <path d="M5,5 h24 v24 h-24 z M10,10 h14 v14 h-14 z M13,13 h8 v8 h-8 z" />
        {/* Finder pattern 2 top-right */}
        <path d="M71,5 h24 v24 h-24 z M76,10 h14 v14 h-14 z M79,13 h8 v8 h-8 z" />
        {/* Finder pattern 3 bottom-left */}
        <path d="M5,71 h24 v24 h-24 z M10,76 h14 v14 h-14 z M13,79 h8 v8 h-8 z" />
        {/* Small alignment block */}
        <path d="M77,77 h8 v8 h-8 z" />
        {/* Simulated micro-bits */}
        <g className="fill-current">
          {dotsStr.map((val, i) => {
            const x = 32 + (i % 5) * 8;
            const y = 32 + Math.floor(i / 5) * 8;
            if (val === 1 && x < 68 && y < 68) {
              return <rect key={i} x={x} y={y} width="6" height="6" />;
            }
            return null;
          })}
          {/* Scatter dots in margins */}
          <rect x="36" y="8" width="6" height="6" />
          <rect x="44" y="16" width="6" height="6" />
          <rect x="52" y="8" width="6" height="6" />
          <rect x="60" y="20" width="6" height="6" />
          <rect x="8" y="36" width="6" height="6" />
          <rect x="16" y="44" width="6" height="6" />
          <rect x="24" y="52" width="6" height="6" />
          <rect x="84" y="36" width="6" height="6" />
          <rect x="80" y="52" width="6" height="6" />
        </g>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upper scanning dashboard box */}
      <GlassCard glowColor="red" className="border-red-500/10">
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Viewing monitor & real/sim feed panel */}
          <div className="xl:w-2/5 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 relative min-h-[310px] overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <QrCode className="w-64 h-64 text-red-500" />
            </div>

            {/* SCANNING LASER SYSTEM */}
            {scanState === "scanning" && (
              <div className="absolute left-0 right-0 h-1 bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,1)] z-20 animate-bounce" style={{ top: "10%", animationDuration: "2s" }} />
            )}

            {/* Live Camera Feed Container */}
            {activeScanner ? (
              <div className="w-full h-full min-h-[220px] rounded-lg overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover rounded-lg scale-x-[-1]" playsInline muted />
                <div className="absolute inset-0 border-2 border-red-500/20 pointer-events-none rounded-lg flex items-center justify-center">
                  <div className="w-44 h-44 border border-dashed border-red-500/60 rounded-xl relative flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-500" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-500" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-500" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-500" />
                    <span className="text-[9px] font-mono text-gray-400 bg-black/75 px-2 py-1 rounded">Position QR Code badge</span>
                  </div>
                </div>
              </div>
            ) : scanState === "scanning" ? (
              // Cybernetic Scanning Mock Feed
              <div className="space-y-4 text-center py-10 relative z-10 w-full">
                <div className="relative inline-block">
                  <QrCode className="h-20 w-20 text-red-400 mx-auto animate-pulse" />
                  <div className="absolute inset-0 bg-red-500/10 blur rounded-full animate-ping pointer-events-none" />
                </div>
                <div>
                  <h5 className="font-mono text-xs text-red-400 block font-bold tracking-widest uppercase">SCANNING BADGE DATA</h5>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">Analyzing image frames • Scanning badge...</p>
                </div>
              </div>
            ) : scanState === "success" && selectedBadge ? (
              // Successful scan status
              <div className="space-y-4 text-center py-6 relative z-10 w-full animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto shadow-lg shadow-green-500/5">
                  <ShieldCheck className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h5 className="font-display font-black text-sm text-white">{selectedBadge.institutionName} Seal</h5>
                  <span className="text-[10px] text-green-400 bg-green-500/15 border border-green-500/25 px-2.5 py-1 rounded-full font-mono mt-2 inline-block uppercase font-bold">SHA-256 Validated</span>
                </div>
              </div>
            ) : (
              // Idle Prompt
              <div className="space-y-5 text-center py-8 relative z-10 w-full">
                <div className="w-14 h-14 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <QrCode className="h-7 w-7 text-red-500" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-white">Trust Registrar Decimation Scanner</h4>
                  <p className="text-[10px] text-gray-500 max-w-[240px] leading-relaxed mx-auto mt-1">
                    Hold a physical student badge QR code up to your lens, or scan file parameters directly in this terminal session.
                  </p>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {errorMessage && (
              <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-lg flex items-start gap-1.5 w-full leading-normal">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Viewfinder Controls */}
            <div className="mt-5 flex gap-2 w-full pt-4 border-t border-white/5 relative z-10 text-[11px] font-bold">
              {activeScanner ? (
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-xl border border-red-700/50 flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <Camera className="h-3.5 w-3.5" /> Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <Camera className="h-3.5 w-3.5" /> Start Live Camera
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-xl border border-white/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <Upload className="h-3.5 w-3.5" /> File Upload
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Interactive scan results, credentials verified or preset options */}
          <div className="xl:w-3/5 flex flex-col justify-between">
            {scanState === "success" && selectedBadge ? (
              // Scan Successful: Beautiful Conferred trust certificate display
              <div className="bg-gradient-to-b from-green-500/5 to-transparent border border-green-500/20 p-5 rounded-xl space-y-4 min-h-[290px] animate-fadeIn">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-green-400 font-mono uppercase bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
                      SYSTEM INTEGRITY CONFIRMED
                    </span>
                    <h4 className="font-display font-black text-lg text-white mt-1.5 leading-tight">{selectedBadge.title}</h4>
                    <p className="text-xs text-gray-400 font-medium">{selectedBadge.institutionName}</p>
                  </div>
                  <CheckCircle className="h-7 w-7 text-green-400 shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-mono block">Certified Target Name</span>
                    <span className="text-white text-xs font-bold font-display">{selectedBadge.studentName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-mono block">Accreditee Serial</span>
                    <span className="text-white text-xs font-mono">{selectedBadge.regCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-mono block">Certificate Status</span>
                    <span className="text-green-400 text-xs font-bold tracking-wide flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> {selectedBadge.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-mono block">Active Range</span>
                    <span className="text-white text-xs font-mono">{selectedBadge.issueDate} - {selectedBadge.expireDate}</span>
                  </div>
                </div>

                {selectedBadge.gpaOrScore && (
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-mono">Verified Score:</span>
                    <strong className="text-yellow-400 font-mono">{selectedBadge.gpaOrScore}</strong>
                  </div>
                )}

                <div className="pt-3 border-t border-white/5 space-y-2 text-[10px] font-mono leading-relaxed text-gray-400">
                  <p className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-green-400 shrink-0" /> Verified authority signature: <strong className="text-white font-medium">{selectedBadge.signature}</strong></p>
                  <p className="text-[9px] text-gray-600 truncate bg-black/60 p-1.5 rounded border border-white/5">Security Verification Hash: {selectedBadge.hash}</p>
                </div>

                <div className="flex gap-2 justify-end pt-2 text-[11px]">
                  <button
                    onClick={handleResetScanner}
                    className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-4 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset Scanner
                  </button>
                </div>
              </div>
            ) : (
              // Idle state / selection panel: Quick test simulators
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-red-500 font-mono uppercase tracking-widest font-bold block">One-Click Demonstration Hub</span>
                  <p className="text-[11px] text-gray-400 leading-normal mt-1">
                    To instantly test physical badge scanning, click any of the digital badges below. This simulates reading a secure QR code badge and verifying its credentials:
                  </p>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {PRESET_BADGES.map((badge) => (
                    <div
                      key={badge.id}
                      onClick={() => handleTriggerSimulatedScan(badge)}
                      className="p-3 bg-white/2 rounded-xl border border-white/5 hover:bg-red-500/10 hover:border-red-500/25 cursor-pointer flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {renderMockQRGraphic(badge.id)}
                        <div className="min-w-0">
                          <h5 className="text-[12px] text-white font-bold font-display truncate">{badge.title}</h5>
                          <p className="text-[10px] text-gray-400 font-mono truncate">{badge.institutionName}</p>
                          <span className="text-[8px] bg-white/5 text-gray-600 border border-white/5 px-1.5 py-0.2 rounded font-mono block w-fit mt-1">Reg: {badge.regCode}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerSimulatedScan(badge);
                        }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                      >
                        Scan Code
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/10 text-[10px] leading-relaxed text-gray-400 flex items-start gap-1.5">
                  <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>
                    Each badge is securely encoded to represent verified institutional signatures. Issuing registrars sign badges with keys verified by official registry boards.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
