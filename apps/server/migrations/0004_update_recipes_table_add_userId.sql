-- Migration number: 0004 	 2025-09-14T08:50:31.802Z
PRAGMA defer_foreign_keys = ON;

PRAGMA foreign_keys = OFF;

PRAGMA ignore_check_constraints = ON;

-- 1. Create new table with the new userId foreign key constraint
CREATE TABLE
    IF NOT EXISTS recipes_new (
        id INTEGER PRIMARY KEY,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        steps TEXT NOT NULL,
        servingSize INTEGER,
        ingredients TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT (unixepoch ()),
        updatedAt DATETIME NOT NULL DEFAULT (unixepoch ()),
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE INDEX IF NOT EXISTS index_recipes_name ON recipes_new (name);

-- 2. No data anyway, so skip copying data step.
-- 3. Drop old table
DROP TABLE recipes;

-- 4. Rename new into old.
ALTER TABLE recipes_new
RENAME TO recipes;

PRAGMA defer_foreign_keys = OFF;

PRAGMA foreign_keys = ON;

PRAGMA ignore_check_constraints = OFF;