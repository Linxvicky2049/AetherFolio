import { StudentProfile, DocumentType } from "../types";

export const PRESET_STUDENT: StudentProfile = {
  id: "student-alexandra-77",
  fullName: "Alexandra Carter",
  email: "alexandra.carter@cs.stanford.edu",
  phone: "+1 (650) 883-9912",
  headline: "Quantum Machine Learning Researcher & Full Stack Engineer",
  location: "Silicon Valley, California",
  bio: "M.S. Candidate in Computer Science at Stanford University, focusing on Quantum Computer Vision and Distributed Neural Systems. Interned at Google Quantum AI Labs and OpenAI Research. Passionate about architecting bulletproof digital credentials and high-dimensional interface graphics.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "https://portfolio.alexandra.io"
  },
  projects: [
    {
      id: "proj-01",
      title: "TensorFlow-Quantum-Vision",
      description: "A library for integrating high-dimensional tensor networks directly into convolutional neural overlays for atmospheric quantum rendering.",
      techTags: ["Python", "C++", "TensorFlow Quantum", "Rust", "CUDA"],
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      featured: true,
      metrics: "★ 1.8k Stars • 45ms Avg Inference"
    },
    {
      id: "proj-02",
      title: "Aetherial Canvas Engine",
      description: "3D GPU shader canvas library engineered with WebGL-2 for water-glass frosted transparency, custom materials, and dynamic micro-reflections.",
      techTags: ["TypeScript", "WebGL 2", "Vite", "Glsl", "Motion"],
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      featured: true,
      metrics: "98 FPS Stable • 120Hz Displays"
    },
    {
      id: "proj-03",
      title: "Consensus-L2 Security Rollups",
      description: "An offline-first peer-to-peer verification engine providing secure student certification claims using zero-knowledge recursive proofs.",
      techTags: ["Rust", "WASM", "WebCrypto", "Solidity"],
      liveUrl: "https://github.com",
      githubUrl: "https://github.com",
      featured: false,
      metrics: "0.01s Proof Time"
    }
  ],
  education: [
    {
      id: "edu-01",
      institutionId: "inst-stanford-01",
      degree: "M.S. in Computer Science",
      field: "Artificial Intelligence & Quantum Computing",
      startYear: "2024",
      endYear: "2026",
      isVerified: true,
      score: "GPA 3.98 / 4.0"
    },
    {
      id: "edu-02",
      institutionId: "inst-mit-02",
      degree: "B.S. in Electrical Engineering & CS",
      field: "Advanced Computing Paradigms",
      startYear: "2020",
      endYear: "2024",
      isVerified: true,
      score: "GPA 4.0 (Magna Cum Laude)"
    }
  ],
  experience: [
    {
      id: "exp-01",
      institutionId: "inst-openai-04",
      role: "Graduate Assistant - Quantum Alignment Group",
      description: "Researched multi-agent reinforcement protocols under quantum-supervised models, contributing directly to large multi-modal reasoning models.",
      startDate: "Jun 2025",
      endDate: "Present",
      isVerified: true
    },
    {
      id: "exp-02",
      institutionId: "inst-google-03",
      role: "Research Engineer Intern - Sycamore Architecture Team",
      description: "Optimized state-vector qubit simulations using high-performance CUDA kernels, reducing execution time drift on Sycamore hardware layers by 34%.",
      startDate: "Jun 2024",
      endDate: "Sep 2024",
      isVerified: true
    }
  ],
  encryptedDocuments: [
    {
      id: "doc-voter",
      type: DocumentType.VotersCard,
      name: "California Official Voters Registration Card",
      encryptedData: "MOCK_ENCRYPTED_DATA_FOR_SECURE_STORAGE_AS_VOTER_CARD_777777777777", // This is mock since the user hasn't typed a master password yet, but actual dynamic cryptography replaces this!
      salt: "e6f499bb8e2d4d82a1708849bca0287a",
      iv: "2d37c89f5c88b901fc3da3ea",
      fileName: "voters_card_us_ca.pdf",
      fileSize: "1.2 MB",
      mimeType: "application/pdf",
      uploadedAt: "2026-03-12T14:22:00Z",
      verificationStatus: "Verified",
      verifiedByInstitutionId: "inst-stanford-01"
    },
    {
      id: "doc-student-id",
      type: DocumentType.StudentID,
      name: "Stanford University Academic Student ID Card",
      encryptedData: "MOCK_ENCRYPTED_DATA_FOR_SECURE_STORAGE_AS_STUDENT_ID_CARTER_2026",
      salt: "3c3a4f89d81d27ab9eeef388f8d02d01",
      iv: "9bc12239ad09fbb34eac92da",
      fileName: "stanford_sid_carter.png",
      fileSize: "450 KB",
      mimeType: "image/png",
      uploadedAt: "2024-09-01T08:15:00Z",
      verificationStatus: "Verified",
      verifiedByInstitutionId: "inst-stanford-01"
    },
    {
      id: "doc-gcp-cert",
      type: DocumentType.Certification,
      name: "Google Cloud Certified Professional Cloud Architect",
      encryptedData: "MOCK_ENCRYPTED_DATA_FOR_SECURE_STORAGE_AS_GCP_PCA_CERTIFICATE",
      salt: "2d29f866cebf55dc001192eabda9b8cc",
      iv: "aef3d8aa7e6e5d0fc2e34fa1",
      fileName: "gcp_cloud_architect.pdf",
      fileSize: "2.1 MB",
      mimeType: "application/pdf",
      uploadedAt: "2025-05-18T10:30:00Z",
      verificationStatus: "Verified",
      verifiedByInstitutionId: "inst-gcp-05"
    }
  ],
  hasMasterPasswordSet: false // Starts false so the user can see how to initialize their Master Password for secure decryption or insert their own!
};
