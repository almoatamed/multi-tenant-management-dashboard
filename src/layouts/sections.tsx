import { useLocale } from "vuetify";

export type Route = {
    name: string;
    icon?: string;
    label: string;
};

export type Section = {
    title: string;
    routes: Route[];
};

export const useSections = () => {
    const locale = useLocale();
    const { t } = locale;
    const sections: Section[] = [
        {
            title: t("Main"),
            routes: [
            ],
        },
    ];
    return sections;
};
