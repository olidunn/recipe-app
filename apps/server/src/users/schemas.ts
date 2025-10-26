import { Nullable } from '@recipe-app/common';
import type { Static } from 'elysia';
import { t as Type } from 'elysia';
import { UAParser } from 'ua-parser-js';

export const OptionalSessionCookie = Type.Cookie({
  session: Type.Optional(Type.String({ format: 'uuid' })),
});

export const SessionRecord = Type.Object({
  createdAt: Type.Integer(),
  lastSeenAt: Type.Integer(),
  expiresAt: Type.Integer(),
  city: Nullable(Type.String()),
  region: Nullable(Type.String()),
  countryCode: Nullable(Type.String()),
  userAgent: Nullable(Type.String()),
  current: Type.Union([Type.Literal(0), Type.Literal(1)]),
});

export const SessionResponse = Type.Composite([
  Type.Omit(SessionRecord, ['current']),
  Type.Object({
    current: Type.Boolean(),
    browser: Nullable(Type.String()),
    operatingSystem: Nullable(Type.String()),
  }),
]);
export type Session = Static<typeof SessionResponse>;

export const SessionTransform = Type.Transform(SessionRecord)
  .Decode((value) => {
    const { browser, os } = UAParser(value.userAgent ?? undefined);

    return {
      createdAt: value.createdAt,
      lastSeenAt: value.lastSeenAt,
      expiresAt: value.expiresAt,
      browser: browser?.name ?? null,
      city: value.city,
      region: value.region,
      countryCode: value.countryCode,
      userAgent: value.userAgent,
      current: value.current === 1,
      operatingSystem: os?.name ?? null,
    } satisfies Static<typeof SessionResponse>;
  })
  .Encode((value) => {
    return {
      createdAt: value.createdAt,
      lastSeenAt: value.lastSeenAt,
      expiresAt: value.expiresAt,
      city: value.city,
      region: value.region,
      countryCode: value.countryCode,
      userAgent: value.userAgent,
      current: value.current ? 1 : 0,
    } satisfies Static<typeof SessionRecord>;
  });

export const AuthenticationError = Type.Union([
  Type.Literal('invalidEmailOrPassword'),
  Type.Literal('emailIsNotVerified'),
]);
