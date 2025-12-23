export type Tenant = {
    client: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    };
    service: {
        id: number;
        name: string;
    };
    plans: {
        id: number;
        type: "subscription" | "purchase";
        expirationDate: Date | null;
    }[];
} & {
    port: number;
    id: number;
    status: TenantStatus | null;
    serviceId: number;
    subdomain: string;
    clientId: number;
};
export enum TenantStatus {
    establishing = "establishing",
    failedToStart = "failedToStart",
    failedToEstablish = "failedToEstablish",
    failedToCreateDatabase = "failedToCreateDatabase",
    stopped = "stopped",
    running = "running",
    starting = "starting",
}

export const tenantStatusMapper = (status: null | TenantStatus) => {
    if (!status) {
        return "Unknown";
    }

    switch (status) {
        case TenantStatus.establishing:
            return "Establishing";
        case TenantStatus.failedToCreateDatabase:
            return "Failed to create database";
        case TenantStatus.failedToEstablish:
            return "Failed To Establish";
        case TenantStatus.failedToStart:
            return "Failed to start";
        case TenantStatus.running:
            return "Running";
        case TenantStatus.starting:
            return "Starting";
        case TenantStatus.stopped:
            return "Stopped";
    }
};
