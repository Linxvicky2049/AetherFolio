import React, { useState, useEffect, useRef } from "react";
import { 
  Globe, Compass, Shield, Activity, Maximize2, Minimize2, Sparkles, 
  Settings, Database, CheckCircle2, LayoutGrid, Layers, Info, HelpCircle
} from "lucide-react";
import GlassCard from "./GlassCard";

// Exporting SVG-based high-graphic credential ledger symbols for modular 3D and graphic divider usage
export const LedgerShield = ({ className = "w-6 h-6 text-cyan-400" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="50" cy="50" r="45" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite] opacity-65" />
    <polygon points="50,15 85,28 85,62 50,88 15,62 15,28" className="opacity-80" />
    <circle cx="50" cy="50" r="6" fill="currentColor" className="animate-pulse" />
  </svg>
);

export const LedgerConsensus = ({ className = "w-6 h-6 text-orange-400" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="50" cy="50" r="42" className="opacity-40" />
    <polygon points="50,22 78,50 50,78 22,50" className="opacity-70" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <circle cx="50" cy="22" r="3" fill="currentColor" />
    <circle cx="78" cy="50" r="3" fill="currentColor" />
    <circle cx="50" cy="78" r="3" fill="currentColor" />
    <circle cx="22" cy="50" r="3" fill="currentColor" />
  </svg>
);

export const LedgerProof = ({ className = "w-6 h-6 text-green-400" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="25" y="25" width="50" height="50" rx="10" strokeDasharray="3 3" className="animate-[spin_20s_linear_infinite]" />
    <path d="M 50,15 L 50,85" strokeWidth="3" />
    <circle cx="50" cy="25" r="4" fill="currentColor" />
    <circle cx="50" cy="75" r="4" fill="currentColor" />
  </svg>
);

export interface GeoNode {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  info: string;
  meta: string;
  verificationHash: string;
  type: "academic" | "research" | "enterprise";
  ledgerTag: "shield" | "multi-sig" | "zk-proof";
}

const PRESET_GEONODES: GeoNode[] = [
  {
    id: "geo-stanford",
    name: "Stanford CS Core",
    location: "Stanford, Silicon Valley",
    latitude: 37.4275,
    longitude: -122.1697,
    info: "M.S. Computer Science • GPA 3.98",
    meta: "Quantum Neural Overlays & Computer Vision Core",
    verificationHash: "SHA-256 e6f499bb8e...c2e34fa1",
    type: "academic",
    ledgerTag: "shield"
  },
  {
    id: "geo-mit",
    name: "MIT Advanced Paradigms",
    location: "Boston, Massachusetts",
    latitude: 42.3601,
    longitude: -71.0942,
    info: "B.S. Electrical Engineering & CS • GPA 4.0",
    meta: "Sycamore Qubit Simulations & CUDA State Vectors",
    verificationHash: "SHA-256 c3a4f89d81...450f68d",
    type: "academic",
    ledgerTag: "zk-proof"
  },
  {
    id: "geo-google",
    name: "Google Quantum AI Lab",
    location: "Santa Barbara, California",
    latitude: 34.4208,
    longitude: -119.6982,
    info: "Research Intern Sycamore",
    meta: "CUDA Simulation Drift Reduction by 34%",
    verificationHash: "SHA-256 2d29f866ce...bda9b8cc",
    type: "research",
    ledgerTag: "multi-sig"
  },
  {
    id: "geo-openai",
    name: "OpenAI Research",
    location: "San Francisco, California",
    latitude: 37.7615,
    longitude: -122.4132,
    info: "Quantum Alignment Graduate Assistant",
    meta: "Reinforcement Protocols for High-Dimensional Models",
    verificationHash: "SHA-256 aef3d8aa7e...9bc12239",
    type: "enterprise",
    ledgerTag: "shield"
  },
  {
    id: "geo-cern",
    name: "CERN Quantum Relays",
    location: "Geneva, Switzerland",
    latitude: 46.2044,
    longitude: 6.1432,
    info: "Secondary Synchronization Node",
    meta: "Decentralized consensus L2 security proving network",
    verificationHash: "SHA-256 f1f358df9a...eef388f8",
    type: "research",
    ledgerTag: "zk-proof"
  }
];

type GeoMode = "holo-geoid" | "vector-mesh" | "topo-constellation" | "temporal-ring";

export default function GeoDimensionalCanvas() {
  const [geoMode, setGeoMode] = useState<GeoMode>("holo-geoid");
  const [selectedNode, setSelectedNode] = useState<GeoNode | null>(PRESET_GEONODES[0]);
  const [atmosphereAura, setAtmosphereAura] = useState<boolean>(true);
  const [showScannerRings, setShowScannerRings] = useState<boolean>(true);
  const [gridDensity, setGridDensity] = useState<"high" | "med" | "low">("med");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Canvas Refs & 3D Math Coordinates
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.2);
  const [pitch, setPitch] = useState<number>(0.2); // pitch rotation angle
  const [yaw, setYaw] = useState<number>(-0.8);   // yaw rotation angle
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Custom Physics state for "vector-mesh" gravity wells or particles
  const mouseCanvasPos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const pulseScale = useRef<number>(1.0);
  const pulseDir = useRef<number>(1);

  // Read secure ledger technical explanations on hover
  const getLedgerExplanation = (tag: "shield" | "multi-sig" | "zk-proof") => {
    switch (tag) {
      case "shield":
        return "Host Vault Shield (SHLD): Signifies secure local device storage, biometric parameter isolation, and client-side credential lock.";
      case "multi-sig":
        return "Consensus Multi-Sig Bridge (MSIG): Represents distributed multisignature consensus protocols, federated validation peers, and network sync channels.";
      case "zk-proof":
        return "Zero-Knowledge Verification Oracle (ZKPF): Represents zero-knowledge cryptographic provers, math-grounded verification nodes, and hash chain anchors.";
    }
  };

  // Drag-to-Rotate mouse listeners
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseCanvasPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    if (!isDragging.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    setYaw(prev => prev + deltaX * 0.007);
    setPitch(prev => Math.max(-1.4, Math.min(1.4, prev + deltaY * 0.007)));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    mouseCanvasPos.current = { x: -1000, y: -1000 };
  };

  // Coordinate Conversion function (Spherical Coordinates -> Projected 3D)
  const sphereToCartesian = (latitude: number, longitude: number, radius: number) => {
    const latRad = (latitude * Math.PI) / 180;
    const lonRad = (longitude * Math.PI) / 180;

    // Standard geographic alignment
    const x = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lonRad);

    return { x, y, z };
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Handle High DPI displays
      const dpr = window.devicePixelRatio || 1;
      if (canvas.style.width !== `${width / dpr}px`) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const viewW = canvas.width / dpr;
      const viewH = canvas.height / dpr;

      // Pulse scaling helper
      pulseScale.current += pulseDir.current * 0.008;
      if (pulseScale.current > 1.25) pulseDir.current = -1;
      if (pulseScale.current < 0.95) pulseDir.current = 1;

      // Clear with elegant dark cyber background
      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, viewW, viewH);

      // Radial glowing background matrix
      const gradBg = ctx.createRadialGradient(viewW / 2, viewH / 2, 10, viewW / 2, viewH / 2, Math.max(viewW, viewH) * 0.7);
      gradBg.addColorStop(0, "rgba(0, 77, 197, 0.08)");
      gradBg.addColorStop(0.5, "rgba(10, 10, 12, 0)");
      gradBg.addColorStop(1, "rgba(0, 240, 255, 0.02)");
      ctx.fillStyle = gradBg;
      ctx.fillRect(0, 0, viewW, viewH);

      // Basic projection settings
      const radius = Math.min(viewW, viewH) * 0.32 * zoom;
      const fov = 400; // perspective FOV factor
      const centerX = viewW / 2;
      const centerY = viewH / 2;

      // 3D rotation matrix operations based on Pitch / Yaw
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      const project3D = (x: number, y: number, z: number) => {
        // Rotate around Y-axis (Yaw)
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate around X-axis (Pitch)
        let y2 = y * cosP - z1 * sinP;
        let z2 = y * sinP + z1 * cosP;

        // Perspective depth translation
        const scale = fov / (fov + z2);
        const px = x1 * scale + centerX;
        const py = y2 * scale + centerY;

        return { px, py, scale, zDepth: z2 };
      };

      // ==========================================
      // DRAW DECORATIVE ATMOSPHERE/AURA RINGS (Holographic Globe Feel)
      // ==========================================
      if (atmosphereAura && geoMode === "holo-geoid") {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 102, 0, 0.04)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing outer shield
        const radialShield = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.1);
        radialShield.addColorStop(0, "rgba(0, 240, 255, 0)");
        radialShield.addColorStop(0.8, "rgba(0, 240, 255, 0.04)");
        radialShield.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = radialShield;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // ==========================================
      // MODE: HOLOGRAPHIC GEOID WIREFRAME SPHERE
      // ==========================================
      if (geoMode === "holo-geoid") {
        const ringsCount = gridDensity === "high" ? 18 : gridDensity === "med" ? 12 : 6;
        const stepsCount = gridDensity === "high" ? 36 : gridDensity === "med" ? 24 : 12;

        // 1. Draw Latitudinal rings (parallels)
        for (let i = 1; i < ringsCount; i++) {
          const latAngle = -Math.PI / 2 + (Math.PI * i) / ringsCount;
          const latRadius = radius * Math.cos(latAngle);
          const latY = radius * Math.sin(latAngle);

          ctx.beginPath();
          let firstProj = null;

          for (let j = 0; j <= stepsCount; j++) {
            const lonAngle = (Math.PI * 2 * j) / stepsCount;
            const x = latRadius * Math.sin(lonAngle);
            const z = latRadius * Math.cos(lonAngle);

            const proj = project3D(x, latY, z);
            
            // Back face dimmer line opacity
            const opacity = proj.zDepth > 0 ? 0.04 : 0.18;
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 0.8;

            if (j === 0) {
              ctx.moveTo(proj.px, proj.py);
              firstProj = proj;
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
          ctx.stroke();
        }

        // 2. Draw Longitudinal rings (meridians)
        for (let i = 0; i < stepsCount / 2; i++) {
          const lonAngle = (Math.PI * 2 * i) / stepsCount;

          ctx.beginPath();
          for (let j = 0; j <= stepsCount; j++) {
            const latAngle = -Math.PI / 2 + (Math.PI * j) / stepsCount;
            const y = radius * Math.sin(latAngle);
            const rLat = radius * Math.cos(latAngle);

            const x = rLat * Math.sin(lonAngle);
            const z = rLat * Math.cos(lonAngle);

            const proj = project3D(x, y, z);
            const opacity = proj.zDepth > 0 ? 0.04 : 0.18;
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;

            if (j === 0) {
              ctx.moveTo(proj.px, proj.py);
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
          ctx.stroke();
        }
      }

      // ==========================================
      // MODE: GRAVITATIONAL VECTOR FIELD MOUSE DEFORMATION
      // ==========================================
      if (geoMode === "vector-mesh") {
        const divisions = gridDensity === "high" ? 22 : gridDensity === "med" ? 16 : 10;
        const widthHalf = viewW / 2;
        const heightHalf = viewH / 2;
        ctx.lineWidth = 0.8;

        // Render layered mathematical waves deforming based on virtual gravity coordinates
        for (let xIdx = -divisions; xIdx <= divisions; xIdx++) {
          ctx.beginPath();
          for (let yIdx = -divisions; yIdx <= divisions; yIdx++) {
            // Unprojected standard grid point
            let gx = (xIdx / divisions) * radius * 1.3;
            let gy = 0;
            let gz = (yIdx / divisions) * radius * 1.3;

            // Apply procedural continuous waving ripple
            const distCenter = Math.sqrt(gx * gx + gz * gz);
            gy = Math.sin(distCenter * 0.03 - Date.now() * 0.003) * 15;

            // Apply mouse gravity warp proximity pull
            if (mouseCanvasPos.current.x !== -1000) {
              const projBase = project3D(gx, gy, gz);
              const dx = mouseCanvasPos.current.x - projBase.px;
              const dy = mouseCanvasPos.current.y - projBase.py;
              const dMouse = Math.sqrt(dx * dx + dy * dy);
              if (dMouse < 180) {
                // Pull down based on inverse distance well
                const pullPower = (180 - dMouse) * 0.45;
                gy += pullPower;
              }
            }

            const proj = project3D(gx, gy, gz);
            ctx.strokeStyle = `rgba(255, 102, 0, ${proj.zDepth > 0 ? 0.05 : 0.22})`;

            if (yIdx === -divisions) {
              ctx.moveTo(proj.px, proj.py);
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
          ctx.stroke();
        }

        // Cross connects
        for (let yIdx = -divisions; yIdx <= divisions; yIdx++) {
          ctx.beginPath();
          for (let xIdx = -divisions; xIdx <= divisions; xIdx++) {
            let gx = (xIdx / divisions) * radius * 1.3;
            let gy = 0;
            let gz = (yIdx / divisions) * radius * 1.3;

            const distCenter = Math.sqrt(gx * gx + gz * gz);
            gy = Math.sin(distCenter * 0.03 - Date.now() * 0.003) * 15;

            if (mouseCanvasPos.current.x !== -1000) {
              const projBase = project3D(gx, gy, gz);
              const dx = mouseCanvasPos.current.x - projBase.px;
              const dy = mouseCanvasPos.current.y - projBase.py;
              const dMouse = Math.sqrt(dx * dx + dy * dy);
              if (dMouse < 180) {
                const pullPower = (180 - dMouse) * 0.45;
                gy += pullPower;
              }
            }

            const proj = project3D(gx, gy, gz);
            ctx.strokeStyle = `rgba(255, 102, 0, ${proj.zDepth > 0 ? 0.05 : 0.22})`;

            if (xIdx === -divisions) {
              ctx.moveTo(proj.px, proj.py);
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
          ctx.stroke();
        }
      }

      // ==========================================
      // MODE: TOPOGRAPHIC CONSTELLATION & PEAKS
      // ==========================================
      if (geoMode === "topo-constellation") {
        // Draw topographical concentric coordinate pathings on floor plane
        const layerCount = 7;
        ctx.lineWidth = 0.5;
        for (let l = 1; l <= layerCount; l++) {
          const lRadius = radius * (l / layerCount) * 1.4;
          ctx.beginPath();
          for (let th = 0; th <= Math.PI * 2 + 0.1; th += 0.15) {
            // Adding dynamic topological height modulation
            const heightPulse = Math.sin(th * 4 + Date.now() * 0.002) * 5 * (l / layerCount);
            const gx = lRadius * Math.cos(th);
            const gy = -10 * (layerCount - l) + heightPulse;
            const gz = lRadius * Math.sin(th);

            const proj = project3D(gx, gy, gz);
            ctx.strokeStyle = `rgba(163, 230, 53, ${proj.zDepth > 0 ? 0.04 : 0.18})`;
            if (th === 0) {
              ctx.moveTo(proj.px, proj.py);
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
          ctx.stroke();
        }
      }

      // ==========================================
      // MODE: QUANTUM TEMPORAL RINGS
      // ==========================================
      if (geoMode === "temporal-ring") {
        ctx.lineWidth = 1;
        // Two concentric tilted rings rotating
        const rings = [
          { r: radius * 0.7, color: "rgba(0, 240, 255, 0.25)", speed: 0.001 },
          { r: radius * 1.1, color: "rgba(255, 102, 0, 0.2)", speed: -0.0015 },
          { r: radius * 1.4, color: "rgba(163, 230, 53, 0.15)", speed: 0.0008 }
        ];

        rings.forEach((rng, rIdx) => {
          ctx.beginPath();
          const tOffset = Date.now() * rng.speed;
          for (let th = 0; th <= Math.PI * 2; th += 0.08) {
            // Tilted plane projection
            const gx = rng.r * Math.cos(th + tOffset);
            const gy = rng.r * 0.3 * Math.sin(th + tOffset);
            const gz = rng.r * Math.sin(th + tOffset);

            const proj = project3D(gx, gy, gz);
            ctx.strokeStyle = rIdx === 0 ? `rgba(0, 240, 255, ${proj.zDepth > 0 ? 0.06 : 0.25})` : rng.color;
            if (th === 0) {
              ctx.moveTo(proj.px, proj.py);
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
          ctx.stroke();
        });
      }

      // ==========================================
      // DRAW SHINING 3D GEOGRAPHIC NODES / SITES
      // ==========================================
      let hoveredNodeThisFrame: GeoNode | null = null;
      let hoveredNodeCoords: { px: number; py: number } | null = null;

      PRESET_GEONODES.forEach((node) => {
        let gx = 0, gy = 0, gz = 0;

        if (geoMode === "holo-geoid") {
          // Absolute sphere projection based on actual coordinates
          const xyz = sphereToCartesian(node.latitude, node.longitude, radius);
          gx = xyz.x;
          gy = xyz.y;
          gz = xyz.z;
        } else if (geoMode === "vector-mesh") {
          // Grid slice alignment for nodes
          const hashVal = Math.abs(node.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
          const gridX = ((hashVal % 11) - 5) / 5;
          const gridZ = (((hashVal * 3) % 11) - 5) / 5;
          gx = gridX * radius * 1.1;
          gz = gridZ * radius * 1.1;
          const distCenter = Math.sqrt(gx * gx + gz * gz);
          gy = Math.sin(distCenter * 0.03 - Date.now() * 0.003) * 15;
        } else if (geoMode === "topo-constellation") {
          // Place nodes on peak heights based on coordinates values
          const rScalar = 1.0 - (node.latitude % 10) / 20;
          const th = (node.longitude % 360) * Math.PI / 180;
          gx = radius * rScalar * Math.cos(th) * 1.3;
          gz = radius * rScalar * Math.sin(th) * 1.3;
          gy = -50 + (node.latitude % 3) * 20; // elevated peak
        } else if (geoMode === "temporal-ring") {
          // Satellites orbiting in chronological temporal sequence
          const idx = PRESET_GEONODES.indexOf(node);
          const rPreset = radius * (0.7 + idx * 0.25);
          const thOrbit = (Date.now() * (0.001 - idx * 0.00015));
          gx = rPreset * Math.cos(thOrbit);
          gy = rPreset * 0.3 * Math.sin(thOrbit);
          gz = rPreset * Math.sin(thOrbit);
        }

        const proj = project3D(gx, gy, gz);

        // Check distance to mouse to see if user is hovering
        if (mouseCanvasPos.current.x !== -1000) {
          const dx = mouseCanvasPos.current.x - proj.px;
          const dy = mouseCanvasPos.current.y - proj.py;
          const dNodes = Math.sqrt(dx * dx + dy * dy);
          if (dNodes < 14) {
            hoveredNodeThisFrame = node;
            hoveredNodeCoords = { px: proj.px, py: proj.py };
          }
        }

        const isSelected = selectedNode?.id === node.id;
        const color = node.ledgerTag === "shield" ? "#00f0ff" : node.ledgerTag === "multi-sig" ? "#ff6600" : "#a3e635";

        // Draw connections lines back to center or constellation strings
        if (geoMode === "topo-constellation") {
          ctx.strokeStyle = "rgba(163, 230, 53, 0.05)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(proj.px, proj.py);
          ctx.lineTo(centerX, centerY + 100);
          ctx.stroke();
        }

        // Draw node 3D glowing point
        ctx.fillStyle = color;
        ctx.shadowBlur = isSelected ? 15 : 6;
        ctx.shadowColor = color;
        
        ctx.beginPath();
        // Inner core size pulsing subtly
        const targetRadius = isSelected ? 6 * pulseScale.current : 4.5;
        ctx.arc(proj.px, proj.py, targetRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // 3D Outer Pulsing Orbit Ring for nodes
        ctx.strokeStyle = color;
        ctx.lineWidth = isSelected ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, targetRadius * (isSelected ? 2.5 : 1.8), 0, Math.PI * 2);
        ctx.stroke();

        // Node static labels in spatial map
        ctx.fillStyle = "rgba(255,255,255, 0.75)";
        ctx.font = "bold 9px monospace";
        ctx.fillText(node.name, proj.px + 12, proj.py - 2);
      });

      // Handle hover trigger node change to prevent massive re-renders
      if (hoveredNodeThisFrame && selectedNode?.id !== (hoveredNodeThisFrame as GeoNode).id) {
        setSelectedNode(hoveredNodeThisFrame);
      }

      // ==========================================
      // DYNAMIC RADAR/HUD SCANNER SWEEP LINES
      // ==========================================
      if (showScannerRings) {
        const radSweepY = centerY + Math.sin(Date.now() * 0.002) * (radius * 1.15);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - radius * 1.25, radSweepY);
        ctx.lineTo(centerX + radius * 1.25, radSweepY);
        ctx.stroke();

        // Little scanning HUD side tags
        ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
        ctx.font = "8px monospace";
        ctx.fillText("HOLOGRAPHIC SCANNER SWEEP", centerX - radius * 1.25, radSweepY - 4);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [geoMode, zoom, pitch, yaw, atmosphereAura, showScannerRings, gridDensity, selectedNode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* LEFT COLUMN: Controls & Holographic Settings overlay */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-4">
        
        {/* Spatial control hub */}
        <div className="bg-sleek-black/80 rounded-2xl border border-white/5 p-4 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Settings className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            <h4 className="font-display font-medium text-white text-sm uppercase tracking-wider">
              Geo-Dimensional Grid
            </h4>
          </div>

          {/* Mode switch controllers */}
          <div className="space-y-2">
            <span className="text-[10px] text-gray-400 font-mono block uppercase">Visualization Modality</span>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
              
              <button
                onClick={() => setGeoMode("holo-geoid")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                  geoMode === "holo-geoid" 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold" 
                    : "bg-white/2 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Globe className="h-3.5 w-3.5" /> geoid Core
              </button>

              <button
                onClick={() => setGeoMode("vector-mesh")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                  geoMode === "vector-mesh" 
                    ? "bg-orange-500/10 text-orange-400 border-orange-500/30 font-bold" 
                    : "bg-white/2 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Compass className="h-3.5 w-3.5" /> Gravity Well
              </button>

              <button
                onClick={() => setGeoMode("topo-constellation")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                  geoMode === "topo-constellation" 
                    ? "bg-lime-500/10 text-lime-400 border-lime-500/30 font-bold" 
                    : "bg-white/2 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Constellation
              </button>

              <button
                onClick={() => setGeoMode("temporal-ring")}
                className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                  geoMode === "temporal-ring" 
                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-300/30 font-bold" 
                    : "bg-white/2 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> Orbit Chronos
              </button>

            </div>
          </div>

          {/* Sizing & HUD Settings */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase mb-1">
                <span>Field Scale Zoom</span>
                <span>{(zoom * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.8"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2 border-t border-white/5 pt-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Aesthetic Overlays</span>
              
              <div className="flex flex-col gap-1 text-[11px] text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={atmosphereAura}
                    onChange={(e) => setAtmosphereAura(e.target.checked)}
                    className="rounded border-white/10 text-cyan-500 focus:ring-0 bg-black/40"
                  />
                  <span>Holographic Atmosphere Aura</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={showScannerRings}
                    onChange={(e) => setShowScannerRings(e.target.checked)}
                    className="rounded border-white/10 text-cyan-500 focus:ring-0 bg-black/40"
                  />
                  <span>Active HUD Radar sweeping</span>
                </label>
              </div>
            </div>

            {/* Mesh density switcher */}
            <div className="space-y-2 border-t border-white/5 pt-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Vector Grid Density</span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-center">
                {(["low", "med", "high"] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => setGridDensity(density)}
                    className={`p-1.5 rounded-lg border uppercase transition-all ${
                      gridDensity === density
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold"
                        : "bg-white/2 text-gray-500 border-white/5 hover:text-gray-300"
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Quantum Ledger Core Gateway */}
        <div className="bg-sleek-black/80 rounded-2xl border border-white/5 p-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Info className="h-4 w-4 text-cyan-400" />
            <h4 className="font-display font-medium text-white text-sm uppercase tracking-wider">
              Ledger Security Protocol Decoder
            </h4>
          </div>
          
          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed font-sans">
            Every academic node on this protocol anchors on key proof variables. These guarantee E2E system security, federated authority signature consensus, and zero-knowledge evidence auditing.
          </p>

          {/* Interactive icons to reveal meaning */}
          <div className="flex items-center justify-around gap-2 pt-3 mt-1">
            <button
              onMouseEnter={() => setActiveTooltip("shield")}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip("shield")}
              className={`p-2.5 rounded-xl border transition-all ${activeTooltip === "shield" ? "border-cyan-500 bg-cyan-500/10" : "border-white/5 hover:border-white/15 bg-white/2"}`}
            >
              <LedgerShield className="h-6 w-6 text-cyan-400" />
            </button>

            <button
              onMouseEnter={() => setActiveTooltip("multi-sig")}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip("multi-sig")}
              className={`p-2.5 rounded-xl border transition-all ${activeTooltip === "multi-sig" ? "border-orange-500 bg-orange-500/10" : "border-white/5 hover:border-white/15 bg-white/2"}`}
            >
              <LedgerConsensus className="h-6 w-6 text-orange-400" />
            </button>

            <button
              onMouseEnter={() => setActiveTooltip("zk-proof")}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip("zk-proof")}
              className={`p-2.5 rounded-xl border transition-all ${activeTooltip === "zk-proof" ? "border-green-500 bg-green-500/10" : "border-white/5 hover:border-white/15 bg-white/2"}`}
            >
              <LedgerProof className="h-6 w-6 text-green-400" />
            </button>
          </div>

          <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/5 min-h-[55px] flex items-center justify-center">
            {activeTooltip ? (
              <p className="text-[10px] text-gray-300 font-mono leading-tight">
                {getLedgerExplanation(activeTooltip as any)}
              </p>
            ) : (
              <p className="text-[10px] text-gray-500 font-mono text-center">
                Hover or click on the cryptographic primitives to decode their security parameter functions.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* CENTER & RIGHT COLUMNS Combined: Big 3D canvas viewport & scanning HUD (8 wide) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* 3D Canvas Card */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black flex flex-col items-stretch h-[480px]">
          
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#060608]/90 px-3 py-1.5 rounded-xl border border-cyan-500/20 font-mono text-[9px] text-[#00f0ff] uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            3D SPATIAL GRID: {geoMode}
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#060608]/95 px-3 py-1.5 rounded-xl border border-white/5 font-mono text-[9px] text-gray-400 backdrop-blur-md">
            <span>DRAG CAM ROTATE</span>
          </div>

          {/* Interactive HTML Canvas viewport */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="w-full grow cursor-grab active:cursor-grabbing outline-none"
            style={{ display: "block" }}
          />

          {/* Selected Node Telemetry details overlay */}
          {selectedNode ? (
            <div className="absolute bottom-4 inset-x-4 z-20 glass border-cyan-500/20 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-6">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-bold text-white uppercase bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                    {selectedNode.name}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400">
                    LAT {selectedNode.latitude.toFixed(4)}° / LNG {selectedNode.longitude.toFixed(4)}°
                  </span>
                  
                  {/* Miniature ledger protocol parameter tag display */}
                  <span className="flex items-center gap-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-orange-400">
                    LDR: {selectedNode.ledgerTag}
                  </span>
                </div>

                <h5 className="text-[12px] text-cyan-400 font-mono">
                  {selectedNode.info}
                </h5>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">
                  {selectedNode.meta}
                </p>
              </div>

              {/* Verified Badge */}
              <div className="flex flex-col items-end gap-1 font-mono shrink-0">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 py-1 px-2.5 rounded-lg">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  HASH SECURE
                </div>
                <span className="text-[8px] text-gray-500 tracking-wider truncate w-32 uppercase text-right">
                  {selectedNode.verificationHash}
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 inset-x-4 z-20 glass border-white/5 p-4 rounded-xl text-center">
              <p className="text-xs text-gray-400 font-mono">Hover over any coordinate point in the 3D space to trigger verification telemetry.</p>
            </div>
          )}
        </div>

        {/* Quick Node Navigator List */}
        <div className="bg-sleek-black/80 rounded-2xl border border-white/5 p-4 shadow-xl">
          <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider mb-2">
            Click to spotlight Node Dimension Zoom
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {PRESET_GEONODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const colorClass = node.ledgerTag === "shield" ? "border-cyan-500/35 text-cyan-400 bg-cyan-500/10" : node.ledgerTag === "multi-sig" ? "border-orange-500/35 text-orange-400 bg-orange-500/10" : "border-lime-500/35 text-lime-400 bg-lime-500/10";
              
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    // Reposition focus camera pitch & yaw for dramatic flare
                    if (node.id === "geo-stanford") { setYaw(-0.8); setPitch(0.2); }
                    if (node.id === "geo-mit") { setYaw(-0.3); setPitch(0.4); }
                    if (node.id === "geo-google") { setYaw(-0.95); setPitch(0.18); }
                    if (node.id === "geo-openai") { setYaw(-0.85); setPitch(0.25); }
                    if (node.id === "geo-cern") { setYaw(0.8); setPitch(0.15); }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? `${colorClass} shadow-lg scale-100 font-bold` 
                      : "bg-[#060608]/40 text-gray-400 border-white/5 hover:border-white/15 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold block truncate">{node.name}</span>
                    {node.ledgerTag === "shield" ? (
                      <LedgerShield className="h-3.5 w-3.5 opacity-80" />
                    ) : node.ledgerTag === "multi-sig" ? (
                      <LedgerConsensus className="h-3.5 w-3.5 opacity-80" />
                    ) : (
                      <LedgerProof className="h-3.5 w-3.5 opacity-80" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 block truncate mt-1">{node.location}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
