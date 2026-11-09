import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Choco Vainilla · Un antojo, un momento',description:'Propuesta de tienda online de Choco Vainilla. Catálogo y pedidos de demostración.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>}
