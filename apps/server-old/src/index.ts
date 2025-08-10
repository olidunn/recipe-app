import { resolve } from 'path';
import { CreateAccountRequest, Recipe } from './types';
import { passwordMaxLength, passwordMinLength } from './users/constants';
import { generateSalt, hashPassword } from './users/utils';
import { create } from 'domain';

export default {
  async fetch(request, env, ctx): Promise<Response> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const url = new URL(request.url);

    // CORS - Cross Origin Resource Sharing
    // Blocks or allows browser requests based on origin, method, and headers
    // Only really required to allow browser requests to the server from a different origin
    // The security benefits are superseded by using secure session cookies, but browsers still enforce it as a security measure.
    if (request.method === httpMethod.OPTIONS) {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': env.CLIENT_URL,
          'Access-Control-Allow-Methods': 'GET, POST, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400', // Cache for 1 day
        },
      });
    }

    // GET RECIPES
    if (url.pathname === '/recipes' && request.method === httpMethod.GET) {
      const headers = createHeaders(env, { contentType: 'application/json' });
      const recipesResult = await env.DB.prepare('SELECT * FROM recipes').all();
      const recipes = recipesResult.results;

      return new Response(JSON.stringify(recipes), {
        headers,
      });
    }

    // GET RECIPE
    const recipeIdPattern = /\d+/;
    const recipeIdMatch = url.pathname.match(recipeIdPattern);
    if (recipeIdMatch && request.method === httpMethod.GET) {
      const headers = createHeaders(env, { contentType: 'application/json' });
      const recipeId = recipeIdMatch[0];

      // We use bind to sanitize the data coming into the query and prevent SQL injection attacks.
      const recipe = await env.DB.prepare(
        `
SELECT * FROM recipes
WHERE id = ?
LIMIT 1;
`
      )
        .bind(recipeId)
        .first<{ name: string; steps: string; servingSize: number; ingredients: string }>();

      if (!recipe) {
        return new Response(JSON.stringify({ message: 'Recipe not found' }), { status: 404 });
      }
      const mappedRecipe: Recipe = {
        name: recipe.name,
        steps: recipe.steps.split(','),
        servingSize: recipe.servingSize,
        ingredients: recipe.ingredients.split(','),
      };

      return new Response(JSON.stringify(mappedRecipe), {
        headers,
      });
    }

    // CREATE RECIPE
    if (url.pathname === '/recipes' && request.method === httpMethod.POST) {
      const { name, steps, servingSize, ingredients } = await request.json<Recipe>();
      await env.DB.prepare(
        `
INSERT INTO recipes (name, steps, servingSize, ingredients)
VALUES (?, ?, ?, ?);
				`
      )
        .bind(name, steps.toString(), servingSize, ingredients.toString())
        .run();

      const headers = createHeaders(env, { contentType: 'application/json' });
      return new Response(null, { status: 201, headers });
    }

    // UPDATE RECIPE
    if (recipeIdMatch && request.method === httpMethod.POST) {
      const recipeId = recipeIdMatch[0];

      const { name, steps, servingSize, ingredients } = await request.json<Recipe>();
      await env.DB.prepare(
        `
UPDATE recipes 
SET name = ?,
steps = ?,
servingSize = ?,
ingredients = ?
WHERE id == ?;
`
      )
        .bind(name, steps.toString(), servingSize, ingredients.toString(), recipeId)
        .run();

      const headers = createHeaders(env, { contentType: 'application/json' });
      return new Response(null, { status: 201, headers });
    }

    // DELETE RECIPE
    if (recipeIdMatch && request.method === httpMethod.DELETE) {
      const recipeId = recipeIdMatch[0];
      await env.DB.prepare(
        `
DELETE FROM recipes
WHERE id = ?;
`
      )
        .bind(recipeId)
        .run();

      const headers = createHeaders(env, { contentType: 'application/json' });
      return new Response(null, { status: 200, headers });
    }

    // DELETE RECIPES
    if (url.pathname === '/recipes' && request.method === httpMethod.DELETE) {
      await env.DB.prepare(
        `
DELETE FROM recipes;
`
      ).run();

      const headers = createHeaders(env, { contentType: 'application/json' });
      return new Response(null, { status: 200, headers });
    }

    // CREATE ACCOUNT
    if (url.pathname === '/create-account' && request.method === httpMethod.POST) {
      const { name, email, password, confirmPassword } = await request.json<CreateAccountRequest>();

      if (password !== confirmPassword) {
        return new Response('You must enter the same password twice.', { status: 400 });
      }

      if (password.length < passwordMinLength) {
        return new Response(`Password must be at least ${passwordMinLength} characters long.`, { status: 400 });
      }

      if (password.length >= passwordMaxLength) {
        return new Response(`Password must be less than ${passwordMaxLength} characters long.`, { status: 400 });
      }

      const passwordSalt = generateSalt();
      const passwordHash = await hashPassword(password, passwordSalt);

      await env.DB.prepare(
        `
INSERT INTO users (name, email, passwordSalt, passwordHash)
VALUES (?, ?, ?, ?);
`
      )
        .bind(name, email, passwordSalt, passwordHash)
        .run();

      const headers = createHeaders(env, { contentType: 'application/json' });
      return new Response(null, { status: 200, headers });
    }

    // LOGIN
    if (url.pathname === '/login' && request.method === httpMethod.POST) {
      const { email, password } = await request.json<{ email: string; password: string }>();

      const passwordSalt = generateSalt();
      const passwordHash = await hashPassword(password, passwordSalt);

      const user = await env.DB.prepare(
        `
SELECT email, passwordSalt, passwordHash
FROM users
WHERE email = ?
LIMIT 1;
`
      )
        .bind(email)
        .first<{ email: string; passwordSalt: string; passwordHash: string }>();

      const headers = createHeaders(env, { contentType: 'application/json' });

      if (!user) {
        return new Response("Hmm, that didn't work. Check your email and password.", { status: 400, headers });
      }

      const hashedPassword = await hashPassword(password, user.passwordSalt);

      if (hashedPassword !== user.passwordHash) {
        return new Response("Hmm, that didn't work. Check your email and password.", { status: 400, headers });
      }
    }

    const headers = createHeaders(env, { contentType: 'application/json' });
    return new Response(null, { status: 404, headers });
  },
} satisfies ExportedHandler<Env>;

const httpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

type MimeType = 'application/json';

function createHeaders(env: Env, options?: { contentType?: MimeType }): Headers {
  const headers = new Headers();

  // CORS - Cross Origin Resource Sharing
  headers.set('Access-Control-Allow-Origin', env.CLIENT_URL);
  headers.set('Access-Control-Allow-Credentials', 'true');

  if (options?.contentType) {
    headers.set('Content-Type', options.contentType);
  }

  return headers;
}
