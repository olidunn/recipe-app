import type { StrictOverride } from '@recipe-app/common';
import type { Email } from './schemas';

type EmailType =
  | 'VerifyEmailAddress'
  | 'ResetPassword'
  | 'AccountCreationAttempt'
  | 'EmailAlreadyVerified';

export type EmailData =
  | VerifyEmailAddressData
  | ResetPasswordData
  | AccountCreationAttemptData
  | EmailAlreadyVerifiedData;

type BaseEmailData = {
  type: EmailType;
  recipient: Email['recipients'][number];
};

export type VerifyEmailAddressData = StrictOverride<
  BaseEmailData,
  { type: 'VerifyEmailAddress' }
> & {
  link: string;
};

export type ResetPasswordData = StrictOverride<
  BaseEmailData,
  { type: 'ResetPassword' }
> & {
  link: string;
};

export type AccountCreationAttemptData = StrictOverride<
  BaseEmailData,
  { type: 'AccountCreationAttempt' }
>;

export type EmailAlreadyVerifiedData = StrictOverride<
  BaseEmailData,
  { type: 'EmailAlreadyVerified' }
>;
