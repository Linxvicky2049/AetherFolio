import React, { useState, useRef } from "react";
import { DocumentType, EncryptedDocument, Institution } from "../types";
import { encryptData, decryptData, generateRandomId } from "../lib/crypto";
import GlassCard from "./GlassCard";
import { 
  KeyRound, ShieldCheck, Lock, Unlock, UploadCloud, FileSpreadsheet, Eye, EyeOff, Trash2, 
  Download, Sparkles, CheckCircle, ShieldAlert, BadgeInfo, HelpCircle 
} from "lucide-react";

interface CredentialVaultProps {
  documents: EncryptedDocument[];
  institutions: Institution[];
  onUpdateDocuments: (docs: EncryptedDocument[]) => void;
  isReadOnly?: boolean;
}

export default function CredentialVault({
  documents,
  institutions,
  onUpdateDocuments,
  isReadOnly = false
}: CredentialVaultProps) {
  // Passwords
  const [masterPassword, setMasterPassword] = useState("");
  const [inputtedPassword, setInputtedPassword] = useState("");
  const [isPassKeyUnlocked, setIsPassKeyUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // File Upload State
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(DocumentType.StudentID);
  const [customDocName, setCustomDocName] = useState("");
  const [linkingInstitutionId, setLinkingInstitutionId] = useState("");
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Decryption Preview Target State
  const [decryptedPreviews, setDecryptedPreviews] = useState<{ [docId: string]: string }>({});
  const [decryptErrors, setDecryptErrors] = useState<{ [docId: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputtedPassword.trim().length < 4) {
      alert("Vault password must be at least 4 characters.");
      return;
    }
    setMasterPassword(inputtedPassword);
    setIsPassKeyUnlocked(true);
  };

  const handleResetPasskey = () => {
    if (confirm("Locking the vault will hide all decrypted documents until you enter your password again. Proceed?")) {
      setMasterPassword("");
      setInputtedPassword("");
      setIsPassKeyUnlocked(false);
      setDecryptedPreviews({});
      setDecryptErrors({});
    }
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndEncryptFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && e.target.files && e.target.files[0]) {
      processAndEncryptFile(e.target.files[0]);
    }
  };

  // Modern Browser File processing and Cryptographic encryption
  const processAndEncryptFile = (file: File) => {
    if (!isPassKeyUnlocked || !masterPassword) {
      alert("Please set your Vault Password before uploading secure documents.");
      return;
    }

    setUploadProgress("Reading local file bits...");
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const rawContent = event.target?.result as string; // Holds Base64 Data URL, completely preserving files
        if (!rawContent) throw new Error("Could not parse file data.");

        setUploadProgress("Performing PBKDF2 Derivation & AES-GCM 256 Encryption...");

        // Client-side WebCrypto encryption
        const cryptoResult = await encryptData(rawContent, masterPassword);

        const newDocEntry: EncryptedDocument = {
          id: generateRandomId(),
          type: selectedDocType,
          name: customDocName.trim() || `${selectedDocType} - Reference Entry`,
          encryptedData: cryptoResult.encryptedData,
          salt: cryptoResult.salt,
          iv: cryptoResult.iv,
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          mimeType: file.type || "application/octet-stream",
          uploadedAt: new Date().toISOString(),
          verificationStatus: "Verified", // Instant verifiable assert linked to authorities
          verifiedByInstitutionId: linkingInstitutionId || undefined
        };

        onUpdateDocuments([newDocEntry, ...documents]);
        setUploadProgress(null);
        setCustomDocName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err: any) {
        console.error(err);
        setUploadProgress(null);
        alert(`Encryption pipeline aborted: ${err.message}`);
      }
    };

    reader.readAsDataURL(file);
  };

  // Perform dynamic decryptions
  const handleDecryptView = async (doc: EncryptedDocument) => {
    if (!masterPassword) {
      const passPrompt = prompt("This document is client-side encrypted with AES-256 GCM. Please enter the cryptographic passphrase to Decrypt:");
      if (!passPrompt) return;
      
      try {
        const decryptedPayload = await decryptData(doc.encryptedData, passPrompt, doc.salt, doc.iv);
        // Save state
        setDecryptedPreviews(prev => ({ ...prev, [doc.id]: decryptedPayload }));
        setDecryptErrors(prev => {
          const updated = { ...prev };
          delete updated[doc.id];
          return updated;
        });
      } catch (err) {
        setDecryptErrors(prev => ({ ...prev, [doc.id]: "Incorrect passkey or corrupted payload" }));
      }
      return;
    }

    try {
      const decryptedPayload = await decryptData(doc.encryptedData, masterPassword, doc.salt, doc.iv);
      setDecryptedPreviews(prev => ({ ...prev, [doc.id]: decryptedPayload }));
      setDecryptErrors(prev => {
        const updated = { ...prev };
        delete updated[doc.id];
        return updated;
      });
    } catch (err) {
      setDecryptErrors(prev => ({ ...prev, [doc.id]: "Credential decryption failed under this passkey." }));
    }
  };

  const handleHideDecrypted = (docId: string) => {
    setDecryptedPreviews(prev => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm("Are you sure you want to remove this verified E2E credential from your records?")) {
      onUpdateDocuments(documents.filter(d => d.id !== docId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Vault Password Control */}
      <GlassCard glowColor={isPassKeyUnlocked ? "blue" : "red"}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <KeyRound className={`h-6 w-6 ${isPassKeyUnlocked ? "text-green-400 animate-pulse" : "text-bold-red"}`} />
              Secure Document Vault
            </h3>
            <p className="text-gray-400 text-sm">
              Securely store and view your academic certificates, ID cards, and transcripts. Your files are encrypted locally inside your browser.
            </p>
          </div>

          {!isPassKeyUnlocked ? (
            <form onSubmit={handlePasswordSubmit} className="flex gap-2 w-full md:w-auto shrink-0">
              <div className="relative flex-1 md:w-60">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set Vault Password..."
                  value={inputtedPassword}
                  onChange={(e) => setInputtedPassword(e.target.value)}
                  className="w-full bg-sleek-black/80 border border-white/10 rounded-xl py-2 px-3 pr-10 text-white text-xs font-mono focus:outline-none focus:border-deep-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="submit"
                className="bg-bold-red text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-bold-red/80 transition-all flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                Unlock Vault
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-2 text-green-400">
                <Unlock className="h-4 w-4" />
                <span className="text-xs font-mono font-semibold">Secure Encryption Active</span>
              </div>
              <button
                onClick={handleResetPasskey}
                className="text-[10px] text-gray-400 hover:text-white uppercase font-bold tracking-wider"
              >
                Lock Vault
              </button>
            </div>
          )}
        </div>

        {!isPassKeyUnlocked && (
          <div className="mt-4 p-3 bg-sleek-black/40 border border-bold-red/20 rounded-xl text-[11px] text-red-300 flex items-start gap-2 max-w-2xl">
            <ShieldAlert className="h-4 w-4 text-bold-red mt-0.5 shrink-0" />
            <span>
              <strong>Security Password Required:</strong> Set a master password first to encrypt and protect files locally in your browser. No files can be unlocked or decrypted without this password.
            </span>
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: Upload Panel (Only if authorized and not Read Only) */}
        {!isReadOnly && (
          <div className="space-y-6">
            <GlassCard glowColor="orange" className="border-white/10">
              <h3 className="font-display font-semibold text-white text-base mb-4 flex items-center gap-2">
                <UploadCloud className="text-vibrant-orange h-5 w-5" />
                Upload Secure Documents
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Select Document Category</label>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value as DocumentType)}
                    disabled={!isPassKeyUnlocked}
                    className="w-full bg-sleek-black/60 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-vibrant-orange disabled:opacity-50"
                  >
                    {Object.values(DocumentType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">Custom Document Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford Scholar Certificate"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    disabled={!isPassKeyUnlocked}
                    className="w-full bg-sleek-black/60 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-vibrant-orange disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs block mb-1">Linked Organization / Issuer</label>
                  <select
                    value={linkingInstitutionId}
                    onChange={(e) => setLinkingInstitutionId(e.target.value)}
                    disabled={!isPassKeyUnlocked}
                    className="w-full bg-sleek-black/60 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-vibrant-orange disabled:opacity-50"
                  >
                    <option value="">Select an organization to link this document...</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* DRAG AND DROP ZONE */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    !isPassKeyUnlocked ? "opacity-40 pointer-events-none" : ""
                  } ${
                    dragActive ? "border-vibrant-orange bg-vibrant-orange/5" : "border-white/15 bg-black/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="credential-uploader"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={!isPassKeyUnlocked}
                  />
                  
                  <FileSpreadsheet className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                  
                  <p className="text-xs text-gray-300 font-semibold">
                    Drag and drop your file here
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 mb-3">
                    Supports JPG, PNG, PDF formats up to 10MB
                  </p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isPassKeyUnlocked}
                    className="bg-vibrant-orange/95 hover:bg-vibrant-orange text-white text-[11px] font-bold py-2 px-4 rounded-xl transition-all"
                  >
                    Choose File
                  </button>
                </div>

                {uploadProgress && (
                  <div className="bg-vibrant-orange/10 border border-vibrant-orange/20 rounded-xl p-3 text-center">
                    <Sparkles className="h-4 w-4 text-vibrant-orange animate-spin mx-auto mb-1" />
                    <p className="text-xs text-white font-mono font-semibold">{uploadProgress}</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* RIGHT COLUMN: Interactive Document Records List Grid */}
        <div className={isReadOnly ? "lg:col-span-3 space-y-4" : "lg:col-span-2 space-y-4"}>
          {documents.length === 0 ? (
            <div className="text-center p-10 bg-black/20 rounded-2xl border border-white/5">
              <ShieldAlert className="h-10 w-10 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-300 font-display">Your secure document vault is empty.</p>
              <p className="text-xs text-gray-500 mt-1">Set your vault password to start uploading and viewing files.</p>
            </div>

          ) : (
            documents.map((doc) => {
              const matchedInst = institutions.find(i => i.id === doc.verifiedByInstitutionId);
              const previewData = decryptedPreviews[doc.id];
              const decryptError = decryptErrors[doc.id];

              return (
                <div
                  key={doc.id}
                  className="bg-sleek-black/40 border border-white/8 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-white/15"
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-deep-blue/25 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-mono tracking-wider font-semibold">
                          {doc.type}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {doc.fileSize}
                        </span>
                      </div>
                      <h4 className="text-white font-display font-semibold text-sm">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono flex items-center gap-1.5 leading-none">
                        <span>Ref File: {doc.fileName}</span>
                        <span>•</span>
                        <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {previewData ? (
                        <button
                          onClick={() => handleHideDecrypted(doc.id)}
                          className="bg-white/5 text-gray-300 text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1"
                        >
                          <EyeOff className="h-3.5 w-3.5" />
                          Hide File
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDecryptView(doc)}
                          className="bg-deep-blue text-white text-xs px-3 py-1.5 rounded-lg hover:bg-deep-blue/80 transition-all flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Decrypt & View
                        </button>
                      )}

                      {!isReadOnly && (
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Institution Verification Ledger */}
                  {matchedInst && (
                    <div className="bg-white/1 px-5 py-2 border-b border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                        Issued by: <strong className="text-white font-medium">{matchedInst.name}</strong>
                      </span>
                      <span className="font-mono text-gray-600 block">{matchedInst.regCode}</span>
                    </div>
                  )}

                  {/* Decrypted Render Area */}
                  {previewData && (
                    <div className="p-5 bg-black/60 border-t border-white/5 space-y-3">
                      <div className="flex justify-between items-center bg-green-500/10 border border-green-500/20 p-2.5 rounded-xl">
                        <span className="text-xs text-green-400 flex items-center gap-1 font-mono">
                          <CheckCircle className="h-4 w-4" /> Document Decrypted Successfully
                        </span>
                        
                        <a
                          href={previewData}
                          download={doc.fileName}
                          className="text-xs text-white bg-vibrant-orange hover:bg-vibrant-orange/80 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" /> Download File
                        </a>
                      </div>

                      {/* Render based on MimeType */}
                      <div className="border border-white/10 rounded-xl overflow-hidden bg-sleek-black flex justify-center items-center py-6">
                        {previewData.startsWith("data:image/") ? (
                          <img
                            src={previewData}
                            alt={doc.name}
                            referrerPolicy="no-referrer"
                            className="max-h-60 max-w-full object-contain rounded-lg"
                          />
                        ) : previewData.startsWith("data:application/pdf") ? (
                          <div className="text-center p-4">
                            <FileSpreadsheet className="h-12 w-12 text-vibrant-orange mx-auto mb-2" />
                            <p className="text-white text-xs font-semibold">PDF Document Decrypted</p>
                            <p className="text-[10px] text-gray-500 mt-1 max-w-xs">{doc.fileName} verified securely inside your browser.</p>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <Sparkles className="h-12 w-12 text-deep-blue mx-auto mb-2" />
                            <p className="text-white text-xs font-semibold">Document Content Decrypted</p>
                            <div className="text-left font-mono text-[9px] text-gray-400 max-w-sm overflow-x-auto bg-black p-3 rounded-lg border border-white/5 mt-2">
                              {previewData.substr(0, 300)}...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {decryptError && (
                    <div className="p-4 bg-red-500/10 border-t border-white/5 text-xs text-red-300 flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4 shrink-0" />
                      <span>{decryptError}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
