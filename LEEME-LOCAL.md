# Choco Vainilla — copia local del proyecto original

Código recuperado del sitio original, revisión 578e16c0489ea9c63de4a54907bd5811d05bcd9d.

Para iniciar desde esta carpeta:

    npm run dev

Luego abre http://127.0.0.1:5173/ . No se abre mediante index.html.

Las dependencias y la base de datos local ya están preparadas. El catálogo local contiene los productos de ejemplo del código original. Los datos que se hayan editado en la base de datos del sitio publicado no se descargaron. La administración del sitio publicado utiliza autenticación y permisos propios.

El diseño anterior está respaldado en ../respaldo-maqueta-inicial.

## Hosting en Cloudflare

Cuenta autorizada: marco.rubio3d@gmail.com.
Para publicar o actualizar: npm run deploy:cloudflare
Configuración persistente: wrangler.cloudflare.json y scripts/prepare-cloudflare.mjs.
Base D1 creada e inicializada: choco-vainilla-catalogo.

Publicado en https://choco-vainilla.marco-rubio3d.workers.dev . Versión: 40e2937d-02ed-4589-b8aa-c6e828a75963. El subdominio fue creado junto con este despliegue; Cloudflare indica que su activación puede tardar unos minutos.

La administración en /admin usa correo y contraseña. No se aceptan cabeceras de identidad de ChatGPT para autorizar edición. R2 no está habilitado en la cuenta; las fotografías incluidas sí se publican como archivos estáticos. El flujo de compra continúa siendo una demostración.


