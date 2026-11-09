import {readCatalog,noCache} from '../../../lib/catalog-server';
export async function GET(){try{return Response.json(await readCatalog(),{headers:noCache})}catch{return Response.json({error:'No pudimos cargar los productos. Intenta nuevamente.'},{status:503,headers:noCache})}}
