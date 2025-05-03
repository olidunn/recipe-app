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

		// GET RECIPE
		// TODO: Add a route to get a single recipe by name

		// GET RECIPES
		if (url.pathname === '/recipes' && request.method === httpMethod.GET) {
			const headers = createHeaders({ contentType: 'application/json' });

			return new Response(JSON.stringify(recipes), {
				headers,
			});
		}

		// CREATE RECIPE
		if (url.pathname === '/recipe' && request.method === httpMethod.POST) {
			const headers = createHeaders({ contentType: 'application/json' });
			recipes.push(await request.json());
			return new Response(null, { status: 201, headers });
		}

		// DELETE RECIPE - remember to use the query params (search params) e.g. "/recipe?name=Pasta"
		if (url.pathname === '/recipe' && request.method === httpMethod.DELETE) {
			const name = url.searchParams.get('name');
			if (!name) {
				return new Response(JSON.stringify({ message: "Expected to find search param 'name'" }), { status: 400 });
			}

			const headers = createHeaders({ contentType: 'application/json' });
			recipes = recipes.filter((recipe) => recipe.name !== url.searchParams.get('name'));
			return new Response(null, { status: 204, headers });
		}

		// DELETE RECIPES
		if (url.pathname === '/recipes' && request.method === httpMethod.DELETE) {
			recipes = [];
			await new Promise((resolve) => setTimeout(resolve, 2000));
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
