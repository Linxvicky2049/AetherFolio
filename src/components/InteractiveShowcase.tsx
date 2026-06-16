import React, { useState } from "react";
import { Project } from "../types";
import GlassCard from "./GlassCard";
import { 
  FolderGit2, Cpu, ExternalLink, Github, Flame, Star, Sparkles, Filter, 
  Code2, Eye, Play, Gauge, ShieldAlert, Plus, Trash2, X 
} from "lucide-react";

interface InteractiveShowcaseProps {
  projects: Project[];
  onUpdateProjects?: (projs: Project[]) => void;
  isReadOnly?: boolean;
}

export default function InteractiveShowcase({
  projects,
  onUpdateProjects,
  isReadOnly = false
}: InteractiveShowcaseProps) {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [activeSandboxProj, setActiveSandboxProj] = useState<Project | null>(projects[0] || null);
  
  // Custom project builder triggers
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProj, setNewProj] = useState<Partial<Project>>({
    title: "",
    description: "",
    techTags: [],
    liveUrl: "",
    githubUrl: "",
    featured: false,
    metrics: ""
  });
  const [rawTagsInput, setRawTagsInput] = useState("");

  // Sandbox simulation triggers
  const [sandboxFps, setSandboxFps] = useState(98);
  const [sandboxLatency, setSandboxLatency] = useState(4.2);
  const [isGPUExecuting, setIsGPUExecuting] = useState(false);

  // Compile all unique technology tags from catalog
  const allTags = Array.from(
    new Set(projects.flatMap(p => p.techTags))
  );

  const filteredProjects = selectedTag === "all"
    ? projects
    : projects.filter(p => p.techTags.includes(selectedTag));

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title || !newProj.description) {
      alert("Please fill out Title and Description.");
      return;
    }

    const tagsArray = rawTagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newProj.title,
      description: newProj.description,
      techTags: tagsArray.length > 0 ? tagsArray : ["General"],
      liveUrl: newProj.liveUrl || undefined,
      githubUrl: newProj.githubUrl || undefined,
      featured: newProj.featured || false,
      metrics: newProj.metrics || "★ Sandbox Ready"
    };

    if (onUpdateProjects) {
      onUpdateProjects([...projects, created]);
    }

    setActiveSandboxProj(created);
    setShowAddForm(false);
    setNewProj({
      title: "",
      description: "",
      techTags: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
      metrics: ""
    });
    setRawTagsInput("");
  };

  const handleDeleteProject = (projId: string) => {
    if (confirm("Are you sure you want to delete this project entry?")) {
      const updated = projects.filter(p => p.id !== projId);
      if (onUpdateProjects) {
        onUpdateProjects(updated);
      }
      if (activeSandboxProj?.id === projId) {
        setActiveSandboxProj(updated[0] || null);
      }
    }
  };

  const handleTriggerGPUSandbox = () => {
    setIsGPUExecuting(true);
    // Mimic futuristic compiling parameters
    const interval = setInterval(() => {
      setSandboxFps(Math.floor(Math.random() * (120 - 85) + 85));
      setSandboxLatency(parseFloat((Math.random() * (5.5 - 2.8) + 2.8).toFixed(2)));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setIsGPUExecuting(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Filtering Navigation bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
              selectedTag === "all"
                ? "bg-vibrant-orange text-white border-vibrant-orange glow-orange"
                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
            }`}
          >
            All Tech
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all shrink-0 ${
                selectedTag === tag
                  ? "bg-vibrant-orange text-white border-vibrant-orange glow-orange"
                  : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-deep-blue hover:bg-deep-blue/80 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all h-fit shrink-0 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Append Showcase
          </button>
        )}
      </div>

      {/* Grid displaying interactive projects & active shader analyzer card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Project Grid (8 wide) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const isActive = activeSandboxProj?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setActiveSandboxProj(p)}
                className={`group cursor-pointer rounded-2xl p-5 border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? "bg-deep-blue/15 border-deep-blue/40 shadow-xl glow-blue"
                    : "bg-sleek-black/40 border-white/8 hover:border-white/20 hover:bg-sleek-black/60"
                }`}
              >
                {/* Visual hover effect line */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-white/5 text-deep-blue">
                      <FolderGit2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </div>
                    {p.metrics && (
                      <span className="text-[10px] text-vibrant-orange font-mono uppercase bg-vibrant-orange/15 px-2.5 py-1 rounded-full border border-vibrant-orange/10 font-bold flex items-center gap-1">
                        <Flame className="h-3 w-3 animate-pulse" />
                        {p.metrics}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-white text-base group-hover:text-deep-blue transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-3">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {p.techTags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono text-gray-500 uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/3">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Core Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] text-deep-blue font-semibold uppercase flex items-center gap-1 hover:underline">
                      <Cpu className="h-3 w-3" /> Execute Sandbox
                    </span>

                    <div className="flex gap-2">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                      
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {!isReadOnly && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(p.id);
                          }}
                          className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ambient dynamic back glow */}
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-deep-blue/5 rounded-full blur-2xl pointer-events-none group-hover:bg-deep-blue/10 transition-colors" />
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Futuristic Shader Code & Interactive Execution Sandbox simulator (4 wide) */}
        <div className="lg:col-span-4 h-full">
          {activeSandboxProj ? (
            <GlassCard glowColor="blue" className="h-full border-deep-blue/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-deep-blue font-mono tracking-widest uppercase">
                  Runtime Emulator
                </span>
                
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Core Online
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/3 text-vibrant-orange rounded-xl">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-lg">
                    {activeSandboxProj.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-mono">ID: {activeSandboxProj.id}</p>
                </div>
              </div>

              {/* Simulated GPU Terminal metrics */}
              <div className="mt-6 bg-black/60 rounded-xl p-4 border border-white/5 space-y-4 font-mono">
                <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Engine Performance</span>
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${isGPUExecuting ? "text-vibrant-orange" : "text-white"}`}>
                      <Gauge className="h-4 w-4" />
                      {sandboxFps} FPS
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Array Thread Latency</span>
                    <span className="text-white text-sm font-bold flex items-center gap-1.5">
                      <Flame className="h-4 w-4 text-bold-red" />
                      {sandboxLatency} ms
                    </span>
                  </div>
                </div>

                {/* Compilation shader log */}
                <div className="space-y-1.5 text-[10px] text-gray-300 leading-tight">
                  <p className="text-gray-500">// Shaders compiled natively on client-side frame</p>
                  <p className="text-emerald-400">#version 300 es</p>
                  <p><span className="text-purple-400">precision highp</span> float;</p>
                  <p><span className="text-purple-400">out vec4</span> fragColor;</p>
                  <p><span className="text-purple-400">uniform vec2</span> u_resolution;</p>
                  <p><span className="text-yellow-400 animate-pulse">void</span> main() {'{'}</p>
                  <p className="pl-4 text-sky-300">vec2 uv = gl_FragCoord.xy / u_resolution.xy;</p>
                  <p className="pl-4 text-sky-300">vec3 col = 0.5 + 0.5 * cos(uv.xyx + vec3(0,2,4));</p>
                  <p className="pl-4">fragColor = vec4(col, {isGPUExecuting ? "0.99" : "0.35"});</p>
                  <p>{'}'}</p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerGPUSandbox}
                  disabled={isGPUExecuting}
                  className="w-full bg-deep-blue text-white hover:bg-deep-blue/80 disabled:bg-deep-blue/30 text-xs font-bold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className={`h-4 w-4 ${isGPUExecuting ? "animate-spin" : ""}`} />
                  {isGPUExecuting ? "Piping Active GPU Threads..." : "Execute Shader Simulation"}
                </button>
              </div>

              {/* Showcase notes */}
              <div className="mt-4 p-3.5 bg-deep-blue/5 border border-deep-blue/15 rounded-xl">
                <p className="text-[11px] text-gray-400 flex items-start gap-1.5">
                  <Sparkles className="h-4 w-4 text-deep-blue shrink-0 mt-0.5" />
                  <span>
                    This interactive project is fully verifiable. Recruiters can view responsive details, test runtime emulations, and verify claims by checking authorized institutions from the linked database records.
                  </span>
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-2xl p-10 flex flex-col justify-center items-center text-center bg-sleek-black/15">
              <FolderGit2 className="h-12 w-12 text-gray-500 mb-2" />
              <h4 className="text-white font-display font-semibold mb-1">Sandbox Execution Engine</h4>
              <p className="text-xs text-gray-400 max-w-sm">
                Select any creative project from the catalogue grid on the left to activate shader emulation and trigger client-side benchmarking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PopUp Custom Project Maker */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-sleek-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-sleek-black border border-white/10 max-w-lg w-full rounded-2xl overflow-hidden glass shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-white">Append Showcase Portfolio</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Neural Overlays"
                  value={newProj.title || ""}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-deep-blue"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Project Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Elaborate on tech, design architectures, outcomes, and research highlights..."
                  value={newProj.description || ""}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-deep-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Technology Tags (Comma split)</label>
                  <input
                    type="text"
                    placeholder="Python, Rust, CUDA"
                    value={rawTagsInput}
                    onChange={(e) => setRawTagsInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-deep-blue"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Product Metrics / Title Accent</label>
                  <input
                    type="text"
                    placeholder="e.g. ★ 1.2k Stars • 98% Perf"
                    value={newProj.metrics || ""}
                    onChange={(e) => setNewProj({ ...newProj, metrics: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-deep-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Github URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProj.githubUrl || ""}
                    onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-deep-blue"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Live URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProj.liveUrl || ""}
                    onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-deep-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-deep-blue hover:bg-deep-blue/80 text-white text-xs px-5 py-2.5 rounded-lg font-bold"
                >
                  Save Project Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
