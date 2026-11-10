# Despliegue desde GitHub

Repositorio: https://github.com/iStrikecl/choco-vainilla
Worker existente: choco-vainilla
Rama de producción: main

## Configuración de Workers Builds

- Repositorio: iStrikecl/choco-vainilla
- Directorio raíz: /
- Rama de producción: main
- Comando de compilación: npm run build:cloudflare
- Comando de despliegue: npm run deploy:cloudflare:built
- NODE_VERSION: 22.16.0
- PNPM_VERSION: 11.25.0
- Despliegues de otras ramas: desactivados.

Cloudflare debe tener autorizada su aplicación GitHub para este repositorio. Esta configuración local no activa por sí sola la integración: se conecta desde Settings > Builds del Worker existente.

Después de conectar, cada push a main compila y publica. Un commit sin push permanece local. Las ramas de desarrollo no deben desplegarse a producción.

La compilación genera dist/client y dist/server. scripts/prepare-cloudflare.mjs aplica wrangler.cloudflare.json al archivo generado antes del despliegue. No editar dist/server/wrangler.json manualmente.

No se ejecutan migraciones ni operaciones de borrado de D1 durante el despliegue. Los cambios de esquema requieren un paso independiente y revisado.


## Acceso de administración

La administración está en /admin y usa correo y contraseña, sin registro público. Las credenciales se guardan como hash PBKDF2-SHA256 con sal aleatoria en admin_accounts; nunca se suben contraseñas al repositorio. Las sesiones duran 8 horas y se revocan al cerrar sesión o cambiar contraseña. Las APIs de escritura validan sesión y origen. Hay un máximo de 10 intentos por IP cada 15 minutos.

La migración drizzle/0001_admin_auth.sql agrega únicamente tablas de autenticación y se aplicó a la D1 existente sin modificar el catálogo. Para otra instalación, aplicar esa migración y provisionar una cuenta por un canal administrativo; no existe registro público ni recuperación automática por correo.

Prueba de integración local: con el servidor en 127.0.0.1:5173 y una cuenta descartable @example.invalid en la D1 local, ejecutar node tests/admin-auth.mjs RUTA_AL_JSON_DE_PRUEBA. El JSON debe tener email y password. La prueba cambia la contraseña de esa cuenta local, comprueba revocación y agota su límite de intentos; no modifica productos.
