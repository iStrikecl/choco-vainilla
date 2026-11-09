declare namespace Cloudflare {
  interface Env {
    CATALOG_ADMIN_EMAILS?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
