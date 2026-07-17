import {
  AuthenticationErrorSchema,
  CreateUserRequest,
  LoginRequest,
  sessionMaxAge,
  validateNewPassword,
} from '@recipe-app/common';
import Elysia, { t } from 'elysia';
import { D1_ERROR } from '../common/utils/d1';
import { getErrorMessage } from '../common/utils/error';
import {
  getEmailFromMagicLinkToken,
  getMagicLink,
} from '../common/utils/magic-link';
import { sendEmail } from '../email/utils';
import { createUser } from './data';
import { OptionalSessionCookie } from './schemas';
import { authenticate, generateSalt, hashPassword } from './utils';

export const usersController = new Elysia({
  name: 'users',
  tags: ['Users'],
  prefix: '/users',
})
  .decorate('env', {} as Env)
  .post(
    '/create-account',
    async ({ env, status, body }) => {
      const { email, name, password, confirmedPassword } = body;

      const errorMessage = validateNewPassword(password, confirmedPassword);
      if (errorMessage) {
        return status(400, errorMessage);
      }

      const passwordSalt = generateSalt();
      const passwordHash = await hashPassword(password, passwordSalt);

      try {
        await createUser(env, {
          email,
          name,
          passwordHash,
          passwordSalt,
        }).run();
      } catch (error) {
        const message = getErrorMessage(error);

        if (message.startsWith(D1_ERROR.UNIQUE_CONSTRAINT_FAILED)) {
          return;
        }

        return status(500, 'Failed to create account.');
      }

      const magicLink = await getMagicLink(env, email, 'verify-email');

      const emailResponse = await sendEmail(env, {
        type: 'VerifyEmailAddress',
        link: magicLink,
        recipient: { email, name },
      });
      if (emailResponse.errorOccurred) {
        return status(500, 'Failed to send verification email');
      }
    },
    {
      body: CreateUserRequest,
      response: {
        200: t.Void(),
        400: t.String(),
        500: t.String(),
      },
    },
  )
  .post(
    '/verify-email/:token',
    async ({ env, params }) => {
      const email = await getEmailFromMagicLinkToken(env, params.token);

      if (!email) {
        return { emailIsVerified: false };
      }

      await env.DB.prepare(`
    UPDATE users
    SET emailIsVerified = 1
    WHERE email = ?;
  `)
        .bind(email)
        .run();

      return { emailIsVerified: true };
    },
    {
      params: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.Object({ emailIsVerified: t.Boolean() }),
      },
    },
  )
  .post(
    '/resend-verification-email',
    async ({ status, body, env }) => {
      const { email } = body;
      const user = await env.DB.prepare(`
      SELECT name, emailIsVerified
      FROM users
      WHERE email = ?
      LIMIT 1;
    `)
        .bind(email)
        .first<{
          name: string;
          emailIsVerified: number;
        }>();

      if (!user) {
        return;
      }

      if (user.emailIsVerified) {
        void sendEmail(env, {
          type: 'EmailAlreadyVerified',
          recipient: {
            email,
            name: user.name,
          },
        });
        return;
      }

      const magicLink = await getMagicLink(env, email, 'verify-email');

      const emailResponse = await sendEmail(env, {
        type: 'VerifyEmailAddress',
        link: magicLink,
        recipient: {
          email,
          name: user.name,
        },
      });

      if (emailResponse.errorOccurred) {
        return status(500, 'Failed to send verification email');
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
      response: {
        200: t.Void(),
        500: t.String(),
      },
    },
  )
  .post(
    '/login',
    async ({ status, body, env, cookie, request }) => {
      const { email, password } = body;
      const authentication = await authenticate(env, email, password);

      if (authentication.failed) {
        return status(400, authentication.error);
      }

      const sessionId = crypto.randomUUID();
      await env.DB.prepare(
        `
INSERT INTO sessions (id, userId, expiresAt, city, region, countryCode, userAgent)
VALUES (?, ?, ?, ?, ?, ?, ?);
`,
      )
        .bind(
          sessionId,
          authentication.userId,
          Math.ceil(Date.now() / 1000 + sessionMaxAge),
          request.cf?.city || null,
          request.cf?.region || null,
          request.cf?.country || null,
          request.headers.get('user-agent') || null,
        )
        .run();

      cookie.session.set({
        path: '/',
        httpOnly: true,
        sameSite: true,
        secure: env.ENVIRONMENT === 'production',
        secrets: [env.SESSION_COOKIE_SECRET],
        maxAge: sessionMaxAge,
        value: sessionId,
      });
    },
    {
      body: LoginRequest,
      cookie: OptionalSessionCookie,
      response: {
        200: t.Void(),
        400: AuthenticationErrorSchema,
      },
    },
  )
  .get(
    '/authenticated',
    async ({ env, set, cookie: { session } }) => {
      set.headers['cache-control'] = 'no-store';

      if (!session?.value) {
        return false;
      }

      const [sessionResult] = await env.DB.batch([
        env.DB.prepare(
          `
SELECT 1
FROM sessions
WHERE id = ?
LIMIT 1;
`,
        ).bind(session.value),
        env.DB.prepare(
          `
UPDATE sessions
SET lastSeenAt = ?
WHERE id = ?;
`,
        ).bind(Math.ceil(Date.now() / 1000), session.value),
      ]);

      if (sessionResult?.results.length === 1) {
        return true;
      }

      session.remove();
      return false;
    },
    {
      response: {
        200: t.Boolean(),
      },
    },
  )
  .macro({
    authenticated: {
      async resolve({ status, cookie: { session }, env }) {
        if (!session?.value) {
          return status(401, null);
        }

        const userId = await env.DB.prepare(
          `
SELECT userId
FROM sessions
WHERE id = ?
LIMIT 1;
`,
        )
          .bind(session.value)
          .first<number>('userId');

        if (userId) {
          return {
            userId,
          };
        }

        session.remove();
        return status(401, null);
      },
    },
  })
  .guard({
    as: 'global',
    authenticated: true,
    cookie: OptionalSessionCookie,
    response: {
      401: t.Void(),
    },
  })
  .post(
    '/logout',
    async ({ env, cookie: { session }, userId }) => {
      await env.DB.prepare(
        `
DELETE FROM sessions
WHERE id = ?
AND userId = ?;
`,
      )
        .bind(session.value, userId)
        .run();

      session.remove();
    },
    {
      response: { 200: t.Void() },
    },
  )
  .delete(
    '/delete-account',
    async ({ env, cookie: { session }, userId }) => {
      await env.DB.prepare(
        `
DELETE FROM users
WHERE id = ?;
`,
      )
        .bind(userId)
        .run();

      session.remove();
    },
    {
      response: {
        200: t.Void(),
      },
    },
  );
