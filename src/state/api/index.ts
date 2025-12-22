import { getBaseUrl } from "@/constants/baseUrl";
import axios from "axios";
import { logout, user } from "../user";
import { extractApiError } from "@/utils/errors/extractor";

export const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 120e3,
    adapter: "fetch",
});
api.interceptors.request.use((config) => {
    if (user.value?.token) {
        config.headers["Authorization"] = `Bearer ${user.value.token}`;
    }

    return config;
});

api.interceptors.response.use(undefined, (error) => {
    const extractedError = extractApiError(error);
    if (extractedError?.code == "OWNER_NOT_FOUND") {
        console.log("[LOGOUT] error interceptor owner not found");
        logout();
    }
    throw error;
});
