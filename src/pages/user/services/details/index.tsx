import { dc } from "kt-dc";
import type { Service } from "../types";
import { extractApiError, type ApiError } from "@/utils/errors/extractor";
import { showSnackBar } from "@/utils/snackBar";
import { api } from "@/state/api";
import { urlsMap } from "@/constants/urlsMap";
import router from "@/router";
import { VCard, VCardActions, VCardText, VDialog, VForm, VProgressCircular } from "vuetify/components";
import { useLocale } from "vuetify";
import { sleep } from "@/utils/common";
import { rules } from "@/utils/clientValidationRules";

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
    (props: { details: DetailsType; refresh: () => void | Promise<void> }) => {
        const targetUpdateNameService = ref(null as null | DetailsType);

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
                        actions={[
                            {
                                label: "Update Name",
                                action() {
                                    targetUpdateNameService.value = props.details;
                                },
                            },
                        ]}
                    ></ActionsList>
                </>
            );
        };
    },
    {
        props: ["details", "refresh"],
    },
);

const DetailsScreen = dc(() => {
    const loadingDetails = ref(false);
    const details = ref(null as null | DetailsType);

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
                                    <TakeAction details={details.value!} refresh={loadDetails} />
                                </>
                            );
                        }}
                    ></PageHeader>
                </ThemedView>
            </>
        );
    };
});

export default DetailsScreen;
