import {env} from 'cloudflare:workers';
import {authHeaders,currentAdmin,rateLimit,readAuthBody,sessionCookie} from '../../../../lib/admin-auth';
import {passwordHash,randomToken,verifyPassword} from '../../../../lib/password';
import {sameOrigin} from '../../../../lib/catalog-server';
export async function POST(request:Request) {
  if(!sameOrigin(request)) return new Response(null,{status:403,headers:authHeaders});
  try {
    const user=await currentAdmin();
    if(!user) return Response.json({error:'Inicia sesión nuevamente.'},{status:401,headers:authHeaders});
    if(!await rateLimit(request,'password')) return Response.json({error:'Demasiados intentos. Espera 15 minutos.'},{status:429,headers:authHeaders});
    const body=await readAuthBody(request);
    if(typeof body.currentPassword!=='string'||body.currentPassword.length>128||typeof body.password!=='string'||body.password.length<12||body.password.length>128)
      return Response.json({error:'Usa una contraseña de entre 12 y 128 caracteres.'},{status:400,headers:authHeaders});
    const account=await env.DB!.prepare('SELECT password_hash,salt FROM admin_accounts WHERE email=?').bind(user.email).first<{password_hash:string;salt:string}>();
    if(!account||!await verifyPassword(body.currentPassword,account.salt,account.password_hash)) return Response.json({error:'La contraseña actual es incorrecta.'},{status:401,headers:authHeaders});
    const salt=randomToken();
    await env.DB!.batch([
      env.DB!.prepare('UPDATE admin_accounts SET password_hash=?,salt=? WHERE email=?').bind(await passwordHash(body.password,salt),salt,user.email),
      env.DB!.prepare('DELETE FROM admin_sessions WHERE email=?').bind(user.email)
    ]);
    return Response.json({ok:true},{headers:{...authHeaders,'Set-Cookie':sessionCookie('',0)}});
  } catch { return Response.json({error:'No se pudo cambiar la contraseña.'},{status:503,headers:authHeaders}); }
}
