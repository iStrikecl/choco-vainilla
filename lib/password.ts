const encoder = new TextEncoder();
export function hex(bytes: ArrayBuffer | Uint8Array) {
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
export function randomToken() { return hex(crypto.getRandomValues(new Uint8Array(32))); }
export async function digest(value: string) { return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value))); }
export async function passwordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', salt:encoder.encode(salt), iterations:100000}, key, 256));
}
export async function verifyPassword(password: string, salt: string, expected: string) {
  const actual = await passwordHash(password, salt);
  // HMAC verification avoids a variable-time string comparison of password hashes.
  const key = await crypto.subtle.importKey('raw', encoder.encode(expected), {name:'HMAC', hash:'SHA-256'}, false, ['sign','verify']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(actual));
  return crypto.subtle.verify('HMAC', key, signature, encoder.encode(expected));
}
