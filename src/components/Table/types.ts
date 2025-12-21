import { type AxiosRequestConfig } from "axios";
import { rs } from "@/utils/common";
import type { StyleValue } from "vue";

export const defaultNumberOfItemsPerPageChoices: {
    label: string;
    value: number;
}[] = [
    {
        label: "10",
        value: 10,
    },
    {
        label: "20",
        value: 20,
    },
    {
        label: "50",
        value: 50,
    },
    {
        label: "100",
        value: 100,
    },
    // {
    //     label: "All",
    //     value: -1,
    // },
];

export type IconProps = {
    onClick?: () => void | Promise<void>;
    color?: string;
    icon?: string;
    size?: string | number;
};

export type RefreshMethodApiWithoutSkip = (refreshProps: {
    queryParams?: any;
}) => Promise<void>;

export type RefreshMethodData = (refreshProps: {
    nextSkip: number;
}) => Promise<void>;

export type RefreshMethodWithNextSkip = (refreshProps: {
    queryParams?: any;
    nextSkip: number;
}) => Promise<void>;

export function readCell<T>(
    selector: ((row: T, index: number) => string) | string | string[],
    row: T,
    index: number,
): string {
    if (typeof selector == "function") {
        return selector(row, index) ?? "";
    }

    return rs(selector, row) ?? "";
}

type TableHeaderAction<T> = {
    action: (
        row: T,
        props: {
            refreshAsIs: () => void;
            reset: () => void;
            refresh: RefreshMethodWithNextSkip;
        },
    ) => void | Promise<void>;
    iconName?: ((row: T) => string) | string;
    label?: ((row: T) => string) | string;
    backgroundColor?: ((row: T) => string) | string;
    textColor?: string;
    href?: (row: T) => string;
};

export type TableHeader<T> = {
    Header?: () => JSX.Element; // --
    label?: string; // --
    CellTooltip?: ()=>JSX.Element;
    cellToolTip?: {
        text: (row: T)=>string;
        onClick?: (row: T)=>void;
    }
    headerIcon?: string; // --
    HeaderIcon?: (iconProps: Omit<IconProps, "name">) => JSX.Element; // --
    headerTextStyle?: StyleValue; // --
    rowTextStyle?: StyleValue;
    headerCellStyle?: StyleValue; // --
    rowCellStyle?: StyleValue; // --
    key: string; // --
    minWidth?: boolean; // - web only
    actions?: TableHeaderAction<T>[];
    menu?: boolean;
    value?: ((row: T, index: number) => string) | string | string[]; // --
    Value?: (props: { row: T }) => JSX.Element; // --
    sortable?: boolean;
    onHeaderPress?: () => void | Promise<void>; // --
    onCellPress?: (
        row: T,
        refresh: RefreshMethodData | RefreshMethodWithNextSkip,
    ) => void | Promise<void>; // --
};
export type BaseTableProps<T> = {
    placeDividers?: boolean;
    noElevation?: boolean;
    rowColor?: (row: T) => string | undefined;
    setNumberOfItemsPerPage?: (numberOfItemsPerPage: number) => void;
    numberOfItemsPerPageChoices?: false | { label: string; value: number }[];
    iconName?: string;
    loading?: boolean;
    setSearchValue?: (text: string | null) => void;
    searchValue?: string | null;
    Icon?: (iconProps: Omit<IconProps, "name">) => JSX.Element;
    numberOfItemsPerPage?: number;
    showNumber?: boolean;
    tableContainerStyle?: StyleValue; // --
    Row?: (props: { items: T }) => JSX.Element; // --
    headers: TableHeader<T>[]; // --
    title: string;
};

export type ApiTableProps<T> = BaseTableProps<T> & {
    url: string; // --

    TopSlot?: (props: {
        reset: () => void;
        refresh: RefreshMethodWithNextSkip;
        refreshAsIs: () => void;
    }) => JSX.Element;
    onRefresh: (
        props: {
            skip: number;
            page: number;
        },
        refresh: RefreshMethodApiWithoutSkip,
    ) => void; // --
    onSort?: (
        sortTarget: {
            headerKey: string;
            direction: "desc" | "asc";
        },
        refresh: RefreshMethodApiWithoutSkip,
    ) => Promise<void> | void;
    apiHeaders?: AxiosRequestConfig["headers"]; // --
    apiDataExtractor: (data: any) => T[]; // --
    apiTotalExtractor: (data: any) => number; // --
    apiPageSizeExtractor?: (data: any) => number; // --
};

export type DataTableProps<T> = BaseTableProps<T> & {
    data: T[];
    TopSlot?: (props: {
        refreshAsIs: () => void;
        reset: () => void;
        refresh: RefreshMethodWithNextSkip;
    }) => JSX.Element;
    loading?: boolean;
};
