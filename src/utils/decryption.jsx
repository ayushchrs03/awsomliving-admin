export async function decryptResponse(encryptedResponse) {
  const privateKeyPem = import.meta.env.VITE_PRIVATE_KEY;

  if (!privateKeyPem) {
    throw new Error("Private key is not defined. Check your .env file.");
  }

  // Convert PEM private key to CryptoKey
  async function importRsaPrivateKey(pemKey) {
    const base64 = pemKey
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\s+/g, "");

    const binaryDer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    return window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer.buffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );
  }

  const rsaPrivateKey = await importRsaPrivateKey(privateKeyPem);

  // Decode base64 values from API response
  const encryptedAesKey = Uint8Array.from(
    atob(encryptedResponse.encryptedKey),
    (c) => c.charCodeAt(0)
  );
  const iv = Uint8Array.from(atob(encryptedResponse.iv), (c) =>
    c.charCodeAt(0)
  );
  const authTag = Uint8Array.from(atob(encryptedResponse.authTag), (c) =>
    c.charCodeAt(0)
  );
  const ciphertext = Uint8Array.from(atob(encryptedResponse.ciphertext), (c) =>
    c.charCodeAt(0)
  );

  // Decrypt AES key using RSA private key
  const aesKeyBuffer = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    rsaPrivateKey,
    encryptedAesKey
  );

  // Import AES key for AES-GCM decryption
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    aesKeyBuffer,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  // Combine ciphertext + authTag
  const combinedCiphertext = new Uint8Array(ciphertext.length + authTag.length);
  combinedCiphertext.set(ciphertext);
  combinedCiphertext.set(authTag, ciphertext.length);

  // Perform AES-GCM decryption
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    aesKey,
    combinedCiphertext
  );

  // Convert decrypted buffer to JSON
  const decryptedText = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decryptedText);
}
