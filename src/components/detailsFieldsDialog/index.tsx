import { dc } from "kt-dc";
import type { FieldProps } from "../Field";
import { VCard, VCardActions, VCardText, VDialog } from "vuetify/components";
import { useLocale } from "vuetify";

export const DetailsFieldsDialog = dc<
    {},
    {
        show: (props: {
            title: string;
            sections: {
                fields: FieldProps[];
            }[];
        }) => void;
    }
>((_, expose) => {
    const shown = ref(false);
    const fields = ref(
        [] as {
            fields: FieldProps[];
        }[],
    );
    const title = ref(null as null | string);

    const show = (props: {
        title: string;
        sections: {
            fields: FieldProps[];
        }[];
    }) => {
        title.value = props.title;
        fields.value = props.sections;
        shown.value = true;
    };
    expose({
        show,
    });
    const { t } = useLocale();

    return () => {
        return (
            <>
                <VDialog
                    modelValue={shown.value}
                    onUpdate:modelValue={(v) => {
                        shown.value = !!v;
                    }}
                    maxWidth={"800px"}
                    width={"100%"}
                >
                    <VCard title={title.value ? t(title.value) : undefined}>
                        <VCardText>
                            <FieldsSections
                                noElevation
                                sections={fields.value}
                            ></FieldsSections>
                        </VCardText>

                        <VCardActions>
                            <Button
                                onClick={() => {
                                    shown.value = false;
                                }}
                            >
                                {t("Close")}
                            </Button>
                        </VCardActions>
                    </VCard>
                </VDialog>
            </>
        );
    };
});
