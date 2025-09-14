-- Migration number: 0003 	 2025-09-14T04:25:28.671Z
CREATE TABLE
    IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY NOT NULL,
        userId INTEGER NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (unixepoch ()),
        lastSeenAt DATETIME NOT NULL DEFAULT (unixepoch ()),
        expiresAt DATETIME NOT NULL,
        city TEXT,
        region TEXT,
        countryCode TEXT,
        userAgent TEXT,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE INDEX IF NOT EXISTS index_sessions_lastSeenAt ON sessions (userId, lastSeenAt DESC);

CREATE INDEX IF NOT EXISTS index_sessions_expiresAt ON sessions (expiresAt);