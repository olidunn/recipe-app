# Recipe app

- [Recipe app](#recipe-app)
  - [Setup](#setup)
  - [Development](#development)
  - [Commands](#commands)
  - [Testing](#testing)
    - [Testing emails](#testing-emails)
  - [Database (Cloudflare D1)](#database-cloudflare-d1)
    - [Query](#query)
    - [Migration](#migration)
  - [Generate types](#generate-types)

## Setup

- Create `apps/client/.env` with the following content:

  ```env
  VITE_SERVER_URL
  ```

- Create `apps/server/.env` with the following content:

  ```env
  SESSION_COOKIE_SECRET=<your secret here>
  MAGIC_LINK_SECRET=<your secret here>
  AHASEND_API_KEY=<your key here>
  AHASEND_ACCOUNT_ID=<your accountId here>
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

## Commands

| Command                             | Description                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `bun i`                             | Install deps across all packages                                                                                       |
| `bun dev`                           | Start all packages                                                                                                     |
| `bun <add / remove> <package-name>` | Add or remove a package to the closest package.json file                                                               |
| `bun unit-tests`                    | Run unit tests on all packages                                                                                         |
| `bun typecheck`                     | Run type checking on all packages                                                                                      |
| `bun typegen`                       | Generate types for all packages. You will need to rerun `generate-types` whenever you make changes to `wrangler.toml`. |

## Testing

### Testing emails

We use mailpit to test emails.
The Mailpit web UI listens by default on http://0.0.0.0:8025 and the SMTP port on http://0.0.0.0:1025.

Install:

```sh
brew install mailpit
```

Start:

```sh
brew services start mailpit
```

## Database (Cloudflare D1)

### Query

These commands can be formatted as json via `--json`

Query a database from text:

```sh
bunx wrangler d1 execute DB --command "<sql here>"
```

Query a database from a file:

```sh
bunx wrangler d1 execute DB --file <path to file>
```

### Migration

List available migrations:

```sh
bunx wrangler d1 migrations list DB
```

Apply available migrations:

```sh
bunx wrangler d1 migrations apply DB
```

Create a migration:

```sh
bunx wrangler d1 migrations create DB <migration_name>
```

## Generate types

Generate types for your Cloudflare bindings in `wrangler.jsonc` (must be within server folder):

```sh
bun typegen
```

You will need to rerun `bun typegen` whenever you make changes to `wrangler.jsonc`.
