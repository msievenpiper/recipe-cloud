"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const localActive = useLocale();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            // Replace the locale in the pathname
            // Assuming pathname starts with /en or /es, we want to replace it.
            // E.g. /en/recipes -> /es/recipes
            // Or / -> /es (if redirected)
            // This logic depends on how usePathname returns the path. 
            // With next-intl middleware, pathname might include the locale or not depending on configuration.
            // But standard Next.js logic:

            // However, we should use navigation APIs from next-intl if available for cleaner switching.
            // But simpler: just replace the first segment.

            const segments = pathname.split('/');
            segments[1] = nextLocale;
            const newPath = segments.join('/');
            router.replace(newPath);
        });
    };

    return (
        <label className="border-2 rounded">
            <p className="sr-only">Change language</p>
            <select
                defaultValue={localActive}
                className="bg-transparent py-2"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="en">English</option>
                <option value="es">Español</option>
            </select>
        </label>
    );
}
