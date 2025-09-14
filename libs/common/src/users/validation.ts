import { errorMessage } from './constants';

export function validateNewPassword(
  newPassword: string,
  confirmPassword: string,
): string | null {
  if (newPassword !== confirmPassword) {
    return errorMessage.passwordsMustMatch;
  }

  return null;
}

export function validateChangePassword(
  newPassword: string,
  currentPassword: string,
): string | null {
  if (newPassword === currentPassword) {
    return errorMessage.newPasswordMustBeDifferent;
  }

  return null;
}
