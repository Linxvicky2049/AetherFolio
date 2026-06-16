import React, { useState } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "orange" | "status" | "red" | "brown" | "none";
  id?: string;
  onHoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "none",
  id,
  onHoverEffect = true
}: GlassCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onHoverEffect) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 8 degrees
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const glowStyles = {
    blue: "shadow-[0_0_20px_rgba(0,77,197,0.25)] hover:shadow-[0_0_35px_rgba(0,77,197,0.45)]",
    orange: "shadow-[0_0_20px_rgba(255,102,0,0.25)] hover:shadow-[0_0_35px_rgba(255,102,0,0.45)]",
    red: "shadow-[0_0_20px_rgba(230,25,25,0.25)] hover:shadow-[0_0_35px_rgba(230,25,25,0.45)]",
    brown: "shadow-[0_0_20px_rgba(139,90,43,0.2)] hover:shadow-[0_0_35px_rgba(139,90,43,0.35)]",
    status: "",
    none: "shadow-2xl"
  };

  return (
    <div
      id={id}
      className={`glass rounded-2xl transition-all duration-300 relative overflow-hidden bg-sleek-black/40 border border-white/8 backdrop-blur-xl ${
        glowStyles[glowColor]
      } ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.01, 1.01, 1.01)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered ? "none" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare overlay element */}
      {isHovered && onHoverEffect && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 transition-opacity bg-gradient-to-tr from-transparent via-white to-transparent"
          style={{
            background: `radial-gradient(circle 200px at ${rotate.y * 20 + 50}% ${-rotate.x * 20 + 50}%, rgba(255,255,255,0.4) 0%, transparent 80%)`
          }}
        />
      )}
      
      {/* Dynamic reflective edge line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}
