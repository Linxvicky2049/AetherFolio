import React, { useState } from "react";
import { PRESET_INSTITUTIONS } from "../data/institutions";
import { Institution } from "../types";
import GlassCard from "./GlassCard";
import { Search, Building, Mail, Phone, MapPin, CheckCircle, ShieldCheck, HelpCircle, FileText, Send, UserCheck, Plus, X } from "lucide-react";

interface InstitutionLookupProps {
  onAddCustomInstitution?: (inst: Institution) => void;
  customInstitutions?: Institution[];
}

export default function InstitutionLookup({
  onAddCustomInstitution,
  customInstitutions = []
}: InstitutionLookupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  
  // Custom institution form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInst, setNewInst] = useState<Partial<Institution>>({
    name: "",
    type: "University",
    regCode: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    status: "Accredited",
    authorityRank: "",
    signatoryName: "",
    officeAddress: ""
  });

  const [contactForm, setContactForm] = useState({
    sender: "",
    message: "",
    sent: false
  });

  const allInstitutions = [...PRESET_INSTITUTIONS, ...customInstitutions];

  const filtered = allInstitutions.filter(inst => {
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.regCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.signatoryName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || inst.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleCreateInst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.name || !newInst.regCode || !newInst.contactEmail) {
      alert("Please fill out Name, Registration Code, and Verification Email.");
      return;
    }

    const created: Institution = {
      id: `custom-${Date.now()}`,
      name: newInst.name,
      type: newInst.type as any,
      regCode: newInst.regCode,
      website: newInst.website || "https://",
      contactEmail: newInst.contactEmail,
      contactPhone: newInst.contactPhone || "Not specified",
      status: "Under Review",
      authorityRank: newInst.authorityRank || "Independent Board",
      signatoryName: newInst.signatoryName || "Registrar Office",
      officeAddress: newInst.officeAddress || "Not specified"
    };

    if (onAddCustomInstitution) {
      onAddCustomInstitution(created);
    }
    
    // Select the newly created school
    setSelectedInst(created);
    setShowAddForm(false);
    
    // Reset
    setNewInst({
      name: "",
      type: "University",
      regCode: "",
      website: "",
      contactEmail: "",
      contactPhone: "",
      status: "Accredited",
      authorityRank: "",
      signatoryName: "",
      officeAddress: ""
    });
  };

  const transmitMockInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.message || !contactForm.sender) return;
    setContactForm(prev => ({ ...prev, sent: true }));
    setTimeout(() => {
      setContactForm({ sender: "", message: "", sent: false });
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header section with search & filter panel */}
      <GlassCard glowColor="blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-deep-blue h-6 w-6" />
              Institutions & Boards Authentication Central
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Search global academic registers, licensing boards, and companies to audit legitimacy codes.
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-deep-blue hover:bg-deep-blue/80 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Registry Board
          </button>
        </div>

        {/* Filters and Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Institution, Reg Code (e.g. US-CA-EDU), or Dean's name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sleek-black/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-deep-blue transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-sleek-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-deep-blue transition-all"
            >
              <option value="all">All Sectors</option>
              <option value="University">Universities</option>
              <option value="Company">Companies / Employers</option>
              <option value="Certification Board">Certification Boards</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Grid of Boards & Details Modal Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: List */}
        <div className="lg:col-span-7 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <div className="text-center p-8 bg-black/20 rounded-xl border border-white/5">
              <HelpCircle className="h-10 w-10 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No institutions found matching your parameters.</p>
              <p className="text-xs text-gray-600 mt-1">Try registered code lookup or add them manually to verify.</p>
            </div>
          ) : (
            filtered.map((inst) => {
              const statusColors = {
                Accredited: "bg-green-500/10 text-green-400 border-green-500/25",
                Licensed: "bg-blue-500/10 text-blue-400 border-blue-500/25",
                "Verified Enterprise": "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
                "Under Review": "bg-yellow-500/10 text-yellow-400 border-yellow-500/25",
                Unverified: "bg-red-500/10 text-red-400 border-red-500/25"
              };

              return (
                <div
                  key={inst.id}
                  onClick={() => setSelectedInst(inst)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                    selectedInst?.id === inst.id
                      ? "bg-deep-blue/15 border-deep-blue/40"
                      : "bg-sleek-black/30 border-white/5 hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-white/5 text-deep-blue">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white group-hover:text-deep-blue text-sm">
                        {inst.name}
                      </h4>
                      <p className="text-gray-400 text-xs flex items-center gap-2 mt-1">
                        <span className="font-mono text-gray-500">{inst.regCode}</span>
                        <span>•</span>
                        <span>{inst.type}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${statusColors[inst.status]}`}>
                    {inst.status}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Institutional Detail/Verification Vetting Board */}
        <div className="lg:col-span-5 h-full">
          {selectedInst ? (
            <GlassCard glowColor="orange" className="h-full border-white/10">
              <div className="flex justify-between items-start gap-3">
                <span className="text-xs text-yellow-500 font-mono tracking-widest uppercase">
                  Accreditation Dossier
                </span>
                <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                  ID: {selectedInst.id}
                </span>
              </div>

              <h3 className="font-display text-xl font-bold text-white mt-2 leading-snug">
                {selectedInst.name}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 pb-4 border-b border-white/5">
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase font-mono">Government License</span>
                  <span className="text-white text-xs font-mono font-semibold">{selectedInst.regCode}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase font-mono">Accrediting Council</span>
                  <span className="text-white text-xs leading-none truncate block mt-0.5">{selectedInst.authorityRank}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <UserCheck className="h-4 w-4 text-vibrant-orange shrink-0" />
                  <span className="text-xs">
                    <strong className="text-white">{selectedInst.signatoryName}</strong> (Registrar / Signing Director)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4 text-vibrant-orange shrink-0" />
                  <span className="text-xs">{selectedInst.officeAddress}</span>
                </div>

                <div className="flex items-start gap-2 text-gray-300">
                  <Mail className="h-4 w-4 text-vibrant-orange mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs block text-white font-mono">{selectedInst.contactEmail}</span>
                    <span className="text-[10px] text-gray-500">Official Secure Verification Inbox</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4 text-vibrant-orange shrink-0" />
                  <span className="text-xs font-mono">{selectedInst.contactPhone}</span>
                </div>
              </div>

              {/* Direct Verification Contact Form Panel */}
              <div className="mt-6 pt-5 border-t border-white/5 bg-white/3 p-4 rounded-xl border border-white/5">
                <h4 className="font-display font-semibold text-white text-xs mb-2 flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-deep-blue" />
                  Vetting Request System
                </h4>
                <p className="text-[11px] text-gray-400 mb-3">
                  Instantly dispatch an email authentication token to this university registrar or employer for credential confirmation.
                </p>

                {contactForm.sent ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-white font-medium">Authentication Token Sent!</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Verification hash ID queued on official server registry.</p>
                  </div>
                ) : (
                  <form onSubmit={transmitMockInquiry} className="space-y-2">
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Your Vetting Email (e.g. Recruiter @ Google)"
                        value={contactForm.sender}
                        onChange={(e) => setContactForm({ ...contactForm, sender: e.target.value })}
                        className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-vibrant-orange"
                      />
                    </div>
                    <div>
                      <textarea
                        required
                        rows={2}
                        placeholder="Inquiry (e.g. Please authenticate Candidate #77 Academic Credentials details)"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-sleek-black border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-vibrant-orange"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-vibrant-orange/90 hover:bg-vibrant-orange text-white text-xs font-bold py-2 rounded-lg transition-all"
                    >
                      Authenticate with Encrypted Session
                    </button>
                  </form>
                )}
              </div>
            </GlassCard>
          ) : (
            <div className="h-full border border-dashed border-white/10 rounded-2xl p-10 flex flex-col justify-center items-center text-center bg-sleek-black/10">
              <Building className="h-12 w-12 text-gray-500 mb-2" />
              <h4 className="text-white font-display font-semibold mb-1">Assortment & Verification Board</h4>
              <p className="text-xs text-gray-400 max-w-sm">
                Select any academic board or global company from the registry on the left to review contact channels, credential parameters, and official signers.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PopUp Custom Institution Maker */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-sleek-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-sleek-black border border-white/10 max-w-xl w-full rounded-2xl overflow-hidden glass shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-white">Registry Board Authorization</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInst} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={newInst.name || ""}
                    onChange={(e) => setNewInst({ ...newInst, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Sector Class *</label>
                  <select
                    value={newInst.type}
                    onChange={(e) => setNewInst({ ...newInst, type: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="University">University</option>
                    <option value="Company">Company</option>
                    <option value="Certification Board">Certification Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">State / Federal License Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. US-NY-EDU-102"
                    value={newInst.regCode || ""}
                    onChange={(e) => setNewInst({ ...newInst, regCode: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Official Accreditee Governing Body</label>
                  <input
                    type="text"
                    placeholder="e.g. Federal Board, SEC, etc."
                    value={newInst.authorityRank || ""}
                    onChange={(e) => setNewInst({ ...newInst, authorityRank: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Verification Email Inbox *</label>
                  <input
                    type="email"
                    required
                    placeholder="registrar-verify@..."
                    value={newInst.contactEmail || ""}
                    onChange={(e) => setNewInst({ ...newInst, contactEmail: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Registrar Signatory Dean (Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Johnathan Wilde"
                    value={newInst.signatoryName || ""}
                    onChange={(e) => setNewInst({ ...newInst, signatoryName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Accreditee HQ Address</label>
                <input
                  type="text"
                  placeholder="Street Address, City, Country"
                  value={newInst.officeAddress || ""}
                  onChange={(e) => setNewInst({ ...newInst, officeAddress: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                />
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
                  Authorize Accredited Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
