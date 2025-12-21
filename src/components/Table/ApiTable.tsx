import { Table } from "./Table";
import {
    type ApiTableProps,
    defaultNumberOfItemsPerPageChoices,
    type RefreshMethodApiWithoutSkip,
} from "./types";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { TableFooter, TableHeader } from "./HeaderFooter";
import { api } from "@/state/api";
import { useDisplay, useTheme } from "vuetify";
import { AlertView } from "../AlertView";
import { VDivider, VProgressCircular } from "vuetify/components";
import { computed, defineComponent, ref, watch } from "vue";
import { defaultBoxShadow } from "@/constants/styling";

export const ApiTable = defineComponent(
    <T,>(props: ApiTableProps<T>) => {
        const data = ref<T[]>([]);
        const total = ref(0);
        const skip = ref(0);
        const loading = ref(false);
        const errMsg = ref(null as null | string);
        const numberOfItemsPerPage = computed(() => {
            return props.numberOfItemsPerPage || 10;
        });

        const currentPage = computed(() => {
            return numberOfItemsPerPage.value < 1
                ? 1
                : Math.ceil(
                      Math.abs(skip.value / numberOfItemsPerPage.value) + 1,
                  );
        });
        const refresh = async ({
            queryParams,
            nextSkip,
        }: {
            queryParams?: any;
            nextSkip: number;
        }) => {
            const apiHeaders = props.apiHeaders;
            const url = props.url;
            console.log("called Refresh...", {
                apiHeaders,
                url,
                queryParams,
            });
            loading.value = true;
            errMsg.value = null;

            try {
                const result = await api.get(url, {
                    params: queryParams,
                    headers: apiHeaders,
                });
                console.log("result", props.title, {
                    queryParams,
                    nextSkip,
                    result: result.data,
                });
                const _data = props.apiDataExtractor(result.data);
                skip.value = nextSkip;
                data.value = _data;
                total.value = props.apiTotalExtractor(result.data);
                if (props.apiPageSizeExtractor) {
                    console.log(
                        "Setting page size from data",
                        props.apiPageSizeExtractor(result.data),
                    );
                    props.setNumberOfItemsPerPage?.(
                        props.apiPageSizeExtractor(result.data),
                    );
                }
            } catch (error) {
                console.log("Refresh Error", error);
                errMsg.value = "Something Went Wrong!";
            } finally {
                loading.value = false;
            }
        };

        const reset = () =>
            props.onRefresh(
                {
                    page: 1,
                    skip: 0,
                },
                (async (props) => {
                    refresh({
                        ...props,
                        nextSkip: 0,
                    });
                }) satisfies RefreshMethodApiWithoutSkip,
            );

        const refreshAsIs = () =>
            props.onRefresh(
                {
                    page: currentPage.value,
                    skip: skip.value,
                },
                (async (props) => {
                    refresh({
                        ...props,
                        nextSkip: skip.value,
                    });
                }) satisfies RefreshMethodApiWithoutSkip,
            );

        const display = useDisplay();
        const isMobile = computed(() => {
            return display.mobile.value;
        });

        watch(
            [() => props.numberOfItemsPerPage, () => props.url],
            () => {
                reset();
            },
            {
                immediate: true,
            },
        );

        const onSearch = () => reset();

        const theme = computed(() => {
            return useTheme().current.value.colors;
        });

        const numberOfPages = computed(() => {
            return numberOfItemsPerPage.value < 1
                ? 1
                : Math.ceil(
                      Math.abs(total.value / numberOfItemsPerPage.value),
                  ) || 1;
        });

        const goToPage = (targetPageNumber: number) => {
            if (
                targetPageNumber <= numberOfPages.value &&
                targetPageNumber > 0 &&
                targetPageNumber != currentPage.value
            ) {
                console.log("going to page", targetPageNumber);
                const newSkipValue =
                    numberOfItemsPerPage.value * (targetPageNumber - 1);

                props.onRefresh(
                    {
                        skip: newSkipValue,
                        page: targetPageNumber,
                    },
                    (async (props) => {
                        refresh({
                            ...props,
                            nextSkip: newSkipValue,
                        });
                    }) satisfies RefreshMethodApiWithoutSkip,
                );
            }
        };

        const hasNext = computed(() => {
            return currentPage.value < numberOfPages.value;
        });

        const next = () => {
            if (hasNext.value) {
                goToPage(currentPage.value + 1);
            }
        };

        const hasPrev = computed(() => {
            return currentPage.value > 1;
        });
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
                        // border: "solid 1px #e5e5e9",
                        // boxShadow: "0px 10px 12px -12px #00000055",
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
                    {loading.value ? (
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
                    ) : errMsg.value ? (
                        <>
                            <AlertView
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: 100,
                                    flex: "1",
                                }}
                                message={errMsg.value}
                                type="error"
                            ></AlertView>
                        </>
                    ) : data.value?.length ? (
                        <>
                            <Table
                                {...props}
                                reset={reset}
                                skip={skip.value}
                                pageNumber={currentPage.value}
                                data={data.value as T[]}
                                refresh={refresh}
                                refreshAsIs={refreshAsIs}
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
                                        minHeight: 100,
                                        flex: "1",
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            color: theme.value.onSurface + "77",
                                        }}
                                    >
                                        No Data Found
                                    </ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </>
                    )}
                    <TableFooter
                        numberOfItemsPerPage={props.numberOfItemsPerPage || 10}
                        numberOfItemsPerPageChoices={
                            props.numberOfItemsPerPageChoices === undefined
                                ? defaultNumberOfItemsPerPageChoices
                                : props.numberOfItemsPerPageChoices || undefined
                        }
                        setNumberOfItemsPerPage={props.setNumberOfItemsPerPage}
                        totalDataLength={total.value}
                        currentPage={currentPage.value}
                        goToPage={goToPage}
                        numberOfPages={numberOfPages.value}
                        loading={loading.value}
                        hasNext={hasNext.value}
                        hasPrev={hasPrev.value}
                        next={next}
                        prev={prev}
                    ></TableFooter>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "Icon",
            "Row",
            "TopSlot",
            "apiDataExtractor",
            "apiHeaders",
            "apiTotalExtractor",
            "headers",
            "placeDividers",
            "iconName",
            "loading",
            "numberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
            "onRefresh",
            "onSort",
            "noElevation",
            "rowColor",
            "searchValue",
            "setNumberOfItemsPerPage",
            "setSearchValue",
            "showNumber",
            "tableContainerStyle",
            "title",
            "url",
            "apiPageSizeExtractor",
        ] as any[],
    },
);

export default ApiTable;
