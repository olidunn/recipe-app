import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';
import packageJson from '../package.json';
import { recipesController } from './recipes/controller';

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
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        // Allowed headers are currently bugged: https://github.com/elysiajs/elysia/issues/1342
        // allowedHeaders: ['Content-Type'],
        aot: false,
      }),
    )
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
    .use(recipesController);
}

export default {
  fetch(request, env, _ctx) {
    const server = createServer(env);
    return server.handle(request);
  },
} satisfies ExportedHandler<Env>;
