import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';
import packageJson from '../package.json';
import { recipesController } from './recipes/controller';
import { usersController } from './users/controller';
import '@recipe-app/common/typebox-error-messages.global';

function createServer(env: Env) {
  return new Elysia({
    aot: false,
    // added because of this issue: https://github.com/elysiajs/elysia/issues/1254
    normalize: false,
  })
    .decorate('env', env)
    .use(
      cors({
        origin: env.CLIENT_URL,
        aot: false,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    )
    .onRequest(async () => {
      if (env.ENVIRONMENT === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    })
    .use(
      swagger({
        documentation: {
          servers: [
            {
              url: env.SERVER_URL,
              description: 'Development',
            },
          ],
          info: {
            title: packageJson.name,
            description: 'API Documentation',
            version: packageJson.version,
          },
        },
      }),
    )
    .use(usersController)
    .use(recipesController);
}

export default {
  fetch(request, env, _ctx) {
    const server = createServer(env);
    return server.handle(request);
  },
} satisfies ExportedHandler<Env>;

export type Server = ReturnType<typeof createServer>;
