import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base='http://127.0.0.1:5173',account=JSON.parse(readFileSync(process.argv[2]));
assert.ok(account.email.endsWith('@example.invalid'), 'Use only a disposable local test account.');
async function call(path,method='GET',body,cookie,origin=base){return fetch(base+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});}
assert.equal((await call('/api/admin/catalog')).status,403);
assert.equal((await call('/api/admin/login','POST',account,undefined,'https://evil.invalid')).status,403);
assert.equal((await call('/api/admin/login','POST',{...account,password:'incorrect'})).status,401);
const r=await call('/api/admin/login','POST',account);assert.equal(r.status,200,await r.clone().text());const set=r.headers.get('set-cookie');assert.match(set,/HttpOnly/);assert.match(set,/Secure/);assert.match(set,/SameSite=Strict/);const cookie=set.split(';')[0];
const catalog=await call('/api/admin/catalog','GET',undefined,cookie);assert.equal(catalog.status,200);assert.equal((await catalog.json()).products.length,4);
assert.equal((await call('/api/admin/password','POST',{currentPassword:account.password,password:account.password+'-new'},cookie)).status,200);
assert.equal((await call('/api/admin/catalog','GET',undefined,cookie)).status,403);
assert.equal((await call('/api/admin/login','POST',account)).status,401);
const updated=await call('/api/admin/login','POST',{...account,password:account.password+'-new'});assert.equal(updated.status,200);const newCookie=updated.headers.get('set-cookie').split(';')[0];
assert.equal((await call('/api/admin/logout','POST',undefined,newCookie)).status,200);assert.equal((await call('/api/admin/catalog','GET',undefined,newCookie)).status,403);
let limited=false;for(let i=0;i<11;i++){const x=await call('/api/admin/login','POST',account);if(x.status===429){limited=true;break;}}assert.ok(limited);
console.log('PASS: anonymous access, CSRF, bad password, login, cookie flags, authenticated catalog, password rotation, revocation, logout and rate limit.');

