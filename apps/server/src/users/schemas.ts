import { t } from 'elysia';
import { passwordMaxLength, passwordMinLength } from './constants';

export const Password = t.String({
  minLength: passwordMinLength,
  maxLength: passwordMaxLength,
});

export const Name = t.String({
  minLength: 1,
  maxLength: 50,
});

export const EmailAddress = t.String({ format: 'email' });

export const CreateUserRequest = t.Object({
  name: Name,
  email: EmailAddress,
  password: Password,
  confirmedPassword: Password,
});
