"use client";

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from "next-intl";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const localActive = useLocale();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value as any;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="relative inline-block text-left">
            <select
                value={localActive}
                className="bg-primary-800 text-gray-200 hover:text-white px-3 pr-5 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer border-none"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="en">🇺🇸 EN</option>
                <option value="es">🇪🇸 ES</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="de">🇩🇪 DE</option>
                <option value="it">🇮🇹 IT</option>
                <option value="pt">🇵🇹 PT</option>
                <option value="zh">🇨🇳 ZH</option>
                <option value="ja">🇯🇵 JA</option>
                <option value="ko">🇰🇷 KO</option>
                <option value="ru">🇷🇺 RU</option>
            </select>
            {/* Custom arrow for the select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-200">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
