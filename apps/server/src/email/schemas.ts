import { EmailAddress } from '@recipe-app/common';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { Static } from '@sinclair/typebox/type';
import { Type } from '@sinclair/typebox/type';

const Attachment = Type.Object({
  file_name: Type.String(),
  content_type: Type.String(),
  /**
   * The attachment data. If the base64 field is true, this data must be encoded using base64. Otherwise, it will be interpreted as UTF-8.
   */
  data: Type.String(),
  /**
   * If specified, this attachment will be added as an inline attachment and a multipart/related MIME container will be generated in the message to hold it and the textual content.
   */
  content_id: Type.Optional(Type.String()),
  /**
   * If set to true, data needs to be encoded using base64. Otherwise data will be interpreted as UTF-8.
   */
  base64: Type.Optional(Type.Boolean()),
});

const Contact = Type.Object({
  email: EmailAddress,
  name: Type.Optional(Type.String()),
});

const EmailSchema = Type.Object({
  from: Contact,
  recipients: Type.Array(Contact),
  subject: Type.String(),
  reply_to: Type.Optional(Contact),
  /**
   * Plain text content. Required if html_content is empty.
   */
  text_content: Type.Optional(Type.String()),
  /**
   * HTML content. Required if text_content is empty.
   */
  html_content: Type.Optional(Type.String()),
  /**
   * AMP HTML content.
   */
  amp_content: Type.Optional(Type.String()),
  attachments: Type.Optional(Type.Array(Attachment)),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
});
export type Email = Static<typeof EmailSchema>;

export const EmailChecker = TypeCompiler.Compile(EmailSchema);

const EmailResponseError = Type.Object({
  status: Type.String(),
});
export const EmailResponseErrorChecker =
  TypeCompiler.Compile(EmailResponseError);

const MailpitEmailResponse = Type.Object({
  ID: Type.String(),
});
export type MailpitEmailResponse = Static<typeof MailpitEmailResponse>;
export const MailpitEmailResponseChecker =
  TypeCompiler.Compile(MailpitEmailResponse);

export const MailpitEmailError = Type.Object({
  Error: Type.String(),
});
export type MailpitEmailError = Static<typeof MailpitEmailError>;
export const MailpitEmailErrorChecker = TypeCompiler.Compile(MailpitEmailError);
