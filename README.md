# Recipe app

## Development

Run the client (Vite server) locally:

```sh
npm run dev
```

Run the server (Cloudflare worker) locally:

```sh
npm run dev
```

## Database (Cloudflare D1)

### Query

These commands can be formatted as json via `--json`

Query a database from text:

```sh
wrangler d1 execute recipe-app-db --command "<sql here>"
```

Query a database from a file:

```sh
wrangler d1 execute recipe-app-db --file <path to file>
```

### Migration

List available migrations:

```sh
wrangler d1 migrations list recipe-app-db
```

Apply available migrations:

```sh
wrangler d1 migrations apply recipe-app-db
```

Create a migration:

```sh
 wrangler d1 migrations create recipe-app-db <migration_name>
```

## Generate types

Generate types for your Cloudflare bindings in `wrangler.toml` (must be within server folder):

```sh
npm run cf-typegen
```

You will need to rerun `cf-typegen` whenever you make changes to `wrangler.toml`.

## Deployment

> [!WARNING]  
> Cloudflare does _not_ use `wrangler.toml` to configure deployment bindings.
> You **MUST** [configure deployment bindings manually in the Cloudflare dashboard][bindings].

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

[bindings]: https://developers.cloudflare.com/pages/functions/bindings/

