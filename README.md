# Recipe app

- [Recipe app](#recipe-app)
  - [Setup](#setup)
  - [Development](#development)
  - [Database (Cloudflare D1)](#database-cloudflare-d1)
    - [Query](#query)
    - [Migration](#migration)
  - [Generate types](#generate-types)

## Setup

- Create `apps/client/.env` with the following content:
  ```env
  VITE_SERVER_URL
  ```

## Development

Run all apps (client and server) locally:

```sh
bun dev
```

Run the client (Vite server) locally:

```sh
cd apps/client && bun dev
```

Run the server (Cloudflare worker) locally:

```sh
cd apps/server && bun dev
```

## Database (Cloudflare D1)

### Query

These commands can be formatted as json via `--json`

Query a database from text:

```sh
wrangler d1 execute DB --command "<sql here>"
```

Query a database from a file:

```sh
wrangler d1 execute DB --file <path to file>
```

### Migration

List available migrations:

```sh
wrangler d1 migrations list DB
```

Apply available migrations:

```sh
wrangler d1 migrations apply DB
```

Create a migration:

```sh
 wrangler d1 migrations create DB <migration_name>
```

## Generate types

Generate types for your Cloudflare bindings in `wrangler.jsonc` (must be within server folder):

```sh
bun typegen
```

You will need to rerun `bun typegen` whenever you make changes to `wrangler.jsonc`.
