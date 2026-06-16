/**
 * Cryptographic utility functions for client-side E2E storage using standard browser WebCrypto.
 * Uses PBKDF2 for key derivation and AES-GCM (256-bit) for highly secure, low-latency encryption.
 */

// Helper to convert array buffer to hex string
function bufToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Helper to convert hex string to Uint8Array
function hexToBuf(hex: string): Uint8Array {
  const length = hex.length / 2;
  const arr = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}

// Helper to convert string to UTF-8 buffer
function strToBuf(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert buffer to string
function bufToStr(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

/**
 * Derives an AES-GCM 256-bit key from a user password and a salt
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = window.crypto.subtle;
  
  // Import the password as raw key material
  const baseKey = await subtle.importKey(
    "raw",
    strToBuf(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey", "deriveBits"]
  );

  // Derive the 256-bit AES key using PBKDF2 with SHA-256
  return await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false, // Key is not extractable
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts cleartext string data with a password
 * Returns: { encryptedDataHex, saltHex, ivHex }
 */
export async function encryptData(cleartext: string, password: string): Promise<{
  encryptedData: string;
  salt: string;
  iv: string;
}> {
  try {
    const subtle = window.crypto.subtle;
    
    // Generate fresh random 16-byte salt and 12-byte IV (Initialization Vector)
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(password, salt);
    const clearBuffer = strToBuf(cleartext);

    // Encrypt using AES-GCM
    const encryptedBuf = await subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      clearBuffer
    );

    // Encode to hexagonal or standard string
    // Let's use Base64 for the encrypted data and hex for IV/salt to make it easy to transfer
    const encryptedArray = new Uint8Array(encryptedBuf);
    let binary = "";
    for (let i = 0; i < encryptedArray.length; i++) {
      binary += String.fromCharCode(encryptedArray[i]);
    }
    const encryptedDataBase64 = window.btoa(binary);

    return {
      encryptedData: encryptedDataBase64,
      salt: bufToHex(salt.buffer),
      iv: bufToHex(iv.buffer)
    };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt. Please check WebCrypto browser capabilities.");
  }
}

/**
 * Decrypts a base64 encoded cryptographic string back to cleartext
 */
export async function decryptData(
  encryptedDataBase64: string,
  password: string,
  saltHex: string,
  ivHex: string
): Promise<string> {
  try {
    const subtle = window.crypto.subtle;
    
    const salt = hexToBuf(saltHex);
    const iv = hexToBuf(ivHex);
    
    // Convert base64 back to Uint8Array
    const binaryStr = window.atob(encryptedDataBase64);
    const encryptedBuf = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      encryptedBuf[i] = binaryStr.charCodeAt(i);
    }

    const key = await deriveKey(password, salt);

    // Decrypt using AES-GCM
    const decryptedBuf = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encryptedBuf
    );

    return bufToStr(decryptedBuf);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Invalid password or corrupted file credentials.");
  }
}

/**
 * Generate a cryptographically secure random key
 */
export function generateRandomId(): string {
  const parts = new Uint32Array(4);
  window.crypto.getRandomValues(parts);
  return Array.from(parts).map(v => v.toString(16).padStart(8, "0")).join("-");
}
