-- Migration number: 0005 	 2026-03-15T01:12:49.607Z
ALTER TABLE recipes ADD COLUMN preparationMinutes INTEGER;
ALTER TABLE recipes ADD COLUMN cookingMinutes INTEGER;