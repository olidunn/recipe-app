export default {
	async fetch(request, env, ctx): Promise<Response> {
		console.log(request.url);
		if (request.url === '/oliver') {
			return new Response('Hello Oliver!');
		}

		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
