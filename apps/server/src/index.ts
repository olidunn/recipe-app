import { Recipe } from './types';

let recipes: Recipe[] = [
	{
		name: 'Pasta',
		ingredients: ['Pasta', 'Tomato Sauce'],
		steps: ['Boil water', 'Add pasta', 'Cook for 10 minutes', 'Drain pasta', 'Add sauce'],
	},
	{
		name: 'Pizza',
		ingredients: ['Dough', 'Tomato Sauce', 'Cheese'],
		steps: ['Roll out dough', 'Add sauce', 'Add cheese', 'Bake for 15 minutes'],
	},
];

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
				.first();

			if (!recipe) {
				return new Response(JSON.stringify({ message: 'Recipe not found' }), { status: 404 });
			}

			// Manually map the data to the correct type
			recipe.steps = JSON.parse(recipe.steps as string);
			recipe.ingredients = JSON.parse(recipe.ingredients as string);

			console.log({ recipe });

			return new Response(JSON.stringify(recipe), {
				headers,
			});
		}

		// TODO: implement create recipe via sql
		// Focus on create first, then do update

		// If the id is undefined, create a new recipe
		// If the id has a value, find the recipe in the database
		// If it exists, update it
		// If it doesn't exist, return a 404 saying that it doesn't exist
		// curl -X GET "http://localhost:8787/recipes"
		// curl -X POST "http://localhost:8787/recipes" -d '{"foo": "bar"}'
		// May need to set the header with -H "Content-Type: application/json"

		// CREATE/Update RECIPE
		if (url.pathname === '/recipes' && request.method === httpMethod.POST) {
			const headers = createHeaders({ contentType: 'application/json' });
			recipes.push(await request.json());
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
