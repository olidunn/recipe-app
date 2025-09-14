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

export const LoginRequest = t.Object({
  email: EmailAddress,
  password: Password,
});

export const EmailRequest = t.Object({
  email: EmailAddress,
});

export const CreateUserRequest = t.Composite([
  LoginRequest,
  t.Object({
    confirmedPassword: Password,
    name: Name,
  }),
]);

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
