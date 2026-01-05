import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
    let finalLocale = locale as any;

    // Specialized fix: Next.js sometimes passes undefined locale to getRequestConfig
    // even when the RootLayout receives it. We manually check the header set by next-intl middleware.
    if (!finalLocale || finalLocale === 'undefined') {
        const headerLocale = (await headers()).get('x-next-intl-locale');
        finalLocale = headerLocale;
    }

    if (!finalLocale || !routing.locales.includes(finalLocale)) {
        finalLocale = routing.defaultLocale;
    }

    return {
        locale: finalLocale,
        messages: (await import(`@/messages/${finalLocale}.json`)).default
    };
});
