// utils/generateHash.js
import crypto from "crypto";

/**
 * Generate hash for payment gateway
 * Rule:
 * - Sort keys alphabetically
 * - Join values using `|`
 * - Append `|SALT`
 * - Hash using SHA-512
 * - Convert to UPPERCASE
 */
export function generateHash(payload, salt) {
  const keys = Object.keys(payload).sort();
  const hashString = keys.map(k => payload[k]).join("|") + "|" + salt;

  return crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
}

