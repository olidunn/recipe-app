-- Migration number: 0006 	 2026-04-26T04:16:55.418Z
ALTER TABLE users
ADD COLUMN magicId TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS index_users_magicId ON users (magicId)
WHERE
    magicId IS NOT NULL;