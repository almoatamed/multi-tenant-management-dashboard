import { dc } from "kt-dc";
import { tenantStatusMapper, type Tenant } from "./types";
import { defaultNumberOfItemsPerPageChoices } from "@/components/Table/types";
import { urlsMap } from "@/constants/urlsMap";
import { useLocale } from "vuetify";
import router from "@/router";
import { dashDateFormatter } from "@/utils/common";
import { VAutocomplete, VCard, VCardActions, VCardText, VDialog, VForm, VIcon } from "vuetify/components";
import { extractApiError, type ApiError } from "@/utils/errors/extractor";
import type { Client } from "../client/type";
import { api } from "@/state/api";
import type { Service } from "../services/types";
import { rules } from "@/utils/clientValidationRules";

const AddDialog = dc(
    (props: { onCancel: () => void; postConfirm: () => void; shown: boolean }) => {
        const loading = ref(false);
        const apiError = ref(null as null | ApiError);
        const valid = ref(false);

        const { t } = useLocale();

        const allServices = ref([] as Client[]);
        const loadingAllServices = ref(false);
        const loadServices = async () => {
            if (loadingAllServices.value) {
                return;
            }
            loadingAllServices.value = true;
            try {
                allServices.value = (await api.get(urlsMap.servicesList)).data.services;
            } catch (error) {
                console.error(error);
                const e = extractApiError(error);
                if (e) {
                    apiError.value = e;
                }
            } finally {
                loadingAllServices.value = false;
            }
        };

        const allClients = ref([] as Service[]);
        const loadingAllClients = ref(false);
        const loadClients = async () => {
            if (loadingAllClients.value) {
                return;
            }
            loadingAllClients.value = true;
            try {
                allClients.value = (await api.get(urlsMap.clientListAll)).data.clients;
            } catch (error) {
                console.error(error);
                const e = extractApiError(error);
                if (e) {
                    apiError.value = e;
                }
            } finally {
                loadingAllClients.value = false;
            }
        };

        onMounted(() => {
            loadClients();
            loadServices();
        });

        const service = ref(null as null | Service);
        const serviceLabel = t("Service");
        const serviceRules = [rules.required(serviceLabel)];

        const client = ref(null as null | Client);
        const clientLabel = t("Client");
        const clientRules = [rules.required(clientLabel)];

        const submit = async () => {
            if (loading.value) {
                return;
            }
            loading.value = true;
            try {
            } catch (error) {
                console.error("Failed to Created Tenant", error);
                const e = extractApiError(error);
                if (e) {
                    apiError.value = e;
                }
            } finally {
                loading.value = false;
            }
        };
        return () => {
            return (
                <>
                    <VDialog
                        onUpdate:modelValue={() => {
                            props.onCancel();
                        }}
                        maxWidth="700px"
                        modelValue={props.shown}
                        persistent={loading.value}
                    >
                        <VCard title={t("Add New Tenant")}>
                            <VCardText>
                                <VForm
                                    modelValue={valid.value}
                                    onUpdate:modelValue={(v) => {
                                        valid.value = !!v;
                                    }}
                                    disabled={loading.value}
                                >
                                    <ThemedView
                                        style={{
                                            gap: "12px",
                                        }}
                                    >
                                        <VAutocomplete
                                            name={"service"}
                                            items={allServices.value}
                                            itemTitle={(s) => s.name}
                                            itemValue={(s) => s}
                                            loading={loadingAllServices.value}
                                            disabled={loadingAllServices.value}
                                            label={serviceLabel}
                                            modelValue={service.value}
                                            onUpdate:modelValue={(v) => {
                                                service.value = v;
                                            }}
                                            class={"required-field"}
                                        ></VAutocomplete>
                                    </ThemedView>
                                </VForm>
                            </VCardText>
                            <VCardText>
                                <AlertView type="error" message={apiError.value?.error} messages={apiError.value?.errors}></AlertView>
                            </VCardText>

                            <VCardActions>
                                <Button
                                    onClick={() => {
                                        props.onCancel();
                                    }}
                                    disabled={loading.value}
                                >
                                    {t("Cancel")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        submit();
                                    }}
                                    loading={loading.value}
                                    disabled={loading.value || !valid.value}
                                >
                                    {t("Submit")}
                                </Button>
                            </VCardActions>
                        </VCard>
                    </VDialog>
                </>
            );
        };
    },
    {
        props: ["onCancel", "postConfirm", "shown"],
    },
);

const AddButton = dc(
    (props: { resetTable: () => Promise<void> | void }) => {
        const { t } = useLocale();

        const shown = ref(false);
        const onCancel = () => {
            shown.value = false;
        };
        const postConfirm = () => {
            shown.value = false;
            props.resetTable();
        };

        return () => {
            return (
                <>
                    <AddDialog onCancel={onCancel} postConfirm={postConfirm} shown={shown.value}></AddDialog>
                    <Button
                        onClick={() => {
                            shown.value = true;
                        }}
                        variant="text"
                    >
                        <ThemedView
                            style={{
                                flexDirection: "row",
                                gap: "12px",
                                alignItems: "center",
                            }}
                        >
                            <VIcon>mdi-plus</VIcon>
                            <ThemedView>{t("Add")}</ThemedView>
                        </ThemedView>
                    </Button>
                </>
            );
        };
    },
    {
        props: ["resetTable"],
    },
);

const TenantsScreen = dc(() => {
    const numberOfItemsPerPage = ref(10);
    const numberOfItemsPerPageChoices = defaultNumberOfItemsPerPageChoices;
    const { t } = useLocale();
    return () => {
        return (
            <>
                <ThemedView
                    style={{
                        padding: "12px",
                        gap: "12px",
                    }}
                >
                    <ApiTable<Tenant>
                        apiDataExtractor={(data) => {
                            return data.tenants;
                        }}
                        apiTotalExtractor={(data) => {
                            return data.total;
                        }}
                        headers={[
                            {
                                key: "id",
                                label: "ID",
                                value: (row) => {
                                    return String(row.id);
                                },
                            },
                            {
                                key: "status",
                                label: "Status",
                                value: (row) => {
                                    return t(tenantStatusMapper(row.status));
                                },
                            },
                            {
                                actions: [
                                    {
                                        label: "Details",
                                        iconName: "mdi-export",
                                        action(row, props) {
                                            router.push({
                                                name: "TenantDetails",
                                                params: {
                                                    id: row.id,
                                                },
                                            });
                                        },
                                        href: (row) => {
                                            return router.resolve({
                                                name: "TenantDetails",
                                                params: {
                                                    id: row.id,
                                                },
                                            }).href;
                                        },
                                    },
                                ],
                                key: "__actions",
                            },
                            {
                                key: "service",
                                label: "Service",
                                value: (row) => {
                                    return row.service.name;
                                },
                                cellToolTip: {
                                    text: (row) => {
                                        return `${t("Service Id")}: ${row.serviceId}, press to open details`;
                                    },
                                },
                                onCellPress: (row) => {
                                    router.push({
                                        name: "ServiceDetails",
                                        params: {
                                            id: row.serviceId,
                                        },
                                    });
                                },
                            },
                            {
                                key: "client",
                                label: "Client",
                                value: (row) => row.client.name,
                                cellToolTip: {
                                    text: (row) => {
                                        return `${t("Client Id")}: ${row.clientId}, press to open details`;
                                    },
                                },
                                onCellPress(row) {
                                    // TODO open client details
                                },
                            },
                            {
                                key: "subdomain",
                                label: "Subdomain",
                                value: (row) => {
                                    return row.subdomain;
                                },
                            },
                            {
                                key: "port",
                                label: "Port",
                                value: (row) => {
                                    return String(row.port);
                                },
                            },
                            {
                                key: "plan-type",
                                label: "Plan Type",
                                value: (row) => {
                                    return t(row.plans?.[0]?.type || "");
                                },
                            },
                            {
                                key: "plan-expiration",
                                label: "Expiration Date",
                                value: (row) => {
                                    const p = row.plans?.[0];
                                    if (!p || p.type == "purchase") {
                                        return "";
                                    }
                                    return dashDateFormatter(p.expirationDate, {
                                        dateFormat: "yyyy-mm-dd",
                                        getDate: true,
                                        getTime: true,
                                    });
                                },
                            },
                        ]}
                        onRefresh={(props, refresh) => {
                            refresh({
                                queryParams: {
                                    skip: props.skip,
                                    take: numberOfItemsPerPage.value,
                                },
                            });
                        }}
                        title="Tenants List"
                        url={urlsMap.tenantPaginate}
                        iconName="mdi-server"
                        showNumber
                        numberOfItemsPerPage={numberOfItemsPerPage.value}
                        setNumberOfItemsPerPage={(v) => {
                            numberOfItemsPerPage.value = v;
                        }}
                        numberOfItemsPerPageChoices={numberOfItemsPerPageChoices}
                        TopSlot={(props) => {
                            return (
                                <>
                                    <PageHeader
                                        title="Tenants"
                                        end={() => {
                                            return (
                                                <>
                                                    <AddButton resetTable={props.reset}></AddButton>
                                                </>
                                            );
                                        }}
                                    ></PageHeader>
                                </>
                            );
                        }}
                    ></ApiTable>
                </ThemedView>
            </>
        );
    };
});

export default TenantsScreen;
