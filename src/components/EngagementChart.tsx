import React, { useMemo, useState, useRef, useEffect } from "react";
import { TrendingUp, Award, Clock, Sparkles, Filter, Users } from "lucide-react";
import GlassCard from "./GlassCard";

interface EngagementChartProps {
  theme: "dark" | "light";
}

export default function EngagementChart({ theme }: EngagementChartProps) {
  // Generate a beautiful, stable 30-day tracking data dataset showing interest
  const trackingData = useMemo(() => {
    const data = [];
    const startDay = new Date();
    startDay.setDate(startDay.getDate() - 29);

    for (let i = 0; i < 30; i++) {
      const d = new Date(startDay);
      d.setDate(d.getDate() + i);
      const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const progressFactor = i / 30; 
      
      const viewsBase = 12 + Math.floor(progressFactor * 32); 
      const viewsRand = isWeekend ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 15);
      const views = viewsBase + viewsRand;

      const decryptBase = Math.floor(views * (0.15 + progressFactor * 0.1));
      const decryptRand = isWeekend ? 0 : Math.floor(Math.random() * 3);
      const decryptions = Math.max(0, decryptBase + decryptRand);

      data.push({
        day: dayLabel,
        views,
        decryptions,
      });
    }
    return data;
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const sumViews = trackingData.reduce((acc, curr) => acc + curr.views, 0);
    const sumDecrypts = trackingData.reduce((acc, curr) => acc + curr.decryptions, 0);
    const conversion = ((sumDecrypts / sumViews) * 100).toFixed(1);
    
    return {
      views: sumViews,
      decryptions: sumDecrypts,
      conversion: `${conversion}%`,
      averageDuration: "4m 18s"
    };
  }, [trackingData]);

  const isLight = theme === "light";

  // Colors
  const strokeViews = isLight ? "#1c1917" : "#ff6600"; // Deep Charcoal / Vibrant Orange
  const strokeDecrypts = isLight ? "#0f172a" : "#00f0ff"; // Slate Navy / Cyan Glow

  // Responsive state
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 230 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(200, width),
          height: Math.max(150, height),
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Margins
  const margins = { top: 25, right: 20, bottom: 25, left: 35 };
  const chartWidth = dimensions.width - margins.left - margins.right;
  const chartHeight = dimensions.height - margins.top - margins.bottom;

  // Compute scale limits
  const maxVal = useMemo(() => {
    const maxValFound = Math.max(...trackingData.map(d => Math.max(d.views, d.decryptions)));
    return Math.ceil(maxValFound * 1.15); // Add a 15% ceiling padding
  }, [trackingData]);

  // Points mapping
  const points = useMemo(() => {
    if (chartWidth <= 0 || chartHeight <= 0) return { views: [], decryptions: [] };
    
    const viewPoints = trackingData.map((d, index) => {
      const x = margins.left + (index / (trackingData.length - 1)) * chartWidth;
      const y = margins.top + chartHeight - (d.views / maxVal) * chartHeight;
      return { x, y, day: d.day, views: d.views, decryptions: d.decryptions, index };
    });

    const decryptPoints = trackingData.map((d, index) => {
      const x = margins.left + (index / (trackingData.length - 1)) * chartWidth;
      const y = margins.top + chartHeight - (d.decryptions / maxVal) * chartHeight;
      return { x, y, day: d.day, views: d.views, decryptions: d.decryptions, index };
    });

    return { views: viewPoints, decryptions: decryptPoints };
  }, [trackingData, chartWidth, chartHeight, maxVal]);

  // Hover state for interactive tooltips
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate nearest data point index
    const relativeX = x - margins.left;
    const pct = relativeX / chartWidth;
    const idx = Math.round(pct * (trackingData.length - 1));
    const boundedIdx = Math.max(0, Math.min(trackingData.length - 1, idx));

    setHoveredIdx(boundedIdx);

    // Calculate tooltip coordinates
    const tooltipX = margins.left + (boundedIdx / (trackingData.length - 1)) * chartWidth;
    setTooltipPos({
      x: tooltipX,
      y: Math.max(margins.top, Math.min(dimensions.height - margins.bottom, y - 25)),
    });
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
  };

  // Generate SVG path string from points list
  const getPathString = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  };

  // Generate area fill path string
  const getAreaPathString = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    const linePath = getPathString(pts);
    const bottomY = margins.top + chartHeight;
    return `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${bottomY.toFixed(1)} L ${pts[0].x.toFixed(1)} ${bottomY.toFixed(1)} Z`;
  };

  // Y-axis tick divisions (e.g. 4 steps)
  const yTicks = useMemo(() => {
    const ticks = [];
    const stepCount = 4;
    for (let i = 0; i <= stepCount; i++) {
      ticks.push(Math.round((maxVal / stepCount) * i));
    }
    return ticks;
  }, [maxVal]);

  // Selected data point for tooltip
  const activeDataPoint = hoveredIdx !== null ? trackingData[hoveredIdx] : null;

  return (
    <div className="space-y-4">
      {/* Statistics Cards Ribbon Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* STAT 1: VIEWS */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-sleek-black/40 border-white/5 text-white'}`}>
          <div className="flex justify-between items-start text-gray-500">
            <span className="text-[9px] font-mono uppercase tracking-wider block">Recruiter Profile Views</span>
            <Users className="h-4 w-4 text-vibrant-orange shrink-0" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display tracking-tight leading-none">{totals.views}</span>
            <span className="text-[10px] text-green-400 font-mono flex items-center gap-0.5 font-bold">
              <TrendingUp className="h-3 w-3" /> +15.2%
            </span>
          </div>
          <p className="text-[9px] text-gray-500 mt-1 font-mono">Total unique recruiter visits</p>
        </div>

        {/* STAT 2: DECRYPTIONS */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-sleek-black/40 border-white/5 text-white'}`}>
          <div className="flex justify-between items-start text-gray-500">
            <span className="text-[9px] font-mono uppercase tracking-wider block">Credential Interchanges</span>
            <Award className="h-4 w-4 text-deep-blue shrink-0" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display tracking-tight leading-none">{totals.decryptions}</span>
            <span className="text-[10px] text-green-400 font-mono flex items-center gap-0.5 font-bold">
              <TrendingUp className="h-3 w-3" /> +28.4%
            </span>
          </div>
          <p className="text-[9px] text-gray-500 mt-1 font-mono">Unlocks of encrypted archives</p>
        </div>

        {/* STAT 3: CONVERSION */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-sleek-black/40 border-white/5 text-white'}`}>
          <div className="flex justify-between items-start text-gray-500">
            <span className="text-[9px] font-mono uppercase tracking-wider block">Lead Conversion Vibe</span>
            <Sparkles className="h-4 w-4 text-yellow-500 shrink-0 animate-pulse" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display tracking-tight leading-none">{totals.conversion}</span>
            <span className="text-[10px] text-green-400 font-mono flex items-center gap-0.5 font-bold">
              <TrendingUp className="h-3 w-3" /> A- Score
            </span>
          </div>
          <p className="text-[9px] text-gray-500 mt-1 font-mono">Views to secure decryption ratio</p>
        </div>

        {/* STAT 4: AVERAGE SECTOR TIME */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-sleek-black/40 border-white/5 text-white'}`}>
          <div className="flex justify-between items-start text-gray-500">
            <span className="text-[9px] font-mono uppercase tracking-wider block">Vetting Session Pace</span>
            <Clock className="h-4 w-4 text-blue-400 shrink-0" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black font-display tracking-tight leading-none">{totals.averageDuration}</span>
            <span className="text-[9px] text-gray-500 font-mono font-medium">Avg duration</span>
          </div>
          <p className="text-[9px] text-gray-500 mt-1 font-mono">Median recruiter audit duration</p>
        </div>
      </div>

      {/* Main Graph Box */}
      <GlassCard glowColor="blue">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[9px] text-deep-blue font-mono tracking-widest uppercase font-bold block">
              Recruiter Hub Engagement Auditing Dashboard
            </span>
            <h4 className="font-display font-black text-white text-base leading-snug">
              Interest Velocity & Decryption Claims (30 Days)
            </h4>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
              Tracks real engagement patterns when HR visitors request gateway credentials, showing safe decryptions and key verifications.
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 bg-black/40 p-1.5 rounded-lg border border-white/5 text-[10px] font-mono">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-400">Timespan: <strong className="text-white">Active 30 Days</strong></span>
          </div>
        </div>

        {/* Legend block */}
        <div className="flex items-center gap-4 text-[10px] font-mono mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: strokeViews }} />
            <span className="text-gray-400">Profile Visits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: strokeDecrypts }} />
            <span className="text-gray-400">Safe Decryptions</span>
          </div>
        </div>

        {/* Responsive Custom SVG Node */}
        <div ref={containerRef} className="mt-4 w-full h-[230px] pr-2 relative select-none">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Definitions for gorgeous area gradient glows */}
            <defs>
              <linearGradient id="svgViewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeViews} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeViews} stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="svgDecryptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeDecrypts} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeDecrypts} stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {yTicks.map((val, idx) => {
              const y = margins.top + chartHeight - (val / maxVal) * chartHeight;
              return (
                <g key={idx}>
                  <line
                    x1={margins.left}
                    y1={y}
                    x2={dimensions.width - margins.right}
                    y2={y}
                    stroke={isLight ? "rgba(28,25,23,0.06)" : "rgba(255,255,255,0.04)"}
                    strokeDasharray="4 4"
                  />
                  {/* Y-axis label */}
                  <text
                    x={margins.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill={isLight ? "#78716c" : "#9ca3af"}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-axis ticks (showing every 5th label to avoid crowding) */}
            {trackingData.map((d, index) => {
              if (index % 5 !== 0 && index !== trackingData.length - 1) return null;
              const x = margins.left + (index / (trackingData.length - 1)) * chartWidth;
              return (
                <text
                  key={index}
                  x={x}
                  y={dimensions.height - 6}
                  textAnchor="middle"
                  fill={isLight ? "#78716c" : "#9ca3af"}
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {d.day}
                </text>
              );
            })}

            {/* Area Fills */}
            {points.views.length > 0 && (
              <path
                d={getAreaPathString(points.views)}
                fill="url(#svgViewsGrad)"
              />
            )}
            {points.decryptions.length > 0 && (
              <path
                d={getAreaPathString(points.decryptions)}
                fill="url(#svgDecryptGrad)"
              />
            )}

            {/* Line Paths */}
            {points.views.length > 0 && (
              <path
                d={getPathString(points.views)}
                fill="none"
                stroke={strokeViews}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {points.decryptions.length > 0 && (
              <path
                d={getPathString(points.decryptions)}
                fill="none"
                stroke={strokeDecrypts}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Hover Guides */}
            {hoveredIdx !== null && (
              <g>
                {/* Vertical alignment hover line */}
                <line
                  x1={margins.left + (hoveredIdx / (trackingData.length - 1)) * chartWidth}
                  y1={margins.top}
                  x2={margins.left + (hoveredIdx / (trackingData.length - 1)) * chartWidth}
                  y2={margins.top + chartHeight}
                  stroke={isLight ? "rgba(28,25,23,0.15)" : "rgba(255,255,255,0.15)"}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Pulsing highlights for views dot */}
                {points.views[hoveredIdx] && (
                  <g>
                    <circle
                      cx={points.views[hoveredIdx].x}
                      cy={points.views[hoveredIdx].y}
                      r="6"
                      fill={strokeViews}
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={points.views[hoveredIdx].x}
                      cy={points.views[hoveredIdx].y}
                      r="4"
                      fill={strokeViews}
                      stroke={isLight ? "#ffffff" : "#0a0a0c"}
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Pulsing highlights for decryptions dot */}
                {points.decryptions[hoveredIdx] && (
                  <g>
                    <circle
                      cx={points.decryptions[hoveredIdx].x}
                      cy={points.decryptions[hoveredIdx].y}
                      r="6"
                      fill={strokeDecrypts}
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={points.decryptions[hoveredIdx].x}
                      cy={points.decryptions[hoveredIdx].y}
                      r="4"
                      fill={strokeDecrypts}
                      stroke={isLight ? "#ffffff" : "#0a0a0c"}
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </g>
            )}
          </svg>

          {/* Fully Interactive Floating Tooltip Overlay */}
          {hoveredIdx !== null && activeDataPoint && (
            <div
              className="absolute pointer-events-none transition-all duration-75 ease-out shadow-xl"
              style={{
                left: `${Math.max(margins.left + 5, Math.min(dimensions.width - margins.right - 145, tooltipPos.x + 10))}px`,
                top: `${Math.max(10, Math.min(dimensions.height - 95, tooltipPos.y - 45))}px`,
                backgroundColor: isLight ? "#ffffff" : "#09090b",
                border: isLight ? "1px solid #e7e5e4" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "8px 12px",
                width: "135px",
                zIndex: 50,
              }}
            >
              <div className="text-[10px] text-gray-400 font-mono font-bold border-b border-white/5 pb-1 mb-1">
                {activeDataPoint.day}
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Visits:</span>
                  <span className="font-bold text-white" style={{ color: strokeViews }}>
                    {activeDataPoint.views}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Decrypts:</span>
                  <span className="font-bold text-[#00f0ff]" style={{ color: strokeDecrypts }}>
                    {activeDataPoint.decryptions}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
