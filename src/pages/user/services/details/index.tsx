import { dc } from "kt-dc";
import type { Service } from "../types";
import { extractApiError } from "@/utils/errors/extractor";
import { showSnackBar } from "@/utils/snackBar";
import { api } from "@/state/api";
import { urlsMap } from "@/constants/urlsMap";
import router from "@/router";
import { VProgressCircular } from "vuetify/components";
import { useLocale } from "vuetify";
import { sleep } from "@/utils/common";

type DetailsType = Service;
const back = () => {
    router.push({
        name: "Services",
    });
};

const TakeAction = dc(() => {
    return () => {
        return (
            <>
                <ActionsList
                actions={[]}
                ></ActionsList>
            </>
        );
    };
});

const DetailsScreen = dc(() => {
    const loadingDetails = ref(false);
    const details = ref(null as null | DetailsType);

    const loadDetails = async () => {
        if (loadingDetails.value) {
            return false;
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
                                    <TakeAction />
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
