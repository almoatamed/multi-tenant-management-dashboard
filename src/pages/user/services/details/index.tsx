import { dc } from "kt-dc";
import type { Service } from "../types";
import { extractApiError, type ApiError } from "@/utils/errors/extractor";
import { showSnackBar } from "@/utils/snackBar";
import { api } from "@/state/api";
import { urlsMap } from "@/constants/urlsMap";
import router from "@/router";
import { VCard, VCardActions, VCardText, VDialog, VForm, VProgressCircular } from "vuetify/components";
import { useLocale } from "vuetify";
import { rules } from "@/utils/clientValidationRules";
import { colors } from "@/plugins/vuetify";
import { showConfirm } from "@/utils/confirm";
import { defaultNumberOfItemsPerPageChoices } from "@/components/Table/types";
import type { Tenant } from "../../tenants/types";
import { dashDateFormatter } from "@/utils/common";
type DetailsType = Service;
const back = () => {
    router.push({
        name: "Services",
    });
};

const UpdateServiceNameDialog = dc(
    (props: { onCancel: () => void; postSubmit: () => void; service: null | DetailsType }) => {
        const loading = ref(false);
        const valid = ref(false);
        const apiError = ref(null as null | ApiError);
        const { t } = useLocale();

        const name = ref(null as null | string);
        const nameLabel = t("Service Name");
        const nameRules = [rules.required(nameLabel), rules.title(nameLabel)];

        watch(
            [() => props.service],
            () => {
                name.value = props.service?.name || null;
            },
            {
                immediate: true,
            },
        );
        const submit = async () => {
            if (loading.value || !valid.value) {
                return;
            }
            console.log("Submitting Service Registration");
            loading.value = true;
            try {
                await api.post(urlsMap.serviceUpdateName, {
                    name: name.value,
                    id: props.service?.id,
                });
                props.postSubmit();
            } catch (error) {
                console.error(error);
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
                        modelValue={!!props.service}
                        onUpdate:modelValue={() => {
                            props.onCancel();
                        }}
                        persistent={loading.value}
                        maxWidth={"500px"}
                    >
                        <VCard title={t("Update Service Name")}>
                            <VCardText>
                                <VForm
                                    onUpdate:modelValue={(v) => {
                                        valid.value = !!v;
                                    }}
                                    modelValue={valid.value}
                                    disabled={loading.value}
                                    onSubmit={() => {
                                        submit();
                                    }}
                                >
                                    <ThemedView
                                        style={{
                                            padding: "12px",
                                            gap: "12px",
                                        }}
                                    >
                                        <TextField
                                            name="service-name"
                                            type="text"
                                            modelValue={name.value}
                                            onUpdate:modelValue={(t) => {
                                                name.value = t;
                                            }}
                                            label={nameLabel}
                                            class="required-field"
                                            rules={nameRules}
                                        ></TextField>
                                    </ThemedView>
                                </VForm>
                            </VCardText>
                            <VCardText>
                                <AlertView message={apiError.value?.error} messages={apiError.value?.errors} type="error"></AlertView>
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
                                    disabled={loading.value || !valid.value}
                                    loading={loading.value}
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
        props: ["onCancel", "postSubmit", "service"],
    },
);

const TakeAction = dc(
    (props: { details: DetailsType; setApiError: (error: ApiError) => void; refresh: () => void | Promise<void> }) => {
        const targetUpdateNameService = ref(null as null | DetailsType);
        const loading = ref(false);

        return () => {
            return (
                <>
                    <UpdateServiceNameDialog
                        onCancel={() => {
                            targetUpdateNameService.value = null;
                        }}
                        postSubmit={() => {
                            props.refresh();
                            targetUpdateNameService.value = null;
                        }}
                        service={targetUpdateNameService.value}
                    />

                    <ActionsList
                        loading={loading.value}
                        actions={[
                            {
                                label: "Update Name",
                                action() {
                                    targetUpdateNameService.value = props.details;
                                },
                            },
                            {
                                label: "Delete",
                                textColor: "white",
                                backgroundColor: colors.red.base,
                                action: async () => {
                                    if (loading.value) {
                                        return;
                                    }

                                    loading.value = true;
                                    try {
                                        const confirmed = await showConfirm({
                                            message: "are you sure you want to delete this service? (this service wont be deleted if it has any tenants)",
                                            title: "Delete",
                                            type: "error",
                                        });

                                        if (!confirmed) {
                                            return;
                                        }

                                        await api.delete(urlsMap.serviceDelete.replace(":id", String(props.details.id)));
                                        back();
                                    } catch (error) {
                                        console.error(error);
                                        const e = extractApiError(error);
                                        if (e) {
                                            props.setApiError(e);
                                        }
                                    } finally {
                                        loading.value = false;
                                    }
                                },
                            },
                        ]}
                    ></ActionsList>
                </>
            );
        };
    },
    {
        props: ["details", "refresh", "setApiError"],
    },
);

const DetailsFields = dc(
    (props: { details: DetailsType }) => {
        const d = props.details;

        return () => {
            return (
                <>
                    <FieldsSections
                        sections={[
                            {
                                fields: [
                                    {
                                        text: "ID",
                                        value: d.id,
                                        copyOnClick: true,
                                    },

                                    {
                                        text: "Name",
                                        value: d.name,
                                        copyOnClick: true,
                                    },

                                    {
                                        text: "Backend Service Deployment Path",
                                        value: d.backendAbsolutePathOnServer,
                                        copyOnClick: true,
                                    },

                                    {
                                        text: "Nginx Config",
                                        copyOnClick: true,
                                        value: d.nginxTemplate,
                                    },
                                ],
                            },
                        ]}
                    ></FieldsSections>
                </>
            );
        };
    },
    {
        props: ["details"],
    },
);

const DetailsScreen = dc(() => {
    const loadingDetails = ref(false);
    const details = ref(null as null | DetailsType);

    const apiError = ref(null as null | ApiError);

    const loadDetails = async () => {
        if (loadingDetails.value) {
            return;
        }

        loadingDetails.value = true;

        try {
            const id = Number(router.currentRoute.value.params.id);
            console.log("Request ID", id);
            if (!id) {
                back();
            }

            const url = urlsMap.serviceGet.replace(":id", String(id));

            details.value = (await api.get(url)).data.service;
        } catch (error) {
            console.error(error);
            const e = extractApiError(error);
            if (e) {
                showSnackBar({
                    message: e.error,
                    type: "error",
                });
            }
            back();
        } finally {
            loadingDetails.value = false;
        }
    };

    onMounted(() => {
        loadDetails();
    });

    const { t } = useLocale();

    return () => {
        if (loadingDetails.value) {
            return (
                <>
                    <ThemedView
                        style={{
                            height: "100%",
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "12px",
                            gap: "12px",
                        }}
                    >
                        <VProgressCircular size={32}></VProgressCircular>
                        <ThemedView>{t("Loading")}...</ThemedView>
                    </ThemedView>
                </>
            );
        }

        if (!details.value) {
            return <></>;
        }

        return (
            <>
                <ThemedView
                    style={{
                        padding: "12px",
                        gap: "12px",
                    }}
                >
                    <PageHeader
                        title={`${t("Service Details")}: ${details.value.name}`}
                        end={() => {
                            return (
                                <>
                                    <TakeAction
                                        setApiError={(e) => {
                                            apiError.value = e;
                                        }}
                                        details={details.value!}
                                        refresh={loadDetails}
                                    />
                                </>
                            );
                        }}
                    ></PageHeader>
                    <AlertView
                        type="error"
                        onClear={() => {
                            apiError.value = null;
                        }}
                        message={apiError.value?.error}
                        messages={apiError.value?.errors}
                    ></AlertView>
                    <DetailsFields details={details.value}></DetailsFields>
                    <TenantsTable service={details.value} />
                </ThemedView>
            </>
        );
    };
});

const TenantsTable = dc(
    (props: { service: Service }) => {
        const numberOfItemsPerPage = ref(10);
        const url = urlsMap.serviceTenantsPaginate.replace(":id", String(props.service.id));

        return () => {
            return (
                <>
                    <ApiTable<Tenant>
                        apiDataExtractor={(data) => data.tenants}
                        apiTotalExtractor={(data) => data.total}
                        headers={[
                            {
                                key: "id",
                                label: "ID",
                                value: (row) => String(row.id),
                            },
                            {
                                key: "__actions",
                                actions: [
                                    {
                                        label: "Details",
                                        iconName: "mdi-export",
                                        action(row, _props) {
                                            router.push({
                                                name: "TenantDetails",
                                                params: {
                                                    id: row.id,
                                                },
                                            });
                                        },
                                        href(row) {
                                            return router.resolve({
                                                name: "TenantDetails",
                                                params: {
                                                    id: row.id,
                                                },
                                            }).href;
                                        },
                                    },
                                ],
                            },
                            {
                                key: "client-id",
                                label: "Client ID",
                                value: (row) => String(row.client.id || ""),
                            },
                            {
                                key: "client-name",
                                label: "Client Name",
                                value: (row) => row.client.name,
                            },
                            {
                                key: "plan-type",
                                label: "Plan Type",
                                value: (row) => row.plans[0]?.type || "",
                            },
                            {
                                key: "expiration-data",
                                label: "Expiration Date",
                                value: (row) => {
                                    const p = row.plans[0];
                                    if (!p || p.type != "subscription") {
                                        return "";
                                    }
                                    return dashDateFormatter(p.expirationDate, {
                                        dateFormat: "yyyy-mm-dd",
                                        getDate: true,
                                        getTime: false,
                                    });
                                },
                            },
                        ]}
                        onRefresh={(props, refresh) => {
                            refresh({
                                queryParams: {
                                    take: numberOfItemsPerPage.value,
                                    skip: props.skip,
                                },
                            });
                        }}
                        title="Service Tenant List"
                        url={url}
                        iconName="mdi-server"
                        numberOfItemsPerPage={numberOfItemsPerPage.value}
                        setNumberOfItemsPerPage={(v) => {
                            numberOfItemsPerPage.value = v;
                        }}
                        numberOfItemsPerPageChoices={defaultNumberOfItemsPerPageChoices}
                        showNumber
                    ></ApiTable>
                </>
            );
        };
    },
    {
        props: ["service"],
    },
);

export default DetailsScreen;
