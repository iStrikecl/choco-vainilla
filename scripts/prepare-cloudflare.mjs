import { readFileSync, writeFileSync } from 'node:fs';
const config = JSON.parse(readFileSync('dist/server/wrangler.json', 'utf8'));
const target = JSON.parse(readFileSync('wrangler.cloudflare.json', 'utf8'));
Object.assign(config, target);
config.vars = { ...config.vars, HOSTING_PROVIDER: 'cloudflare-direct' };
config.r2_buckets = [];
writeFileSync('dist/server/wrangler.json', JSON.stringify(config, null, 2));
