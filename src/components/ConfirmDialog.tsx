import { ref, type VNode } from "vue";
import {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
} from "vuetify/components";
import Button from "./Button/index.vue";
import { useLocale } from "vuetify";
import { dc } from "kt-dc";
export interface ConfirmOptions {
    title: string;
    message: string;
    type: "error" | "warning" | "primary";
}

export const AwaitedConfirmationDialog = dc<
    {},
    { show(opts: ConfirmOptions): Promise<boolean> }
>(function (_, expose) {
    const visible = ref(false);
    const title = ref<string>("");
    const message = ref<string>("");
    let resolver: (value: boolean) => void;
    const type = ref("primary" as string);

    function show(opts: ConfirmOptions): Promise<boolean> {
        title.value = opts.title;
        message.value = opts.message;
        visible.value = true;
        type.value = opts.type;
        return new Promise((resolve) => {
            resolver = resolve;
        });
    }

    function onConfirm() {
        visible.value = false;
        resolver(true);
    }

    function onCancel() {
        visible.value = false;
        resolver(false);
    }

    const { t } = useLocale();

    expose({ show });

    return (): VNode => (
        <VDialog
            modelValue={visible.value}
            onUpdate:modelValue={(v: boolean) => (visible.value = v)}
            persistent
            max-width="400"
        >
            {{
                default: () => (
                    <VCard>
                        <VCardTitle class="text-h6">
                            {t(title.value)}
                        </VCardTitle>
                        <VCardText>{t(message.value)}</VCardText>
                        <VCardActions class="justify-end">
                            <Button variant="text" onClick={onCancel}>
                                {t("Cancel")}
                            </Button>
                            <Button
                                variant="text"
                                color={type.value}
                                onClick={onConfirm}
                            >
                                {t("Confirm")}
                            </Button>
                        </VCardActions>
                    </VCard>
                ),
            }}
        </VDialog>
    );
});
