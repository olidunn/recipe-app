export const passwordMinLength = 12;
export const passwordMaxLength = 64;
/**
 * 3 months in seconds
 */
export const sessionMaxAge = 60 * 60 * 24 * 30 * 3;

export const errorMessage = {
  passwordsMustMatch: 'You must enter the same password twice.',
  newPasswordMustBeDifferent:
    'Your new password must be different to your current password.',
};
