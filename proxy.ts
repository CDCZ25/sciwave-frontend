import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'es',
});

export const config = {
  matcher: ['/', '/(es|pt)/:path*'],
};
