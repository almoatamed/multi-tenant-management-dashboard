import { ThemedView } from "../ThemedView";
import { type RefreshMethodWithNextSkip, type TableHeader } from "./types";
import { ThemedText } from "../ThemedText";
import { useLocale, useTheme } from "vuetify";
import Icon from "@/components/Icon/index.vue";
import { VMenu, VProgressCircular } from "vuetify/components";
import { colors } from "@/plugins/vuetify";
import { defineComponent, ref } from "vue";

export const TableRowActions = defineComponent<{
    header: TableHeader<any>;
    row: any;
    refresh: RefreshMethodWithNextSkip;
    reset: () => void | Promise<void>;
    refreshAsIs: () => void | Promise<void>;
}>(
    (props) => {
        const { t } = useLocale();
        const loading = ref(false);
        const id = "_" + String(Math.random()).replace(".", "");
        return () => {
            const theme = useTheme().current.value.colors;
            const header = props.header;
            const row = props.row;

            if (header?.menu) {
                return (
                    <>
                        <ThemedView
                            id={id}
                            style={{
                                paddingBottom: "1px",
                            }}
                        >
                            <Icon
                                icon="mdi-menu"
                                size={32}
                                color={theme.primary}
                            ></Icon>
                        </ThemedView>

                        <VMenu activator={`#${id}`}>
                            <ThemedView
                                style={{
                                    minWidth: "300px",
                                    gap: "12px",
                                    padding: "12px",
                                    borderRadius: "12px",
                                    border: "solid 1px #00000022",
                                    backgroundColor: theme.background,
                                }}
                            >
                                {header.actions?.map((action, index) => {
                                    let backgroundColor =
                                        action.backgroundColor || theme.primary;
                                    let textColor = action.textColor || "white";
                                    if (loading.value) {
                                        backgroundColor = colors.grey.lighten3;
                                        textColor = theme["on-secondary"];
                                    }

                                    const content = (
                                        <ThemedView
                                            key={`${index}`}
                                            style={{
                                                width: "100%",
                                                borderRadius: "8px",
                                                // minHeight: 30,
                                                padding: "8px",
                                                backgroundColor:
                                                    typeof backgroundColor ==
                                                    "function"
                                                        ? backgroundColor(row)
                                                        : backgroundColor,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: "12px",
                                                justifyContent: "space-between",
                                            }}
                                            disabled={loading.value}
                                            onClick={async () => {
                                                if (loading.value) {
                                                    return;
                                                }
                                                loading.value = true;
                                                try {
                                                    await action.action(row, {
                                                        refresh: props.refresh,
                                                        reset: props.reset,
                                                        refreshAsIs:
                                                            props.refreshAsIs,
                                                    });
                                                } catch (error) {
                                                    console.error(error);
                                                } finally {
                                                    loading.value = false;
                                                }
                                            }}
                                        >
                                            {action.label && (
                                                <>
                                                    <ThemedText
                                                        style={{
                                                            // marginTop: action.label.match(/[gjpqy]/)  ? 0 : 2,
                                                            fontWeight: "600",
                                                            fontSize: "12px",
                                                            lineHeight: "12px",
                                                            color: textColor,
                                                        }}
                                                    >
                                                        {t(
                                                            typeof action.label ==
                                                                "function"
                                                                ? action.label(
                                                                      row,
                                                                  )
                                                                : action.label,
                                                        )}
                                                    </ThemedText>
                                                </>
                                            )}

                                            {loading.value ? (
                                                <>
                                                    <VProgressCircular
                                                        size={14}
                                                        indeterminate
                                                    ></VProgressCircular>
                                                </>
                                            ) : (
                                                action.iconName && (
                                                    <>
                                                        <Icon
                                                            icon={
                                                                typeof action.iconName ==
                                                                "function"
                                                                    ? action.iconName(
                                                                          row,
                                                                      )
                                                                    : action.iconName
                                                            }
                                                            color={textColor}
                                                            size={12}
                                                        ></Icon>
                                                    </>
                                                )
                                            )}
                                        </ThemedView>
                                    );

                                    const href = action.href;
                                    if (href) {
                                        return (
                                            <a
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                href={href(row)}
                                            >
                                                {content}
                                            </a>
                                        );
                                    }

                                    return content;
                                })}
                            </ThemedView>
                        </VMenu>
                    </>
                );
            }

            return (
                <ThemedView
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        gap: "12px",
                        padding: "12px",
                    }}
                >
                    {header.actions?.map((action, index) => {
                        // let backgroundColor =
                        //     action.backgroundColor || theme.primary;
                        // let textColor = action.textColor || "white";
                        let textColor = !action.backgroundColor
                            ? theme.primary
                            : typeof action.backgroundColor == "function"
                              ? action.backgroundColor(row)
                              : action.backgroundColor;
                        if (loading.value) {
                            // backgroundColor = colors.grey.lighten3;
                            textColor = theme["on-secondary"];
                        }

                        const content = (
                            <>
                                <ThemedView
                                    class="hoverable"
                                    key={`${index}`}
                                    style={{
                                        borderRadius: "8px",
                                        // minHeight: 30,
                                        padding: "8px",
                                        // backgroundColor:
                                        //     typeof backgroundColor == "function"
                                        //         ? backgroundColor(row)
                                        //         : backgroundColor,
                                        flexDirection: "row",
                                        color: textColor,
                                        alignItems: "center",
                                        gap: "12px",
                                        justifyContent: "space-between",
                                    }}
                                    onClick={async () => {
                                        if (loading.value) {
                                            return;
                                        }
                                        loading.value = true;
                                        try {
                                            await action.action(row, {
                                                refresh: props.refresh,
                                                reset: props.reset,
                                                refreshAsIs: props.refreshAsIs,
                                            });
                                        } catch (error) {
                                            console.error(error);
                                        } finally {
                                            loading.value = false;
                                        }
                                    }}
                                    disabled={loading.value}
                                >
                                    {loading.value ? (
                                        <>
                                            <VProgressCircular
                                                size={14}
                                                indeterminate
                                            ></VProgressCircular>
                                        </>
                                    ) : (
                                        action.iconName && (
                                            <>
                                                <Icon
                                                    icon={
                                                        typeof action.iconName ==
                                                        "function"
                                                            ? action.iconName(
                                                                  row,
                                                              )
                                                            : action.iconName
                                                    }
                                                    color={textColor}
                                                    size={14}
                                                ></Icon>
                                            </>
                                        )
                                    )}

                                    {action.label && (
                                        <>
                                            <ThemedText
                                                style={{
                                                    fontWeight: "600",
                                                    fontSize: "12px",
                                                    lineHeight: "12px",
                                                    color: textColor,
                                                }}
                                            >
                                                {t(
                                                    typeof action.label ==
                                                        "function"
                                                        ? action.label(row)
                                                        : action.label,
                                                )}
                                            </ThemedText>
                                        </>
                                    )}
                                </ThemedView>
                            </>
                        );

                        const href = action.href;
                        if (href) {
                            return (
                                <a
                                    style={{
                                        textDecoration: "none",
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    href={href(row)}
                                >
                                    {content}
                                </a>
                            );
                        }

                        return content;
                    })}
                </ThemedView>
            );
        };
    },
    {
        props: ["refreshAsIs", "header", "row", "reset", "refresh"],
    },
);
