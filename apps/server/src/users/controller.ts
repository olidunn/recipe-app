import { CreateUserRequest } from '@recipe-app/common/src/users/schemas';
import { validateNewPassword } from '@recipe-app/common/src/users/validation';
import Elysia, { t } from 'elysia';
import { createUser } from './data';
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

      const errorMessage = validateNewPassword(password, confirmedPassword);
      if (errorMessage) {
        return status(400, errorMessage);
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
//   }).run();
// });
