export type Recipe = {
  name: string;
  steps: string[];
  servingSize: number;
  ingredients: string[];
};

export type CreateAccountRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
