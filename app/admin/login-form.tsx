'use client';
import {useState} from 'react';
export default function LoginForm(){
const[error,setError]=useState(''),[busy,setBusy]=useState(false);
return <main className="admin-gate"><a className="footer-brand" href="/">choco vainilla.</a><h1>Tu pastelería,<br/><em>a tu manera.</em></h1><p>Ingresa para administrar tu catálogo.</p><form className="admin-login-form" onSubmit={async e=>{e.preventDefault();const data=new FormData(e.currentTarget);setBusy(true);setError('');try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.get('email'),password:data.get('password')})});const d=await r.json() as {error?:string};if(!r.ok)throw new Error(d.error);window.location.assign('/admin');}catch(e){setError(e instanceof Error?e.message:'No se pudo conectar.');setBusy(false);}}}><label>Correo electrónico<input name="email" type="email" autoComplete="username" required maxLength={254} placeholder="tu@correo.cl"/></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required maxLength={128}/></label>{error&&<p role="alert" className="admin-error">{error}</p>}<button className="primary" disabled={busy}>{busy?'Ingresando…':'Entrar a administrar'}</button></form><a href="/">Volver a la tienda</a></main>;
}

