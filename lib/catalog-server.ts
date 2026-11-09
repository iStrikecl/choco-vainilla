import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { defaultProducts } from './catalog';
export async function isCatalogAdmin(){const user=await getChatGPTUser();const allowed=(env.CATALOG_ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);return !!user&&allowed.includes(user.email.toLowerCase())}
export async function readCatalog(){if(!env.DB)throw new Error('DB unavailable');const row=await env.DB.prepare('SELECT products,revision FROM catalogs WHERE id=?').bind('main').first<{products:string;revision:number}>();return row?{products:JSON.parse(row.products),revision:row.revision}:{products:defaultProducts,revision:0}}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin}
export const noCache={'Cache-Control':'no-store'};
