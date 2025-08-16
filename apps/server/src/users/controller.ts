import Elysia, { t } from 'elysia';
import { passwordMaxLength, passwordMinLength } from './constants';
import { createUser } from './data';
import { CreateUserRequest } from './schemas';
import { generateSalt, hashPassword } from './utils';

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

      if (password !== confirmedPassword) {
        return status(400, 'You must enter the same password twice.');
      }

      if (password.length < passwordMinLength) {
        return status(
          400,
          `Password must be at least ${passwordMinLength} characters long.`,
        );
      }

      if (password.length >= passwordMaxLength) {
        return status(
          400,
          `Password must be less than ${passwordMaxLength} characters long.`,
        );
      }

      const passwordSalt = generateSalt();
      const passwordHash = await hashPassword(password, passwordSalt);

      await createUser(env, {
        email,
        name,
        passwordHash,
        passwordSalt,
      }).run();
    },
    {
      body: CreateUserRequest,
      response: {
        200: t.Void(),
        400: t.String(),
      },
    },
  );
  // .post('/login', async ({ env, body }) => {
  //   const { email, password } = body;

  //   const passwordSalt = generateSalt();
  //   const passwordHash = await hashPassword(password, passwordSalt);

  //   const user = await getUserByEmail(env, email).first();

  //   if (!user) {
  //     return status(
  //       400,
  //       "Hmm, that didn't work. Check your email and password.",
  //     );
  //   }

  //   const hashedPassword = await hashPassword(password, user.passwordSalt);

  //   if (hashedPassword !== user.passwordHash) {
  //     return new Response(
  //       "Hmm, that didn't work. Check your email and password.",
  //       { status: 400 },
  //     );
  //   }

  //   await getUserByEmail(env, {
  //     email,
  //     hashedPassword,
  //   }).run();
  // });
