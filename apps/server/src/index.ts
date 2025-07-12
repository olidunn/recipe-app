import { Recipe } from './types';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// CORS - Cross Origin Resource Sharing
		// Blocks or allows browser requests based on origin, method, and headers
		// Only really required to allow browser requests to the server from a different origin
		// The security benefits are superseded by using secure session cookies, but browsers still enforce it as a security measure.
		if (request.method === httpMethod.OPTIONS) {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': 'http://127.0.0.1:5173',
					'Access-Control-Allow-Methods': 'GET, POST, DELETE',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Max-Age': '86400', // Cache for 1 day
				},
			});
		}

		// GET RECIPES
		if (url.pathname === '/recipes' && request.method === httpMethod.GET) {
			const headers = createHeaders({ contentType: 'application/json' });
			const recipesResult = await env.DB.prepare('SELECT * FROM recipes').all();
			const recipes = recipesResult.results;

			return new Response(JSON.stringify(recipes), {
				headers,
			});
		}

		// Error messages
		const errors = {
			recipeNameExists: 'This recipe name already exists, please choose a different name.',
			nameStepsRequired: 'Recipe name and steps are required.',
		};

		// GET RECIPE
		const recipeIdPattern = /\d+/;
		const recipeIdMatch = url.pathname.match(recipeIdPattern);
		if (recipeIdMatch && request.method === httpMethod.GET) {
			const headers = createHeaders({ contentType: 'application/json' });
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
				`INSERT INTO recipes (name, steps, servingSize, ingredients)
				VALUES (?, ?, ?, ?);
				`
			)
				.bind(name, steps.toString(), servingSize, ingredients.toString())
				.run();

			const headers = createHeaders({ contentType: 'application/json' });
			return new Response(null, { status: 201, headers });
		}

		// UPDATE RECIPE
		if (recipeIdMatch && request.method === httpMethod.POST) {
			const recipeId = recipeIdMatch[0];

			const { name, steps, servingSize, ingredients } = await request.json<Recipe>();
			await env.DB.prepare(
				`UPDATE recipes 
				SET name = ?,
				steps = ?,
				servingSize = ?,
				ingredients = ?
				WHERE id == ?;
				`
			)
				.bind(name, steps.toString(), servingSize, ingredients.toString(), recipeId)
				.run();

			const headers = createHeaders({ contentType: 'application/json' });
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

			const headers = createHeaders({ contentType: 'application/json' });
			return new Response(null, { status: 204, headers });
		}

		// DELETE RECIPES
		if (url.pathname === '/recipes' && request.method === httpMethod.DELETE) {
			await env.DB.prepare(
				`
				DELETE FROM recipes;
				`
			).run();

			const headers = createHeaders({ contentType: 'application/json' });
			return new Response(null, { status: 204, headers });
		}

		return new Response(null, { status: 404 });
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

function createHeaders(options?: { contentType?: MimeType }): Headers {
	const headers = new Headers();

	// CORS - Cross Origin Resource Sharing
	headers.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
	headers.set('Access-Control-Allow-Credentials', 'true');

	if (options?.contentType) {
		headers.set('Content-Type', options.contentType);
	}

	return headers;
}
