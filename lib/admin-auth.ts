import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {digest} from './password';
export const SESSION_COOKIE = '__Host-cv-admin';
export const SESSION_SECONDS = 8 * 60 * 60;
export const authHeaders = {'Cache-Control':'no-store', 'Pragma':'no-cache'};
export function sessionCookie(token: string, seconds = SESSION_SECONDS) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`;
}
export async function currentAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token) || !env.DB) return null;
  try {
    return await env.DB.prepare('SELECT a.email FROM admin_sessions s JOIN admin_accounts a ON a.email=s.email WHERE s.token_hash=? AND s.expires_at>?')
      .bind(await digest(token), Math.floor(Date.now()/1000)).first<{email:string}>();
  } catch { return null; }
}
export async function rateLimit(request: Request, action: string) {
  if (!env.DB) throw new Error('Database unavailable');
  const now = Math.floor(Date.now()/1000);
  const key = await digest(`${action}:${request.headers.get('cf-connecting-ip') || 'local'}`);
  const row = await env.DB.prepare(`INSERT INTO admin_login_limits(key,attempts,expires_at) VALUES(?,1,?)
    ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN expires_at<=? THEN 1 ELSE attempts+1 END,
    expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING attempts`)
    .bind(key, now+900, now, now).first<{attempts:number}>();
  return !!row && row.attempts <= 10;
}
export async function readAuthBody(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Invalid body');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks: Uint8Array[] = []; let length = 0;
  while (true) {
    const {done,value} = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > 4096) { await reader.cancel(); throw new Error('Body too large'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
