export function createUser(
  env: Env,
  data: {
    name: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
  },
): D1PreparedStatement {
  const { name, email, passwordSalt, passwordHash } = data;

  return env.DB.prepare(
    `
INSERT INTO users (name, email, passwordSalt, passwordHash)
VALUES (?, ?, ?, ?);
`,
  ).bind(name, email, passwordSalt, passwordHash);
}

export function getUserByEmail(env: Env, email: string): D1PreparedStatement {
  return env.DB.prepare(
    `
SELECT email, passwordSalt, passwordHash
FROM users
WHERE email = ?
LIMIT 1;
`,
  ).bind(email);
}
