import { generateSalt } from '../../users/utils';

export async function getMagicLink(
  env: Env,
  email: string,
  path: 'verify-email' | 'reset-password',
): Promise<string> {
  const magicId = generateSalt();
  const data = `${Date.now()}-${magicId}`;
  const key = await getCryptoKey(env.MAGIC_LINK_SECRET);
  const signature = await getHmacSignature(key, data);
  const hmac = createHMAC(signature);
  const token = `${data}-${hmac}`;

  await env.DB.prepare(
    `
UPDATE users
SET magicId = ?
WHERE email = ?;
`,
  )
    .bind(magicId, email)
    .run();

  return `${env.CLIENT_URL}/${path}/${token}`;
}

export async function getEmailFromMagicLinkToken(
  env: Env,
  token: string,
): Promise<string | null> {
  const [timestamp, magicId, actualHmac] = token.split('-');
  if (
    timestamp === undefined ||
    magicId === undefined ||
    actualHmac === undefined
  ) {
    return null;
  }

  const timestampInt = Number.parseInt(timestamp, 10);
  if (Number.isNaN(timestampInt)) {
    return null;
  }

  const data = `${timestamp}-${magicId}`;
  const key = await getCryptoKey(env.MAGIC_LINK_SECRET);
  const signature = await getHmacSignature(key, data);
  const expectedHmac = createHMAC(signature);
  const tokenAge = Date.now() - timestampInt;

  if (
    actualHmac === expectedHmac &&
    tokenAge <=
      // 15 minutes
      15 * 60 * 1000
  ) {
    const email = await env.DB.prepare(
      `
SELECT email
FROM users
WHERE magicId = ?
LIMIT 1;
`,
    )
      .bind(magicId)
      .first<string>('email');

    if (email) {
      await env.DB.prepare(
        `
UPDATE users
SET magicId = NULL
WHERE email = ?;
`,
      )
        .bind(email)
        .run();

      return email;
    }
  }

  return null;
}

function getCryptoKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function getHmacSignature(key: CryptoKey, data: string): Promise<ArrayBuffer> {
  return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
}

function createHMAC(signature: ArrayBuffer): string {
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
