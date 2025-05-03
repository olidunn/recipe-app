-- Migration number: 0001 	 2025-05-03T07:38:18.114Z
CREATE TABLE IF NOT EXISTS
    users (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        emailIsVerified BOOLEAN NOT NULL DEFAULT FALSE,
        name TEXT NOT NULL,
        passwordSalt TEXT NOT NULL,
        passwordHash TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (unixepoch()),
        updatedAt DATETIME NOT NULL DEFAULT (unixepoch())
    );

CREATE INDEX IF NOT EXISTS index_users_email ON users (email);

CREATE TRIGGER IF NOT EXISTS trigger_users_set_updatedAt_before_update BEFORE
UPDATE ON users FOR EACH ROW BEGIN
UPDATE users
SET
    updatedAt = unixepoch()
WHERE
    id = NEW.id;

END;

CREATE TRIGGER IF NOT EXISTS trigger_users_prevent_createdAt_update BEFORE
UPDATE OF createdAt ON users BEGIN
SELECT
    RAISE (
        ABORT,
        'Modification of "createdAt" is not allowed.'
    );

END;