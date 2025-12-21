import axios from "axios";

function isNetworkError(error: any): boolean {
    return axios.isAxiosError(error) && !error.response;
}

export type ProvidedApiError = {
    /**
     * status code
     */
    status: number;
    /**
     * not reliable
     */
    title: string;
    /**
     * url to page describing the meaning of this status code
     */
    type: string;
    errors: {
        [key: string]: string[];
    };
    /**
     * ref uuid
     */
    traceId: string;
};

export type ApiError = {
    code: string;
    errors: string[];
    error: string;
    status: number;
};

const networkError: ApiError = {
    error: "network error, please try again!",
    errors: [],
    status: 0,
    code: "network-error",
};

export const extractApiError = (_error: any): ApiError | null => {
    const error: ProvidedApiError = _error;
    if (isNetworkError(_error)) {
        return networkError;
    }

    const accumulateSubErrorsList = (error: ProvidedApiError) => {
        const errorsList = [] as string[];
        for (const key in error?.errors) {
            errorsList.push(...(error.errors[key] || []));
        }
        return errorsList;
    };

    if (typeof error?.title == "string" && typeof error?.status == "number") {
        return {
            code: error.type,
            error: error.title,
            errors: accumulateSubErrorsList(error),
            status: error.status,
        };
    }

    if (!_error?.response?.data || typeof _error?.response?.data != "object") {
        console.log("Returning null as extracted error because there is no data", error);
        return null;
    }

    let errorData = _error.response?.data;

    errorData = Object.fromEntries(
        Object.entries(errorData).map(([key, value]) => {
            return [String(key).toLowerCase(), value];
        }),
    );
    const errorStatus: string | undefined = errorData?.status;
    const errorMessage: string | undefined = errorData?.title;

    if (errorStatus && errorMessage) {
        console.log("Returning Extracted Error");
        return {
            code: errorData.type,
            error: errorData.title,
            errors: accumulateSubErrorsList(errorData),
            status: errorData.status,
        };
    }
    console.log("Returning null extracted error because there is no valid data");
    return null;
};
