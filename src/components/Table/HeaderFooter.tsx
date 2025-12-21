import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { type IconProps, type RefreshMethodWithNextSkip } from "./types";
import { defaultBoxShadow } from "@/constants/styling/index";
import { useDisplay, useLocale, useTheme } from "vuetify";
import Icon from "@/components/Icon/index.vue";
import TextField from "@/components/TextField/index.vue";
import { VAutocomplete, VForm, VProgressLinear } from "vuetify/components";
import { computed, defineComponent, ref } from "vue";

export const TableFooter = defineComponent<{
    hasPrev: boolean;
    totalDataLength: number;
    prev: () => void;
    setNumberOfItemsPerPage?: (numberOfItemsPerPage: number) => void;
    numberOfItemsPerPageChoices?: { label: string; value: number }[];

    hasNext: boolean;
    numberOfItemsPerPage: number;
    loading: boolean;

    currentPage: number;
    numberOfPages: number;
    goToPage: (targetPageNumber: number) => void;
    next: () => void;
}>(
    (props) => {
        const display = useDisplay();
        const isMobile = computed(() => {
            return display.mobile.value;
        });

        console.log(
            "props.numberOfItemsPerPageChoices",
            props.numberOfItemsPerPageChoices,
        );
        return () => {
            if (isMobile.value) {
                return (
                    <TableFooterMobile
                        totalDataLength={props.totalDataLength}
                        loading={props.loading}
                        numberOfItemsPerPage={props.numberOfItemsPerPage}
                        hasNext={props.hasNext}
                        hasPrev={props.hasPrev}
                        next={props.next}
                        prev={props.prev}
                        currentPage={props.currentPage}
                        goToPage={props.goToPage}
                        numberOfItemsPerPageChoices={
                            props.numberOfItemsPerPageChoices
                        }
                        setNumberOfItemsPerPage={props.setNumberOfItemsPerPage}
                        numberOfPages={props.numberOfPages}
                    ></TableFooterMobile>
                );
            }
            return (
                <TableFooterDesktop
                    numberOfItemsPerPageChoices={
                        props.numberOfItemsPerPageChoices
                    }
                    setNumberOfItemsPerPage={props.setNumberOfItemsPerPage}
                    totalDataLength={props.totalDataLength}
                    numberOfItemsPerPage={props.numberOfItemsPerPage}
                    loading={props.loading}
                    hasNext={props.hasNext}
                    hasPrev={props.hasPrev}
                    next={props.next}
                    prev={props.prev}
                    currentPage={props.currentPage}
                    goToPage={props.goToPage}
                    numberOfPages={props.numberOfPages}
                ></TableFooterDesktop>
            );
        };
    },
    {
        props: [
            "currentPage",
            "goToPage",
            "hasNext",
            "hasPrev",
            "loading",
            "next",
            "numberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
            "numberOfPages",
            "prev",
            "setNumberOfItemsPerPage",
            "totalDataLength",
        ],
    },
);

type TableHeaderProps = {
    refresh: RefreshMethodWithNextSkip;
    setSearchValue?: (text: string | null) => void;
    searchValue?: string | null;
    onSearch?: () => Promise<void> | void;
    iconName?: string;
    Icon?: (iconProps: Omit<IconProps, "icon">) => JSX.Element;
    title: string;
    loading: boolean;
};

export const TableHeader = defineComponent<TableHeaderProps>(
    (props) => {
        const display = useDisplay();
        const isMobile = computed(() => {
            return display.mobile.value;
        });
        return () => {
            if (isMobile.value) {
                return <TableHeaderMobile {...props}></TableHeaderMobile>;
            }

            return <TableHeaderDesktop {...props}></TableHeaderDesktop>;
        };
    },
    {
        props: [
            "Icon",
            "iconName",
            "onSearch",
            "refresh",
            "searchValue",
            "setSearchValue",
            "title",
            "loading",
        ],
    },
);

const TableHeaderDesktop = defineComponent(
    (props: TableHeaderProps) => {
        return () => {
            return (
                <ThemedView
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        paddingRight: "12px",
                        paddingLeft: "12px",
                    }}
                >
                    <HeaderLeft {...props}></HeaderLeft>
                    <HeaderRight {...props}></HeaderRight>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "Icon",
            "iconName",
            "onSearch",
            "loading",
            "refresh",
            "searchValue",
            "setSearchValue",
            "title",
        ],
    },
);

const TableHeaderMobile = defineComponent<TableHeaderProps>(
    (props) => {
        return () => {
            return (
                <ThemedView
                    style={{
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <HeaderLeft {...props}></HeaderLeft>
                    <HeaderRight {...props}></HeaderRight>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "refresh",
            "setSearchValue",
            "searchValue",
            "onSearch",
            "loading",
            "iconName",
            "Icon",
            "title",
        ],
    },
);

const HeaderLeft = defineComponent<TableHeaderProps>(
    (props) => {
        const { t } = useLocale();
        return () => {
            const theme = useTheme().current.value.colors;

            const iconProps: IconProps = {
                color: theme.primary,
                size: "18px",
            };
            return (
                <ThemedView
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    {props.Icon || props.iconName ? (
                        <ThemedView
                            style={{
                                padding: "5px",
                                backgroundColor: "#fff",
                                borderRadius: "3px",
                                boxShadow: defaultBoxShadow,
                            }}
                        >
                            {props.Icon ? (
                                <props.Icon {...iconProps}></props.Icon>
                            ) : props.iconName ? (
                                <>
                                    <Icon
                                        {...iconProps}
                                        icon={props.iconName}
                                    ></Icon>
                                </>
                            ) : (
                                <></>
                            )}
                        </ThemedView>
                    ) : (
                        <></>
                    )}

                    <ThemedView
                        style={{
                            gap: "2px",
                        }}
                    >
                        <ThemedText
                            style={{
                                color: "#6B7177",
                                fontWeight: "600",
                                fontSize: "18px",
                            }}
                        >
                            {t(props.title)}
                        </ThemedText>
                        {props.loading && (
                            <VProgressLinear indeterminate></VProgressLinear>
                        )}
                    </ThemedView>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "refresh",
            "loading",
            "setSearchValue",
            "searchValue",
            "onSearch",
            "iconName",
            "Icon",
            "title",
        ],
    },
);

const Search = defineComponent<{
    setSearchValue?: (text: string | null) => void;
    searchValue?: string | null;
    refresh: RefreshMethodWithNextSkip;
    onSearch?: () => Promise<void> | void;
    loading: boolean;
}>(
    (props) => {
        const locale = useLocale();
        const { t } = locale;
        return () => {
            if (!props.onSearch || !props.setSearchValue) {
                return <ThemedView></ThemedView>;
            }

            return (
                <TextField
                    minWidth={"200px"}
                    variant="outlined"
                    density={"compact"}
                    hideDetails
                    color="primary"
                    loading={false}
                    disabled={props.loading}
                    rounded
                    onUpdate:modelValue={(text) => props.setSearchValue?.(text)}
                    modelValue={props.searchValue || null}
                    placeholder={t("Search")}
                    onKeyup={(e) => {
                        console.log("submitted", e.key, props.searchValue);

                        if (e.key == "Enter") {
                            props.onSearch?.();
                        }
                    }}
                >
                    {{
                        "prepend-inner": () => {
                            return (
                                <Icon
                                    onClick={() => {
                                        props.onSearch?.();
                                    }}
                                    icon="mdi-magnify"
                                ></Icon>
                            );
                        },
                    }}
                </TextField>
            );
        };
    },
    {
        props: [
            "setSearchValue",
            "loading",
            "searchValue",
            "refresh",
            "onSearch",
        ],
    },
);

const HeaderRight = defineComponent(
    (props: TableHeaderProps) => {
        const display = useDisplay();
        return () => {
            const isMobile = display.mobile.value;
            return (
                <ThemedView
                    style={
                        isMobile
                            ? {
                                  flexDirection: "column",
                                  gap: "12px",
                              }
                            : { flexDirection: "row", gap: "10px" }
                    }
                >
                    <Search {...props}></Search>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "refresh",
            "setSearchValue",
            "searchValue",
            "onSearch",
            "iconName",
            "Icon",
            "loading",
            "title",
        ],
    },
);

const TableFooterLeft = defineComponent(
    (props: {
        totalDataLength: number;
        hasPrev: boolean;
        prev: () => void;
        hasNext: boolean;
        loading: boolean;
        next: () => void;

        currentPage: number;
        numberOfPages: number;
        goToPage: (targetPageNumber: number) => void;
    }) => {
        const display = useDisplay();
        return () => {
            const isMobile = display.mobile.value;

            if (props.totalDataLength == 0) {
                return <></>;
            }

            return (
                <ThemedView
                    style={{
                        gap: isMobile ? "12px" : "24px",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <PrevButton
                        loading={props.loading}
                        hasPrev={props.hasPrev}
                        prev={props.prev}
                    ></PrevButton>
                    <PagesNumbers
                        style={{
                            paddingBottom: "0px",
                        }}
                        loading={props.loading}
                        currentPage={props.currentPage}
                        goToPage={props.goToPage}
                        numberOfPages={props.numberOfPages}
                    ></PagesNumbers>
                    <NextButton
                        loading={props.loading}
                        hasNext={props.hasNext}
                        next={props.next}
                    ></NextButton>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "totalDataLength",
            "hasPrev",
            "prev",
            "hasNext",
            "loading",
            "next",
            "currentPage",
            "numberOfPages",
            "goToPage",
        ],
    },
);

const PagesNumbers = defineComponent(
    (props: {
        currentPage: number;
        numberOfPages: number;
        goToPage: (targetPageNumber: number) => void;
        loading: boolean;
    }) => {
        return () => {
            const theme = useTheme().current.value.colors;
            const rangedLength = 2;
            const textColor = props.loading ? theme.info : undefined;

            let startSection = <></>;
            if (props.currentPage > rangedLength + 1) {
                startSection = (
                    <ThemedText
                        style={{
                            color: textColor,
                        }}
                        onClick={() => props.goToPage(1)}
                    >
                        1
                        {props.currentPage - rangedLength - 1 == 1 ? "" : "..."}
                    </ThemedText>
                );
            }

            let lastSection = <></>;
            if (props.currentPage < props.numberOfPages - rangedLength) {
                lastSection = (
                    <ThemedText
                        style={{
                            color: textColor,
                        }}
                        onClick={() => props.goToPage(props.numberOfPages)}
                    >
                        {props.currentPage + rangedLength + 1 ==
                        props.numberOfPages
                            ? ""
                            : "..."}
                        {props.numberOfPages}
                    </ThemedText>
                );
            }

            const previousPagesNumbers: JSX.Element[] = [];
            for (
                let i =
                    props.currentPage - rangedLength > 1
                        ? props.currentPage - rangedLength
                        : 1;
                i < props.currentPage;
                i++
            ) {
                previousPagesNumbers.push(
                    <ThemedText
                        key={`${i}`}
                        style={{
                            color: textColor,
                        }}
                        onClick={() => props.goToPage(i)}
                    >
                        {i}
                    </ThemedText>,
                );
            }

            const nextPagesNumbers: JSX.Element[] = [];
            for (
                let i = props.currentPage + 1;
                i <=
                Math.min(props.numberOfPages, props.currentPage + rangedLength);
                i++
            ) {
                nextPagesNumbers.push(
                    <ThemedText
                        key={`${i}`}
                        style={{
                            color: textColor,
                        }}
                        onClick={() => props.goToPage(i)}
                    >
                        {i}
                    </ThemedText>,
                );
            }

            return (
                <ThemedView
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "14px",
                    }}
                >
                    {startSection}
                    {previousPagesNumbers}
                    <ThemedText
                        style={{
                            color: theme.primary,
                        }}
                    >
                        {props.currentPage}
                    </ThemedText>
                    {nextPagesNumbers}
                    {lastSection}
                </ThemedView>
            );
        };
    },
    {
        props: ["currentPage", "numberOfPages", "goToPage", "loading"],
    },
);

const PrevButton = defineComponent(
    (props: { loading: boolean; hasPrev: boolean; prev: () => void }) => {
        const locale = useLocale();
        console.log("is rtl", locale.isRtl.value);
        return () => {
            const theme = useTheme().current.value.colors;
            return (
                <ThemedView
                    style={{
                        borderRadius: "6px",
                        borderWidth: "1",
                        borderColor: theme.info,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    disabled={!props.hasPrev || props.loading}
                    onClick={() => {
                        props.prev();
                    }}
                >
                    <Icon
                        color={props.hasPrev ? theme.onSurface : theme.info}
                        icon={
                            locale.isRtl.value
                                ? "mdi-chevron-right"
                                : "mdi-chevron-left"
                        }
                    ></Icon>
                </ThemedView>
            );
        };
    },
    {
        props: ["loading", "hasPrev", "prev"],
    },
);
const NextButton = defineComponent(
    (props: { loading: boolean; hasNext: boolean; next: () => void }) => {
        const locale = useLocale();
        return () => {
            const theme = useTheme().current.value.colors;
            return (
                <ThemedView
                    style={{
                        borderRadius: "6px",
                        borderWidth: "1",
                        borderColor: theme.info,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    disabled={!props.hasNext || props.loading}
                    onClick={() => {
                        props.next();
                    }}
                >
                    <Icon
                        color={props.hasNext ? theme.onSurface : theme.info}
                        icon={
                            locale.isRtl.value
                                ? "mdi-chevron-left"
                                : "mdi-chevron-right"
                        }
                    ></Icon>
                </ThemedView>
            );
        };
    },
    {
        props: ["loading", "hasNext", "next"],
    },
);

const TableFooterRight = defineComponent(
    (props: {
        dataLength: number;
        numberOfItemsPerPage: number;
        setNumberOfItemsPerPage?: (numberOfItemsPerPage: number) => void;
        numberOfItemsPerPageChoices?: { label: string; value: number }[];
    }) => {
        const selectedNumberOfItemsPerPage = ref(
            props.numberOfItemsPerPageChoices?.find((choice) => {
                return choice.value == props.numberOfItemsPerPage;
            }) || (null as null | { label: string; value: number }),
        );

        watch([() => props.numberOfItemsPerPage], (v) => {
            selectedNumberOfItemsPerPage.value =
                props.numberOfItemsPerPageChoices?.find((choice) => {
                    return choice.value == props.numberOfItemsPerPage;
                }) || null;
        });

        console.log("Footer right", props);
        return () => {
            if (
                !props.dataLength ||
                !props.setNumberOfItemsPerPage ||
                !props.numberOfItemsPerPageChoices
            ) {
                return <></>;
            }

            const autocompleteRef = ref(
                null as null | InstanceType<typeof VAutocomplete>,
            );

            return (
                <ThemedView
                    style={{
                        width: "150px",
                    }}
                >
                    <VForm>
                        <VAutocomplete
                            variant="outlined"
                            density={"compact"}
                            hideDetails
                            type={"data"}
                            color="primary"
                            ref={(r) => {
                                autocompleteRef.value = r as any;
                            }}
                            items={props.numberOfItemsPerPageChoices || []}
                            onUpdate:modelValue={(item) => {
                                console.log(item);
                                console.log("");
                                selectedNumberOfItemsPerPage.value = item;
                                props.setNumberOfItemsPerPage?.(item.value);
                                autocompleteRef.value?.blur();
                            }}
                            itemValue={(item) => item}
                            modelValue={selectedNumberOfItemsPerPage.value}
                            itemTitle={(item) => item.label}
                        ></VAutocomplete>
                    </VForm>
                </ThemedView>
            );
        };
    },
    {
        props: [
            "dataLength",
            "numberOfItemsPerPage",
            "setNumberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
        ],
    },
);

const TableFooterMobile = defineComponent(
    (props: {
        totalDataLength: number;
        hasPrev: boolean;
        setNumberOfItemsPerPage?: (numberOfItemsPerPage: number) => void;
        numberOfItemsPerPageChoices?: { label: string; value: number }[];
        numberOfItemsPerPage: number;
        prev: () => void;
        hasNext: boolean;
        loading: boolean;
        next: () => void;

        currentPage: number;
        numberOfPages: number;
        goToPage: (targetPageNumber: number) => void;
    }) => {
        return () => {
            return (
                <ThemedView
                    style={{
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <TableFooterLeft
                        totalDataLength={props.totalDataLength}
                        loading={props.loading}
                        hasNext={props.hasNext}
                        hasPrev={props.hasPrev}
                        next={props.next}
                        currentPage={props.currentPage}
                        goToPage={props.goToPage}
                        numberOfPages={props.numberOfPages}
                        prev={props.prev}
                    />
                    <TableFooterRight
                        dataLength={props.totalDataLength}
                        numberOfItemsPerPageChoices={
                            props.numberOfItemsPerPageChoices
                        }
                        numberOfItemsPerPage={props.numberOfItemsPerPage}
                        setNumberOfItemsPerPage={props.setNumberOfItemsPerPage}
                    />
                </ThemedView>
            );
        };
    },
    {
        props: [
            "totalDataLength",
            "hasPrev",
            "setNumberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
            "numberOfItemsPerPage",
            "prev",
            "hasNext",
            "loading",
            "next",
            "currentPage",
            "numberOfPages",
            "goToPage",
        ],
    },
);

const TableFooterDesktop = defineComponent(
    (props: {
        hasPrev: boolean;
        setNumberOfItemsPerPage?: (numberOfItemsPerPage: number) => void;
        numberOfItemsPerPageChoices?: { label: string; value: number }[];
        numberOfItemsPerPage: number;

        prev: () => void;
        totalDataLength: number;

        currentPage: number;
        numberOfPages: number;
        goToPage: (targetPageNumber: number) => void;
        hasNext: boolean;
        next: () => void;
        loading: boolean;
    }) => {
        return () => {
            console.log("choices!", props.numberOfItemsPerPageChoices);
            return (
                <ThemedView
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "12px",
                        paddingRight: "12px",
                        paddingLeft: "12px",
                    }}
                >
                    <TableFooterLeft
                        totalDataLength={props.totalDataLength}
                        loading={props.loading}
                        hasNext={props.hasNext}
                        hasPrev={props.hasPrev}
                        next={props.next}
                        prev={props.prev}
                        currentPage={props.currentPage}
                        goToPage={props.goToPage}
                        numberOfPages={props.numberOfPages}
                    />
                    <TableFooterRight
                        dataLength={props.totalDataLength}
                        numberOfItemsPerPage={props.numberOfItemsPerPage}
                        numberOfItemsPerPageChoices={
                            props.numberOfItemsPerPageChoices
                        }
                        setNumberOfItemsPerPage={props.setNumberOfItemsPerPage}
                    />
                </ThemedView>
            );
        };
    },
    {
        props: [
            "hasPrev",
            "setNumberOfItemsPerPage",
            "numberOfItemsPerPageChoices",
            "numberOfItemsPerPage",
            "prev",
            "totalDataLength",
            "currentPage",
            "numberOfPages",
            "goToPage",
            "hasNext",
            "next",
            "loading",
        ],
    },
);
