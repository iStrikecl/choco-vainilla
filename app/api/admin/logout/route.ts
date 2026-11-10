import {env} from 'cloudflare:workers';
import {cookies} from 'next/headers';
import {authHeaders,SESSION_COOKIE,sessionCookie} from '../../../../lib/admin-auth';
import {digest} from '../../../../lib/password';
import {sameOrigin} from '../../../../lib/catalog-server';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null,{status:403,headers:authHeaders});
  try {
    const token=(await cookies()).get(SESSION_COOKIE)?.value;
    if(token && env.DB) await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run();
    return Response.json({ok:true},{headers:{...authHeaders,'Set-Cookie':sessionCookie('',0)}});
  } catch { return Response.json({error:'No se pudo cerrar la sesión. Vuelve a intentar.'},{status:503,headers:authHeaders}); }
}
