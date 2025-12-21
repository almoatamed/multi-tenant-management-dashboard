import { useLocale } from "vuetify";
import { ThemedView } from "../ThemedView";
import { dc } from "kt-dc";

export const PageHeader = dc(
    (props: { title: string; end?: () => JSX.Element }) => {
        const { t } = useLocale();
        return () => {
            return (
                <ThemedView
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "22px",
                        padding: "8px 22px",
                    }}
                >
                    <ThemedView>
                        <span
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                            }}
                            class={"text-grey-darken-1"}
                        >
                            {t(props.title)}
                        </span>
                    </ThemedView>
                    <ThemedView>{props.end?.()}</ThemedView>
                </ThemedView>
            );
        };
    },
    {
        props: ["title", "end"],
    },
);

export default PageHeader;
