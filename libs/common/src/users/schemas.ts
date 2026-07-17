import { Type } from '@sinclair/typebox';
import type { Static } from 'elysia';
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

export const LoginRequestSchema = Type.Object({
  email: EmailAddress,
  password: Password,
});
export type LoginRequest = Static<typeof LoginRequestSchema>;

export const EmailRequest = t.Object({
  email: EmailAddress,
});

export const CreateUserRequestSchema = t.Composite([
  LoginRequestSchema,
  t.Object({
    confirmedPassword: Password,
    name: Name,
  }),
]);
export type CreateUserRequest = Static<typeof CreateUserRequestSchema>;

export const ChangePasswordRequest = t.Object({
  newPassword: Password,
  currentPassword: Password,
  confirmedPassword: Password,
});

export const ResetPasswordRequest = t.Object({
  password: Password,
  confirmedPassword: Password,
  token: t.String(),
});

export const AuthenticationErrorSchema = t.Union([
  t.Literal('invalidEmailOrPassword'),
  t.Literal('emailIsNotVerified'),
]);

export type AuthenticationError = Static<typeof AuthenticationErrorSchema>;
