/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import colors from "vuetify/util/colors";
export { colors };
import { adaptedLocale, getLocaleName } from "./localization";

// Composables
import { createVuetify } from "vuetify";
import { mdi, aliases } from "vuetify/iconsets/mdi";
import { Icons, IconsSet } from "@/utils/iconSet/index";

export default createVuetify({
    theme: {
        defaultTheme: "light",
        themes: {
            // light: {
            //     colors: {
            //         primary: colors.grey.darken4,
            //     },
            // },
            // dark: {
            //     colors: {
            //         primary: colors.grey.darken4,
            //     },
            // },
        },
    },
    defaults: {
        VCard: {
            class: "elevation-0 pa-4 border",
        },
        VTextField: {
            color: "primary",
            variant: "outlined",
            density: "compact",
        },
        VAutocomplete: {
            color: "primary",
            variant: "outlined",
            density: "compact",
        },
        VBtn: {
            color: "primary",
        },
        global: {
            ripple: false,
        },
    },
    locale: {
        rtl: {
            ar: true,
            en: false,
        },
        locale: getLocaleName(),
        adapter: adaptedLocale,
    },
    icons: {
        defaultSet: "mdi",
        sets: {
            mdi,
            i: IconsSet,
        },
        aliases: {
            ...aliases,
            ...Icons,
        },
    },
});
