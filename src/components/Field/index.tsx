import { dc } from "kt-dc";
import { useLocale } from "vuetify";
import { ThemedView } from "../ThemedView";
import { copyToClipboard } from "@/utils/common";
import { isEmpty } from "@/utils/clientValidationRules";
import { showSnackBar } from "@/utils/snackBar";
export type FieldProps = {
    value?: string | null | number;
    text: string;
    onClick?: () => void | Promise<void>;
    copyOnClick?: boolean;
};
export const Field = dc(
    (props: FieldProps) => {
        const { t } = useLocale();
        return () => {
            return (
                <ThemedView
                    style={{
                        flexDirection: "column",
                        gap: "2px",
                    }}
                >
                    <ThemedView>
                        <p
                            style={{
                                color: "#7e7b77",
                                fontSize: "11px",
                            }}
                        >
                            {t(props.text || "")}:
                        </p>
                    </ThemedView>
                    <ThemedView
                        onClick={
                            props.onClick ||
                            (props.copyOnClick && !isEmpty(props.value)
                                ? () => {
                                      if (!isEmpty(props.value)) {
                                          copyToClipboard(String(props.value));
                                          showSnackBar({
                                              type: "success",
                                              message: `${props.text} copied`,
                                          });
                                      }
                                  }
                                : undefined)
                        }
                        class={
                            !isEmpty(props.value) &&
                            (props.onClick || props.copyOnClick)
                                ? "hoverable-text"
                                : undefined
                        }
                    >
                        {t(!isEmpty(props.value) ? String(props.value) : "") ||
                            `-- ${t("Empty")} --`}
                    </ThemedView>
                </ThemedView>
            );
        };
    },
    {
        props: ["onClick", "text", "value", "copyOnClick"],
    },
);

export default Field;
