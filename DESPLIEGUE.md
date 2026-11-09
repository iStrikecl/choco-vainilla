# Despliegue desde GitHub

Repositorio: https://github.com/marcorubioq/Choco_Vainilla_DEV
Worker existente: choco-vainilla
Rama de producción: main

## Configuración de Workers Builds

- Repositorio: marcorubioq/Choco_Vainilla_DEV
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
