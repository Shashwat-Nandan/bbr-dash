import { scryptSync, createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const APP_SALT = "bbr-dashboard-encryption-salt-v1";

function deriveKey(): Buffer {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    throw new Error("SECRET_KEY environment variable is required for encryption");
  }
  return scryptSync(secret, APP_SALT, 32);
}

let _key: Buffer | null = null;
function getKey(): Buffer {
  if (!_key) _key = deriveKey();
  return _key;
}

export function encrypt(plaintext: string): Buffer {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Pack as [IV (12B) | AuthTag (16B) | Ciphertext]
  return Buffer.concat([iv, authTag, encrypted]);
}

export function decrypt(packed: Buffer): string {
  const key = getKey();

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  return decipher.update(ciphertext) + decipher.final("utf8");
}
