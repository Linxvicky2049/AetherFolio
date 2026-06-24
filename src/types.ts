export enum DocumentType {
  IdentityCard = "Identity Card",
  VotersCard = "Voters Card",
  StudentID = "Student ID",
  Certification = "Professional Certification",
  Diploma = "Academic Diploma"
}

export interface EncryptedDocument {
  id: string;
  type: DocumentType;
  name: string;
  encryptedData: string; // Base64 encrypted data
  salt: string;          // Cryptographic salt hex
  iv: string;            // AES Initial Vector hex
  fileName: string;
  fileSize: string;
  mimeType: string;
  uploadedAt: string;
  verificationStatus: "Unverified" | "Verified" | "Pending";
  verifiedByInstitutionId?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: "University" | "College" | "High School" | "Company" | "Certification Board" | "Agency";
  regCode: string;       // Government registration/licensing code
  website: string;
  contactEmail: string;
  contactPhone: string;
  status: "Accredited" | "Licensed" | "Verified Enterprise" | "Under Review" | "Unverified";
  authorityRank: string; // e.g. "Federal Board", "State University Council", "Industry Standard"
  signatoryName: string; // Signatory or Registrar name
  officeAddress: string;
  ranking?: string;      // QS Global Rank, e.g. "#2 Worldwide"
  domain?: string;
  certMeta?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techTags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string; // e.g., "1.2k Stars", "30% latency reduction"
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
}

export interface EducationEntry {
  id: string;
  institutionId: string; // References Institution database
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  isVerified: boolean;
  score?: string;
}

export interface ExperienceEntry {
  id: string;
  institutionId: string; // References Institution database (Company)
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isVerified: boolean;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: "Recruiter" | "Employer" | "Academic Mentor" | "Other";
  subject: string;
  message: string;
  sentAt: string;
  isRead: boolean;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  headline: string; // e.g., "AI Engineering Student @ Stanford"
  bio: string;
  location: string;
  email: string;
  phone: string;
  socials: SocialLinks;
  projects: Project[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  encryptedDocuments: EncryptedDocument[];
  hasMasterPasswordSet: boolean;
  skills?: string[];
}
