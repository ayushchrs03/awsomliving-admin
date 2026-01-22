import { useDispatch } from "react-redux";
import { readPublicKey } from "../redux/actions/encryption-action";

// Helper: Convert PEM -> ArrayBuffer
function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// Helper: Convert ArrayBuffer -> Base64
function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// 🧩 Main encryption function
export async function encryptPayload(payloadObj) {
//   const dispatch = useDispatch();
//   1️⃣ Get public key from server
    const pubPem =`-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmk5Y0alQLRh20hDXdJwk
  wN4YmKYgvmqwSVzfBacbCQCFsvS3EkNmwC93DNOT3DXpfBhYpyIKJdXdXvDivsNF
  zGA4PkAzmXS3QuVS9jZ4tfCiLfOgEOHUCpGps68F8jDM4qyYb6xvLIyarYg1U13v
  jTIL+yrymOgiAjSYTWxS8iT9qZ3yhHM874WDYpGUG1rQG/re8EQ14hhFBZbNZz4x
  8mvtDJ8bZiVWTn8utv4HXeYMks24Xi06cjQ/f2e/57r/AEwIV2eWfQxtAGXcAYXK
  7BvyPQLS1xOVhCBoDcr06e7qtxMOsf6vj1oWTJenUbRD4/ypEqjfNAhfTajrnygf
  XS+n4a1xSPSGX94V8eyUojjQJK7ByDemLF6ZHOVmmrI6Ks7bn91XHznKg4hQuA1H
  +sN9Vft7FEaYcJ879FNfsQDLdWkhvr67HSYFxPKAJSps2avVRwDBFGV+oR7CLBb0
  8oyLCUAYHliuA+zoSfgydLWYLCj+6A18Pte0RQh3vfe+vEcTijAxyMC3ngVz2L9/
  CnMCIRDgK59ZKOzBT4+S9VGBKnsOT8+YUXqeeR5zq3ANH/J7lE6vwYMhTtG1j3cL
  B7DgpxRqSTti4Npt+HJYmyvEPLbvbCtqiQmvQKAT8B+T0unJr3T5XuNIlgILsGzi
  F3q03UuV19JwmXrsVBiCZPkCAwEAAQ==
  -----END PUBLIC KEY-----`
//   const pubPem = dispatch(readPublicKey());
  const spki = pemToArrayBuffer(pubPem);

  // 2️⃣ Import RSA public key
  const rsaPublicKey = await window.crypto.subtle.importKey(
    "spki",
    spki,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  // 3️⃣ Generate AES-GCM key
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // 4️⃣ Export raw AES key (for RSA encryption)
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

  // 5️⃣ Encrypt AES key with RSA public key
  const encryptedKeyBuf = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaPublicKey,
    rawAesKey
  );

  // 6️⃣ Encrypt payload with AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payloadObj));

  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    data
  );

  // WebCrypto returns ciphertext + authTag combined → separate manually
  const combined = new Uint8Array(encryptedBuf);
  const tagLength = 16; // last 16 bytes = auth tag
  const ciphertext = combined.slice(0, combined.length - tagLength);
  const authTag = combined.slice(combined.length - tagLength);

  // 7️⃣ Return base64-encoded fields
  return {
    encryptedKey: toBase64(encryptedKeyBuf),
    iv: toBase64(iv.buffer),
    authTag: toBase64(authTag.buffer),
    ciphertext: toBase64(ciphertext.buffer),
  };
}
