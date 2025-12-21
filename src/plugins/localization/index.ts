import { createI18n } from "vue-i18n";
import type { LocaleInstance } from "vuetify";
import { en, ar } from "vuetify/locale";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
import { isDev, isSendNotFoundTranslations } from "@/constants/env";
import axios from "axios";

export const messages = {
    en: {
        $vuetify: {
            ...en,
        },
    },
    ar: {
        $vuetify: {
            ...ar,
        },
        ...Object.fromEntries(
            Object.entries({}).map(([key, translation]) => {
                return [key.toLowerCase(), translation];
            }),
        ),
    },
};

export const getLocaleName = () => {
    const locale = localStorage.getItem("locale");
    return locale || "en";
};

export const setLocale = (l: string) => {
    localStorage.setItem("locale", l);
    setTimeout(() => {
        location.reload();
    }, 0.5e3);
};

export const i18n = createI18n({
    legacy: false,
    locale: getLocaleName(),
    fallbackLocale: "en",
    fallbackWarn: false,
    missingWarn: false,
    messages,
});

const adaptedLocale: LocaleInstance & {
    originalT: (key: string, ...params: unknown[]) => string;
} = createVueI18nAdapter({ i18n, useI18n }) as any;

adaptedLocale.originalT = adaptedLocale.t;

adaptedLocale.t = (key: string, ...args: any[]) => {
    if (typeof key != "string") {
        return key;
    }
    if (key.startsWith("$v")) {
        return adaptedLocale.originalT(key, ...args);
    }
    const translation = adaptedLocale.originalT(key.toLowerCase(), ...args);
    if (translation == key.toLowerCase()) {
        if (key.toLowerCase() && isDev() && isSendNotFoundTranslations()) {
            (async () => {
                try {
                    await axios.post(
                        "http://localhost:3456/api/add-translation",
                        {
                            message: key.toLowerCase(),
                            lang: adaptedLocale.current.value,
                        },
                    );
                } catch (error) {
                    console.log(error);
                }
            })();
        }
        return key;
    }
    return translation;
};
export { adaptedLocale };
