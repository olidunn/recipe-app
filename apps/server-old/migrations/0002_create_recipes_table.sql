-- Migration number: 0002 	 2025-05-03T07:52:14.973Z
CREATE TABLE
    recipes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        steps TEXT NOT NULL,
        servingSize INTEGER,
        ingredients TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (unixepoch ()),
        updatedAt DATETIME NOT NULL DEFAULT (unixepoch ())
    );

CREATE INDEX IF NOT EXISTS index_recipes_name ON recipes (name);