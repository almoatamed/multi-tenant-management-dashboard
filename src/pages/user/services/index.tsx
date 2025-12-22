import { dc } from "kt-dc";
import type { Service } from "./types";
import { urlsMap } from "@/constants/urlsMap";
import { VCard, VCardActions, VCardText, VDialog, VForm, VIcon, VTextarea } from "vuetify/components";
import { defaultNumberOfItemsPerPageChoices } from "@/components/Table/types";
import { useLocale } from "vuetify";
import { rules, type RulesList } from "@/utils/clientValidationRules";
import { extractApiError, type ApiError } from "@/utils/errors/extractor";
import { templateParamWrapper } from "@/utils/templateParamWrapper";
import { api } from "@/state/api";
import { isDev } from "@/constants/env";
import router from "@/router";
import { clip, copyToClipboard } from "@/utils/common";
import { showSnackBar } from "@/utils/snackBar";

const AddDialog = dc(
    (props: { shown: boolean; cancel: () => void; postSubmit: () => void }) => {
        const loading = ref(false);
        const valid = ref(false);
        const { t } = useLocale();

        const apiError = ref(null as null | ApiError);

        const name = ref(null as null | string);
        const nameLabel = t("Service Name");
        const nameRules = [rules.required(nameLabel), rules.title(nameLabel)];

        const backendAbsolutePathOnServer = ref(null as null | string);
        const backendAbsolutePathOnServerLabel = t("Backend Absolute Path On Server Label");
        const backendAbsolutePathOnServerRules = [rules.required(backendAbsolutePathOnServerLabel), rules.title(backendAbsolutePathOnServerLabel)];

        const devTemplate = `server {
   listen 80;
   server_name  <|||>SUBDOMAIN</|||>.local;
   index index.html;
   root   /home/salem/saraf/currencyExchangeManagerDashboard;

    location /api {
        proxy_pass http://localhost:<|||>SERVICE_PORT</|||>;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }



}`;

        const nginxTemplate = ref((isDev() ? devTemplate : null) as null | string);
        const nginxTemplateLabel = t("Nginx Template");
        const nginxTemplateRules: RulesList = [
            rules.required(nginxTemplateLabel),
            rules.description(nginxTemplateLabel, 30_000),
            (v: string) => {
                const subdomainParam = templateParamWrapper("SUBDOMAIN");
                if (!v.includes(subdomainParam)) {
                    return t("nginx template must include subdomain variable: " + subdomainParam);
                }

                const portParam = templateParamWrapper("SERVICE_PORT");
                if (!v.includes(portParam)) {
                    return t("nginx template must include the port param: " + portParam);
                }

                return true;
            },
        ];

        const submit = async () => {
            if (loading.value || !valid.value) {
                return;
            }
            console.log("Submitting Service Registration");
            loading.value = true;
            try {
                await api.post(urlsMap.servicesRegister, {
                    name: name.value,
                    backendAbsolutePathOnServer: backendAbsolutePathOnServer.value,
                    nginxTemplate: nginxTemplate.value,
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
                        modelValue={props.shown}
                        maxWidth={"600px"}
                        onUpdate:modelValue={() => {
                            props.cancel();
                        }}
                        persistent={loading.value}
                    >
                        <VCard title={t("Add New Service")}>
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

                                        <TextField
                                            name="backend-path"
                                            label={backendAbsolutePathOnServerLabel}
                                            type={"path"}
                                            class="required-field"
                                            rules={backendAbsolutePathOnServerRules}
                                            modelValue={backendAbsolutePathOnServer.value}
                                            onUpdate:modelValue={(t) => {
                                                backendAbsolutePathOnServer.value = t;
                                            }}
                                        ></TextField>

                                        <VTextarea
                                            noResize={false}
                                            name="nginx-template"
                                            modelValue={nginxTemplate.value}
                                            onUpdate:modelValue={(v) => {
                                                nginxTemplate.value = v;
                                            }}
                                            variant="outlined"
                                            rules={nginxTemplateRules}
                                            class="required-field"
                                            label={nginxTemplateLabel}
                                        ></VTextarea>
                                    </ThemedView>
                                </VForm>
                            </VCardText>

                            <VCardText>
                                <AlertView message={apiError.value?.error} messages={apiError.value?.errors} type="error"></AlertView>
                            </VCardText>

                            <VCardActions>
                                <Button
                                    onClick={() => {
                                        props.cancel();
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
        props: ["cancel", "shown", "postSubmit"],
    },
);

const AddButton = dc(
    (props: { reset: () => void }) => {
        const { t } = useLocale();
        const shown = ref(false);
        const postSubmit = () => {
            shown.value = false;
            props.reset();
        };
        const cancel = () => {
            shown.value = false;
        };

        return () => {
            return (
                <>
                    <AddDialog cancel={cancel} postSubmit={postSubmit} shown={shown.value}></AddDialog>

                    <Button
                        variant="text"
                        onClick={() => {
                            shown.value = true;
                        }}
                    >
                        <ThemedView
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <ThemedView>{t("Add")}</ThemedView>
                            <VIcon>mdi-plus</VIcon>
                        </ThemedView>
                    </Button>
                </>
            );
        };
    },
    {
        props: ["reset"],
    },
);

const ServicesScreen = dc(() => {
    const numberOfItemsPerPage = ref(-1 as null | number);
    const numberOfItemsPerPageChoices: {
        label: string;
        value: number;
    }[] = [
        {
            label: "All",
            value: -1,
        },
    ];

    return () => {
        return (
            <ThemedView
                style={{
                    padding: "12px",
                }}
            >
                <ApiTable<Service>
                    apiDataExtractor={(data) => {
                        return data.services;
                    }}
                    apiTotalExtractor={(data) => {
                        return data.services.length;
                    }}
                    headers={[
                        {
                            key: "id",
                            label: "ID",
                            value: (r) => String(r.id),
                        },
                        {
                            key: "name",
                            label: "Name",
                            value: (r) => r.name,
                        },
                        {
                            key: "__actions",
                            actions: [
                                {
                                    action(row, props) {
                                        router.push({
                                            name: "ServiceDetails",
                                            params: {
                                                id: row.id,
                                            },
                                        });
                                    },
                                    href(row) {
                                        return router.resolve({
                                            name: "ServiceDetails",
                                            params: {
                                                id: row.id,
                                            },
                                        }).href;
                                    },
                                    label: "Details",
                                    iconName: "mdi-export",
                                },
                            ],
                        },

                        {
                            key: "backend-path",
                            label: "Backend Path",
                            value: (row) => {
                                return clip(row.backendAbsolutePathOnServer, 35);
                            },
                            cellToolTip: {
                                text: (row) => {
                                    return row.backendAbsolutePathOnServer;
                                },

                                onClick: (row) => {
                                    copyToClipboard(row.backendAbsolutePathOnServer);
                                    showSnackBar({
                                        message: "Copied Path To Clipboard",
                                        type: "success",
                                    });
                                },
                            },
                        },
                    ]}
                    showNumber
                    onRefresh={(_props, refresh) => {
                        refresh({});
                    }}
                    title="Services List"
                    url={urlsMap.servicesList}
                    iconName={"mdi-cloud"}
                    TopSlot={({ reset }) => {
                        return (
                            <>
                                <PageHeader
                                    title="Services"
                                    end={() => {
                                        return <AddButton reset={reset}></AddButton>;
                                    }}
                                ></PageHeader>
                            </>
                        );
                    }}
                ></ApiTable>
            </ThemedView>
        );
    };
});

export default ServicesScreen;
