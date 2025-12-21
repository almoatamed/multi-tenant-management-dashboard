import "./styling.css";
import {
    readCell,
    type BaseTableProps,
    type IconProps,
    type RefreshMethodData,
    type RefreshMethodWithNextSkip,
    type TableHeader,
} from "./types";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useDisplay, useLocale } from "vuetify";
import Icon from "@/components/Icon/index.vue";
import { TableRowActions } from "./TableRowActions";
import { defineComponent } from "vue";
import { VDivider, VTooltip } from "vuetify/components";

const headerIconProps: Omit<IconProps, "icon"> = {
    // Todo
};

const HeaderCell = defineComponent(
    <T,>(props: { header: TableHeader<T> }) => {
        const locale = useLocale();
        const { t } = locale;
        return () => {
            const h = props.header;
            if (h.Header) {
                return <h.Header key={h.key}></h.Header>;
            }

            return (
                <ThemedView
                    onClick={h.onHeaderPress}
                    key={h.key}
                    style={[
                        {
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "4px",
                            justifyContent: "flex-start",
                        },
                        h.headerCellStyle,
                    ]}
                >
                    {h.label && (
                        <>
                            <ThemedText
                                style={[
                                    {
                                        // color: theme.onSurface + "66",
                                        color: "#7e7b77",
                                        fontSize: "12px",
                                    },
                                    h.headerTextStyle,
                                ]}
                            >
                                {t(h.label)}
                            </ThemedText>
                        </>
                    )}

                    {h.headerIcon && (
                        <>
                            <Icon
                                {...headerIconProps}
                                icon={h.headerIcon}
                                size="18px"
                            ></Icon>
                        </>
                    )}

                    {h.HeaderIcon && (
                        <>
                            <h.HeaderIcon {...headerIconProps}></h.HeaderIcon>
                        </>
                    )}
                </ThemedView>
            );
        };
    },
    {
        props: ["header"],
    },
);

export const Table = defineComponent(
    <T,>(
        props: BaseTableProps<T> & {
            data: T[];
            reset: () => void;
            refreshAsIs: () => void;
            refresh: RefreshMethodData | RefreshMethodWithNextSkip;
        } & {
            pageNumber: number;
            skip: number;
        },
    ) => {
        const display = useDisplay();
        return () => {
            const isMobile = display.mobile.value;
            const padding = !isMobile ? "20px 15px" : "6px 12px";

            return (
                <ThemedView>
                    <ThemedView
                        style={[props.tableContainerStyle]}
                        class="table-wrapper"
                    >
                        <table
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                padding: "0px",
                            }}
                        >
                            <thead>
                                <tr>
                                    {props.headers.map((header) => {
                                        return (
                                            <th
                                                key={header.key}
                                                style={{
                                                    padding: padding,

                                                    width: header.minWidth
                                                        ? "1px"
                                                        : undefined,
                                                }}
                                            >
                                                <HeaderCell
                                                    header={header}
                                                ></HeaderCell>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {props.data.map((row, index) => {
                                    if (props.Row) {
                                        return (
                                            <props.Row
                                                key={`${index}`}
                                                items={row}
                                            ></props.Row>
                                        );
                                    }

                                    return (
                                        <>
                                            <tr
                                                key={`${index + props.skip}`}
                                                style={{
                                                    backgroundColor:
                                                        props.rowColor?.(row) +
                                                        "44",
                                                    borderBottom:
                                                        index <
                                                            props.data.length -
                                                                1 &&
                                                        props.placeDividers
                                                            ? "solid 1px #7e7e7e33"
                                                            : undefined,
                                                }}
                                            >
                                                {props.headers.map(
                                                    (header, headerIndex) => {
                                                        if (header.Value) {
                                                            return (
                                                                <td
                                                                    key={String(
                                                                        headerIndex,
                                                                    )}
                                                                    style={{
                                                                        width: header.minWidth
                                                                            ? "1px"
                                                                            : undefined,
                                                                    }}
                                                                >
                                                                    <header.Value
                                                                        key={
                                                                            header.key
                                                                        }
                                                                        row={
                                                                            row
                                                                        }
                                                                    ></header.Value>
                                                                </td>
                                                            );
                                                        }

                                                        if (header.actions) {
                                                            return (
                                                                <td
                                                                    key={
                                                                        header.key
                                                                    }
                                                                >
                                                                    <TableRowActions
                                                                        refreshAsIs={
                                                                            props.refreshAsIs
                                                                        }
                                                                        header={
                                                                            header
                                                                        }
                                                                        refresh={
                                                                            props.refresh
                                                                        }
                                                                        reset={
                                                                            props.reset
                                                                        }
                                                                        row={
                                                                            row
                                                                        }
                                                                    ></TableRowActions>
                                                                </td>
                                                            );
                                                        }

                                                        if (header.value) {
                                                            return (
                                                                <td
                                                                    style={{
                                                                        padding:
                                                                            padding,

                                                                        cursor:
                                                                            header.onCellPress &&
                                                                            "pointer",
                                                                    }}
                                                                    onClick={
                                                                        header.onCellPress
                                                                            ? () => {
                                                                                  header.onCellPress?.(
                                                                                      row,
                                                                                      props.refresh,
                                                                                  );
                                                                              }
                                                                            : undefined
                                                                    }
                                                                    key={
                                                                        header.key
                                                                    }
                                                                >
                                                                    <ThemedText
                                                                        style={{
                                                                            color: "#111827",
                                                                            fontWeight:
                                                                                "600",
                                                                        }}
                                                                    >
                                                                        {header.CellTooltip ? (
                                                                            <>
                                                                                <VTooltip
                                                                                    activator={
                                                                                        "parent"
                                                                                    }
                                                                                    interactive={
                                                                                        true
                                                                                    }
                                                                                >
                                                                                    {header.CellTooltip()}
                                                                                </VTooltip>
                                                                            </>
                                                                        ) : header.cellToolTip &&
                                                                          header.cellToolTip.text(
                                                                              row,
                                                                          ) ? (
                                                                            <>
                                                                                <VTooltip
                                                                                    interactive={
                                                                                        !!header
                                                                                            .cellToolTip
                                                                                            .onClick
                                                                                    }
                                                                                    activator={
                                                                                        "parent"
                                                                                    }
                                                                                >
                                                                                    <ThemedView
                                                                                        onClick={() =>
                                                                                            header.cellToolTip?.onClick?.(
                                                                                                row,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {header.cellToolTip.text(
                                                                                            row,
                                                                                        )}
                                                                                    </ThemedView>
                                                                                </VTooltip>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}

                                                                        {readCell(
                                                                            header.value,
                                                                            row,
                                                                            index,
                                                                        )}
                                                                    </ThemedText>
                                                                </td>
                                                            );
                                                        }

                                                        return (
                                                            <td
                                                                key={header.key}
                                                            >
                                                                {" "}
                                                            </td>
                                                        );
                                                    },
                                                )}
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </ThemedView>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "Icon",
            "Row",
            "placeDividers",
            "data",
            "headers",
            "iconName",
            "numberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
            "pageNumber",
            "refresh",
            "rowColor",
            "searchValue",
            "setNumberOfItemsPerPage",
            "setSearchValue",
            "showNumber",
            "refreshAsIs",
            "skip",
            "string",
            "tableContainerStyle",
            "title",
            "reset",
        ] as any[],
    },
);
