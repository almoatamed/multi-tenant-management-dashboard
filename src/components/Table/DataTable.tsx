import { Table } from "./Table";
import {
    type DataTableProps,
    defaultNumberOfItemsPerPageChoices,
    type RefreshMethodApiWithoutSkip,
    type RefreshMethodData,
} from "./types";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { TableFooter, TableHeader } from "./HeaderFooter";
import { useDisplay, useTheme } from "vuetify";
import { VDivider, VProgressCircular } from "vuetify/components";
import { computed, defineComponent, ref, watch } from "vue";
import { defaultBoxShadow } from "@/constants/styling";

export const DataTable = defineComponent(
    <T,>(props: DataTableProps<T>) => {
        const allData = computed(() => props.data);
        const total = ref(props.data.length);
        const data = ref<T[]>([]);
        const skip = ref(0);

        const numberOfItemsPerPage = computed(
            () => props.numberOfItemsPerPage || 10,
        );

        const refresh: RefreshMethodData = async ({
            nextSkip,
        }: {
            nextSkip: number;
        }) => {
            let _data = allData.value.filter((row) => {
                if (props.searchValue) {
                    return JSON.stringify(row)
                        .toLowerCase()
                        .includes(props.searchValue.toLowerCase());
                }
                return true;
            });
            const totalLength = _data.length;
            if (nextSkip > _data.length - 1) {
                nextSkip = 0;
            }
            if (numberOfItemsPerPage.value > 0) {
                _data = _data.slice(
                    nextSkip,
                    nextSkip + numberOfItemsPerPage.value,
                );
            }
            total.value = totalLength;
            skip.value = nextSkip;
            data.value = _data;
        };

        const display = useDisplay();
        const isMobile = computed(() => display.mobile.value);
        const reset = () =>
            refresh({
                nextSkip: 0,
            });

        const refreshAsIs = () => {
            refresh({
                nextSkip: skip.value,
            });
        };

        watch(
            () => props.numberOfItemsPerPage,
            () => {
                reset();
            },
            {
                immediate: true,
            },
        );

        watch([() => skip.value, () => props.data], () => {
            refresh({
                nextSkip: skip.value,
            });
        });

        const onSearch = () => reset();

        const currentTheme = useTheme();
        const theme = computed(() => currentTheme.current.value.colors);

        const numberOfPages = computed(() => {
            return numberOfItemsPerPage.value < 1
                ? 1
                : Math.ceil(
                      Math.abs(total.value / numberOfItemsPerPage.value),
                  ) || 1;
        });

        const currentPage = computed(() => {
            return numberOfItemsPerPage.value < 1
                ? 1
                : Math.ceil(
                      Math.abs(skip.value / numberOfItemsPerPage.value) + 1,
                  );
        });

        const goToPage = (targetPageNumber: number) => {
            if (
                targetPageNumber <= numberOfPages.value &&
                targetPageNumber > 0 &&
                targetPageNumber != currentPage.value
            ) {
                const newSkipValue =
                    numberOfItemsPerPage.value * (targetPageNumber - 1);
                refresh({
                    nextSkip: newSkipValue,
                });
            }
        };

        const hasNext = computed(() => currentPage.value < numberOfPages.value);
        const next = () => {
            if (hasNext.value) {
                goToPage(currentPage.value + 1);
            }
        };

        const hasPrev = computed(() => currentPage.value > 1);
        const prev = () => {
            if (hasPrev.value) {
                goToPage(currentPage.value - 1);
            }
        };

        return () => {
            if (props.showNumber) {
                if (props.headers[0]?.key != "__no") {
                    props.headers.unshift({
                        value: (_, index) => String(index + 1 + skip.value),
                        key: "__no",
                        label: "No.",
                        minWidth: true,
                    });
                } else {
                    props.headers[0] = {
                        value: (_, index) => String(index + 1 + skip.value),
                        key: "__no",
                        label: "No",
                        minWidth: true,
                    };
                }
            }
            return (
                <>
                    <ThemedView
                        style={{
                            flexDirection: "column",
                            gap: "12px",
                            padding: isMobile.value ? "12px" : "22px 12px",
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            boxShadow: props.noElevation
                                ? undefined
                                : defaultBoxShadow,
                        }}
                    >
                        {props.TopSlot ? (
                            <ThemedView
                                style={{
                                    gap: "12px",
                                }}
                            >
                                {props.TopSlot({ refresh, reset, refreshAsIs })}
                                <VDivider></VDivider>
                            </ThemedView>
                        ) : (
                            <></>
                        )}

                        <TableHeader
                            loading={!!props.loading}
                            onSearch={onSearch}
                            searchValue={props.searchValue}
                            setSearchValue={props.setSearchValue}
                            title={props.title}
                            refresh={refresh}
                            Icon={props.Icon}
                            iconName={props.iconName}
                        ></TableHeader>
                        {props.loading ? (
                            <>
                                <ThemedView
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    <VProgressCircular
                                        indeterminate
                                        size={"72"}
                                        color="primary"
                                    ></VProgressCircular>
                                </ThemedView>
                            </>
                        ) : data.value.length ? (
                            <>
                                <Table
                                    {...props}
                                    refreshAsIs={refreshAsIs}
                                    reset={reset}
                                    skip={skip.value}
                                    pageNumber={currentPage.value}
                                    data={data.value as T[]}
                                    refresh={refresh}
                                ></Table>
                            </>
                        ) : (
                            <>
                                <ThemedView
                                    id="NoData"
                                    style={{
                                        padding: "8px",
                                        borderWidth: "1",
                                        borderColor: theme.value.info,
                                    }}
                                >
                                    <ThemedView
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minHeight: "100px",
                                            flex: "1",
                                        }}
                                    >
                                        <ThemedText
                                            style={{
                                                color:
                                                    theme.value.onSurface +
                                                    "77",
                                            }}
                                        >
                                            No Data Found
                                        </ThemedText>
                                    </ThemedView>
                                </ThemedView>
                            </>
                        )}
                        <TableFooter
                            numberOfItemsPerPage={numberOfItemsPerPage.value}
                            numberOfItemsPerPageChoices={
                                props.numberOfItemsPerPageChoices === undefined
                                    ? defaultNumberOfItemsPerPageChoices
                                    : props.numberOfItemsPerPageChoices ||
                                      undefined
                            }
                            setNumberOfItemsPerPage={
                                props.setNumberOfItemsPerPage
                            }
                            totalDataLength={total.value}
                            currentPage={currentPage.value}
                            goToPage={goToPage}
                            numberOfPages={numberOfPages.value}
                            loading={props.loading || false}
                            hasNext={hasNext.value}
                            hasPrev={hasPrev.value}
                            next={next}
                            prev={prev}
                        ></TableFooter>
                    </ThemedView>
                </>
            );
        };
    },
    {
        props: [
            "Icon",
            "Row",
            "data",
            "headers",
            "iconName",
            "loading",
            "TopSlot",
            "numberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
            "rowColor",
            "searchValue",
            "setNumberOfItemsPerPage",
            "setSearchValue",
            "placeDividers",
            "showNumber",
            "tableContainerStyle",
            "noElevation",
            "title",
        ] as any[],
    },
);

export default DataTable;
