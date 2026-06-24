import React from "react";
import { X, Printer, ShieldCheck, Download, Award, Calendar, FileText, CheckCircle } from "lucide-react";
import { StudentProfile, Institution } from "../types";

interface PrintPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  institutions: Institution[];
}

export default function PrintPDFModal({ isOpen, onClose, profile, institutions }: PrintPDFModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    // Triggers standard print system which has @media print overrides
    window.print();
  };

  // Helper to fetch institution details
  const getInstName = (id: string) => {
    const inst = institutions.find(i => i.id === id);
    return inst ? inst.name : "Accredited Board Office";
  };

  const getInstReg = (id: string) => {
    const inst = institutions.find(i => i.id === id);
    return inst ? inst.regCode : "GOV-REG-AUTH";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-sleek-black border border-white/10 max-w-2xl w-full rounded-2xl overflow-hidden glass shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-deep-blue" />
            <div>
              <h3 className="font-display font-bold text-sm text-white">Academic Trust Summary</h3>
              <p className="text-[10px] text-gray-400">Preformatted PDF Transcript & Verifiable Dossier Report</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-deep-blue hover:bg-deep-blue/80 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-deep-blue/20"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="p-6 overflow-y-auto bg-stone-50 text-stone-950" id="academic-print-report">
          
          {/* Main Paper Content */}
          <div className="border-[3px] border-double border-stone-800 p-8 space-y-8 bg-white max-w-full relative shadow-sm mx-auto">
            
            {/* Header watermarks & labels */}
            <div className="flex justify-between items-start border-b-2 border-stone-800 pb-5">
              <div>
                <span className="text-[10px] font-mono font-black tracking-widest text-[#004dc5] uppercase">
                  OFFICIAL AUDIT REPORT
                </span>
                <h1 className="font-display text-2xl font-black text-stone-900 tracking-tight mt-1">
                  VERIFIED ACADEMIC PORTFOLIO
                </h1>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Secure Talent Directory • Verified Academic Portfolio
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-xs bg-stone-905 bg-stone-100 text-stone-800 border border-stone-300 px-3 py-1 font-mono font-bold block rounded">
                  PORTFOLIO ID: CS-77
                </span>
                <span className="text-[9px] text-stone-400 font-mono block mt-1">Generated {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Student Identity Information block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider font-bold">PRIMARY DOSSIER CANDIDATE</span>
                <h2 className="text-lg font-bold text-stone-900 leading-tight">{profile.fullName}</h2>
                <p className="text-xs text-stone-700 italic">"{profile.headline}"</p>
                <p className="text-xs text-stone-600 leading-relaxed pt-2">{profile.bio}</p>
              </div>

              <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-2 text-xs font-mono">
                <span className="text-[9px] font-mono uppercase text-stone-450 block font-bold">CONTACT GATEWAYS</span>
                <p className="border-b border-stone-200 pb-1 text-stone-800 truncate">Email: {profile.email}</p>
                <p className="border-b border-stone-200 pb-1 text-stone-800">Phone: {profile.phone}</p>
                <p className="border-b border-stone-200 pb-1 text-stone-800 truncate">Loc: {profile.location}</p>
                <p className="text-[10px] text-stone-500 select-none truncate">Sig: {profile.socials.website}</p>
              </div>
            </div>

            {/* Verified Education History */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-700 border-b border-stone-300 pb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#004dc5]" /> SECTION I: VERIFIED ACADEMIC TRANSCRIPTS
              </h3>

              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-stone-50/50 border border-stone-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm leading-tight">{edu.degree}</h4>
                        <span className="text-[8px] bg-green-100 border border-green-200 text-green-800 px-2 py-0.5 rounded-full font-mono uppercase font-black flex items-center gap-0.5">
                          <CheckCircle className="h-2 w-2" /> VERIFIEDCLAIM
                        </span>
                      </div>
                      <p className="text-xs text-stone-605 text-stone-600 mt-1">Institution: <strong>{getInstName(edu.institutionId)}</strong></p>
                      <p className="text-xs text-stone-500">Major/Field: {edu.field}</p>
                    </div>

                    <div className="text-left md:text-right font-mono shrink-0">
                      <p className="text-xs text-stone-800 bg-stone-200/50 px-2 py-0.5 rounded w-fit md:ml-auto">{edu.score || "Status: Completed"}</p>
                      <p className="text-[10px] text-stone-500 mt-1">{edu.startYear} — {edu.endYear}</p>
                      <p className="text-[9px] text-[#004dc5] leading-none mt-1">Registrar Code: {getInstReg(edu.institutionId)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Experience History */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-700 border-b border-stone-300 pb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#ff6600]" /> SECTION II: VERIFIED SERVICE & EXPERIENCE RECORDS
              </h3>

              <div className="space-y-4">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-stone-50/50 border border-stone-200 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900 text-sm leading-tight">{exp.role}</h4>
                        <span className="text-[8px] bg-sky-100 border border-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-mono uppercase font-black flex items-center gap-0.5">
                          <CheckCircle className="h-2 w-2" /> VERIFIEDINTERN
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 font-semibold">Employer: {getInstName(exp.institutionId)}</p>
                      <p className="text-xs text-stone-600 mt-1 pr-4">{exp.description}</p>
                    </div>

                    <div className="text-left md:text-right font-mono shrink-0">
                      <p className="text-xs text-stone-500">{exp.startDate} — {exp.endDate}</p>
                      <p className="text-[9px] text-[#ff6600] mt-1 leading-none">Authority license: {getInstReg(exp.institutionId)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secure Cryptographic Document Indices */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs uppercase font-extrabold tracking-widest text-stone-700 border-b border-stone-300 pb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-green-600" /> SECTION III: PORTABLE VAULT CRYPTOGRAPHIC INDICES
              </h3>

              <div className="border border-stone-200 rounded-xl overflow-hidden font-mono text-[10px]">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-bold">
                    <tr>
                      <th className="p-2.5">Document Claim Title</th>
                      <th className="p-2.5">Verification Issuer</th>
                      <th className="p-2.5">Size/Mime</th>
                      <th className="p-2.5 text-right">AES-GCM Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-250 divide-stone-200">
                    {profile.encryptedDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td className="p-2.5 text-stone-900 font-bold">{doc.name}</td>
                        <td className="p-2.5 text-stone-700">{doc.verifiedByInstitutionId ? getInstName(doc.verifiedByInstitutionId) : "Unindexed Issuer"}</td>
                        <td className="p-2.5 text-stone-500">{doc.fileSize} / {doc.mimeType.split("/")[1]?.toUpperCase() || "BIN"}</td>
                        <td className="p-2.5 text-right text-green-700 font-bold">{doc.verificationStatus} & Encrypted</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature & Seal block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-300">
              <div className="text-xs text-stone-500 space-y-1">
                <p className="font-bold text-stone-700 font-mono">VERIFICATION & SECURITY SYSTEM</p>
                <p className="leading-relaxed">
                  This document conforms to standard educational verification protocols. All academic and career claims are digitally signed and verified inside a secure browser vault environment.
                </p>
              </div>

              <div className="flex justify-end gap-6 items-center">
                <div className="text-right">
                  <span className="font-mono text-[11px] text-stone-850 font-bold block italic">Registrar Board</span>
                  <div className="w-24 border-b border-stone-400 my-1 ml-auto" />
                  <span className="text-[9px] text-stone-400 font-mono block">AetherFolio Registrar General</span>
                </div>

                {/* Simulated Seal */}
                <div className="w-16 h-16 rounded-full border-4 border-double border-stone-500 flex items-center justify-center text-center p-1 select-none">
                  <span className="text-[7px] font-mono leading-none tracking-tighter text-stone-500 font-bold">VERIFIED<br/>TALENT<br/>RECORD</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5 bg-white/2 flex justify-end gap-3 text-[11px] font-bold no-print">
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl border border-white/10"
          >
            Close Document
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-deep-blue hover:bg-deep-blue/80 text-white px-5 py-2 rounded-xl flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" /> Print Now
          </button>
        </div>

      </div>
    </div>
  );
}
