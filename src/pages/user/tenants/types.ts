export type Tenant = {
    client: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
    plans: {
        id: number;
        type: "subscription" | "purchase";
        expirationDate: Date | null;
    }[];
} & {
    port: number;
    id: number;
    status: string | null;
    serviceId: number;
    subdomain: string;
    clientId: number;
};
