import {env} from 'cloudflare:workers';
import {authHeaders, rateLimit, readAuthBody, sessionCookie, SESSION_SECONDS} from '../../../../lib/admin-auth';
import {digest, randomToken, verifyPassword} from '../../../../lib/password';
import {sameOrigin} from '../../../../lib/catalog-server';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({error:'Solicitud no permitida.'},{status:403,headers:authHeaders});
  try {
    if (!await rateLimit(request,'login')) return Response.json({error:'Demasiados intentos. Espera 15 minutos antes de volver a intentar.'},{status:429,headers:{...authHeaders,'Retry-After':'900'}});
    const body = await readAuthBody(request);
    if (typeof body.email !== 'string' || body.email.length>254 || typeof body.password !== 'string' || body.password.length>128 || !body.password.length)
      return Response.json({error:'Revisa el correo y la contraseña.'},{status:400,headers:authHeaders});
    const email = body.email.trim().toLowerCase();
    const account = await env.DB!.prepare('SELECT email,password_hash,salt FROM admin_accounts WHERE email=?').bind(email).first<{email:string;password_hash:string;salt:string}>();
    const valid = await verifyPassword(body.password, account?.salt || 'missing-account-dummy-salt', account?.password_hash || '0'.repeat(64));
    if (!valid || !account) return Response.json({error:'Correo o contraseña incorrectos.'},{status:401,headers:authHeaders});
    const now = Math.floor(Date.now()/1000), token = randomToken();
    await env.DB!.batch([
      env.DB!.prepare('DELETE FROM admin_sessions WHERE expires_at<=?').bind(now),
      env.DB!.prepare('DELETE FROM admin_login_limits WHERE expires_at<=?').bind(now),
      env.DB!.prepare('INSERT INTO admin_sessions(token_hash,email,expires_at) VALUES(?,?,?)').bind(await digest(token),email,now+SESSION_SECONDS)
    ]);
    return Response.json({ok:true},{headers:{...authHeaders,'Set-Cookie':sessionCookie(token)}});
  } catch { return Response.json({error:'No se pudo iniciar sesión. Intenta nuevamente.'},{status:503,headers:authHeaders}); }
}
