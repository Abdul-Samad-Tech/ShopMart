const PLACEHOLDER = /change_me|changeme|your_jwt|your_secret|placeholder|shophub-dev|dev-only-shopmart|example_secret|paste_your/i;

const DEV_FALLBACK = 'dev-only-shopmart-jwt-secret-not-for-production';

export function isStrongSecret(value) {
  const secret = String(value || '');
  if (secret.length < 32) return false;
  if (PLACEHOLDER.test(secret)) return false;
  return true;
}

export function assertProductionSecrets() {
  const isProd = process.env.NODE_ENV === 'production';
  const keys = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];

  if (isProd && !process.env.CLIENT_URL) {
    console.error('Refusing to start in production. Set CLIENT_URL to the shop origin.');
    process.exit(1);
  }

  if (!isProd) {
    for (const key of keys) {
      if (!isStrongSecret(process.env[key])) {
        console.warn(`[security] ${key} is missing, short, or a placeholder. Production startup will refuse this.`);
      }
    }
    return;
  }

  const weak = keys.filter((key) => !isStrongSecret(process.env[key]));
  if (weak.length) {
    console.error(
      `Refusing to start in production. Set ${weak.join(' and ')} to a random value of at least 32 characters that is not a placeholder.`
    );
    process.exit(1);
  }
}

export function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not configured');
  }
  return DEV_FALLBACK;
}
