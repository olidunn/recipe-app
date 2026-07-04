export const appDomain = 'recipes.oliver-dunn.com';
export const appName = 'Recipe App';

export const emailURL = `email.${appDomain}`;

export const emailAddress = {
  account: { email: `account@${emailURL}`, name: `${appName} - Account` },
  feedback: { email: `feedback@${emailURL}`, name: `${appName} - Feedback` },
  support: { email: `support@${emailURL}`, name: `${appName} - Support` },
  updates: { email: `updates@${emailURL}`, name: `${appName} - Updates` },
} as const;
