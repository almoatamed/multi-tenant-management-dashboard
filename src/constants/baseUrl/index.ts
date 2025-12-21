import { isDev } from "@/constants/env";

export const getBaseUrl = (): string => {
    const baseUrl = location.origin + "/api";
    console.log("Base url", { baseUrl });
    return baseUrl;
};
