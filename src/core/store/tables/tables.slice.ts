import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TableStateItem {
    tableKey: string;
    pageIndex: number;
    pageSize: number;
    sort: 'asc' | 'desc' | undefined;
    sortField?: string;
    filterValue?: string;
    filters?: Record<string, any>;
}

export interface TableState {
    hasTableState: boolean;
    tableState: TableStateItem[];
}

const initialState: TableState = {
    hasTableState: false,
    tableState: [],
};

const TableSlice = createSlice({
    name: "table",
    initialState,
    selectors: {
        hasTableState: (state: TableState) => state.hasTableState,
        getTableStateByKey: (state: TableState) => (key: string) => {
            return state.tableState.find((t) => t.tableKey === key);
        }
    },
    reducers: {
        saveTableState: (state: any, action: PayloadAction<TableStateItem>) => {
            const { tableKey, pageIndex, pageSize, sort, sortField, filterValue, filters } = action.payload;
            const existingIndex = state.tableState.findIndex((t: TableStateItem) => t.tableKey === tableKey);

            if (existingIndex >= 0) {
                state.tableState[existingIndex] = {
                    tableKey,
                    pageIndex,
                    pageSize,
                    sort,
                    sortField,
                    filterValue,
                    filters
                };
            } else {
                state.tableState.push({
                    tableKey,
                    pageIndex,
                    pageSize,
                    sort,
                    sortField,
                    filterValue,
                    filters
                });
            }
            state.hasTableState = true;
        },
        clearTableState: (state: any, action: PayloadAction<string>) => {
            state.tableState = state.tableState.filter((t: TableStateItem) => t.tableKey !== action.payload);
            state.hasTableState = state.tableState.length > 0;
        },
        clearAllTableStates: (state: any) => {
            state.hasTableState = false;
            state.tableState = [];
        },
    },
});

export const { saveTableState, clearTableState, clearAllTableStates } = TableSlice.actions;
export const { hasTableState, getTableStateByKey } = TableSlice.selectors;

export default TableSlice.reducer;