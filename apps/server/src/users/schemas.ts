import { Type } from '@sinclair/typebox/type';
import { passwordMaxLength, passwordMinLength } from './constants';

export const Password = Type.String({
  minLength: passwordMinLength,
  maxLength: passwordMaxLength,
});

export const Name = Type.String({
  minLength: 1,
  maxLength: 50,
});

export const EmailAddress = Type.String({ format: 'email' });

export const CreateUserRequest = Type.Object({
  name: Name,
  email: EmailAddress,
  password: Password,
  confirmedPassword: Password,
});
