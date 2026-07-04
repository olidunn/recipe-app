import type { AuthenticationErrorSchema } from '@recipe-app/common';
import { passwordMaxLength } from '@recipe-app/common';
import type { Static } from 'elysia';

export type UserSchema = {
  readonly id: number;
  email: string;
  emailIsVerified: boolean;
  name: string;
  passwordSalt: string;
  passwordHash: string;
};

type SuccessResult = {
  failed: false;
  name: string;
  userId: number;
};

type ErrorResult = {
  failed: true;
  error: Static<typeof AuthenticationErrorSchema>;
};

export async function authenticate(
  env: Env,
  email: string,
  password: string,
): Promise<SuccessResult | ErrorResult> {
  const user = await env.DB.prepare(
    `
SELECT id, name, emailIsVerified, passwordHash, passwordSalt
FROM users
WHERE email = ?
LIMIT 1;`,
  )
    .bind(email)
    .first<
      Pick<
        UserSchema,
        'id' | 'name' | 'emailIsVerified' | 'passwordHash' | 'passwordSalt'
      >
    >();

  if (!user) {
    return {
      failed: true,
      error: 'invalidEmailOrPassword',
    };
  }

  if (!user.emailIsVerified) {
    return {
      failed: true,
      error: 'emailIsNotVerified',
    };
  }

  const generatedHash = await hashPassword(password, user.passwordSalt);

  if (generatedHash !== user.passwordHash) {
    return {
      failed: true,
      error: 'invalidEmailOrPassword',
    };
  }

  return {
    failed: false,
    name: user.name,
    userId: user.id,
  };
}

export function generateSalt(length = 16): string {
  return (
    Array.from(crypto.getRandomValues(new Uint8Array(length)))
      // Convert to hexadecimal representation
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  );
}

// On create account:
// 1. Get password from user input
// jaspers password = password1234

// 2. Generate a salt
// jaspers salt = df87gfrh8h49uhg9efi3ig03

// 3. Hash the password with the salt
// crypto(password, salt) => lkjwef98734gf8ewgh8b293fuhe (hashed password)

// 4. Store the salt and the hashed password in the database
// salt                     | password
// df87gfrh8h49uhg9efi3ig03 | lkjwef98734gf8ewgh8b293fuhe

// 5. When a user logs in, how do we know if the password is correct?
// if(crypto(attemptedPassword, salt) === lkjwef98734gf8ewgh8b293fuhe) { return true; }

export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  if (password.length > passwordMaxLength) {
    throw new Error(
      `Password must not be longer than ${passwordMaxLength} characters.`,
    );
  }

  // Encode password and salt as UTF-8
  const enc = new TextEncoder();
  const passwordData = enc.encode(password);
  const saltData = enc.encode(salt);

  // Create the base key using the password
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );

  // Derive the key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    256, // 256 bits = 32 bytes
  );

  // Convert the derived bits to a hexadecimal string
  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
