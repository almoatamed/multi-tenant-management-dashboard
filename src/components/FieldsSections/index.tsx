import { dc } from "kt-dc";
import type { FieldProps } from "../Field";
import { VCol, VContainer, VDivider, VRow } from "vuetify/components";
import { useTheme } from "vuetify";
import { defaultBoxShadow } from "@/constants/styling";

const FieldsSections = dc(
    (props: {
        sections: {
            fields: FieldProps[];
        }[];
        noElevation?: boolean;
    }) => {
        return () => {
            return (
                <>
                    <VContainer fluid>
                        <VRow>
                            {props.sections
                                .filter((s) => s.fields.length > 0)
                                .map((s, i) => {
                                    return (
                                        <VCol
                                            cols={12}
                                            md={
                                                i % 2 == 0 &&
                                                i == props.sections.length - 1
                                                    ? undefined
                                                    : 6
                                            }
                                        >
                                            <Fields
                                                noElevation={props.noElevation}
                                                fields={s.fields}
                                            ></Fields>
                                        </VCol>
                                    );
                                })}
                        </VRow>
                    </VContainer>
                </>
            );
        };
    },
    {
        props: ["sections", "noElevation"],
    },
);

const Fields = dc(
    (props: { fields: FieldProps[]; noElevation?: boolean }) => {
        const theme = useTheme();
        return () => {
            const cc = theme.current.value.colors;
            return (
                <>
                    <ThemedView
                        style={{
                            flex: 1,
                            height: "100%",
                            padding: "22px",
                            gap: "12px",
                            borderRadius: "12px",
                            boxShadow: props.noElevation
                                ? undefined
                                : defaultBoxShadow,
                            background: cc.surface,
                        }}
                    >
                        {props.fields.map((f, i) => {
                            return (
                                <>
                                    <Field
                                        copyOnClick={f.copyOnClick}
                                        text={f.text}
                                        value={f.value}
                                        onClick={f.onClick}
                                    ></Field>
                                    {i < props.fields.length - 1 && (
                                        <>
                                            <VDivider></VDivider>
                                        </>
                                    )}
                                </>
                            );
                        })}
                    </ThemedView>
                </>
            );
        };
    },
    {
        props: ["fields", "noElevation"],
    },
);

export default FieldsSections;
