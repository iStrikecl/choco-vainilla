import {isCatalogAdmin} from '../../lib/catalog-server';
import {getChatGPTUser,chatGPTSignInPath} from '../chatgpt-auth';
import Admin from './editor';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getChatGPTUser();if(!user)return <main className="admin-gate"><a className="footer-brand" href="/">choco vainilla.</a><h1>Tu pastelería,<br/><em>a tu manera.</em></h1><p>Entra con la cuenta autorizada para cambiar productos, fotos y precios.</p><a className="primary" href={chatGPTSignInPath('/admin')} target="_top">Entrar a administrar →</a><a href="/">Volver a la tienda</a></main>;if(!await isCatalogAdmin())return <main className="admin-gate"><h2>Esta cuenta no tiene acceso de edición.</h2><p>La administración está disponible solo para las cuentas autorizadas.</p><a className="primary" href="/">Volver a la tienda</a></main>;return <Admin/>}
