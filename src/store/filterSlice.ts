// import { DeviceData, TypeDeviceName } from "@/shared/types/device.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IFilter {
    name: string;
    values: [];
}

export interface ISetFilterAction {
    searchBy?: string;
    filter?: IFilter;
}

export interface IFilterStoreState {
    filters: IFilter[];
    searchBy?: string;
}
const initialState: IFilterStoreState = {
    filters: [],
    searchBy: "",
};

export const filtersSlice = createSlice({
    name: "filters",
    initialState: initialState,
    reducers: {
        updateFiltersData: (state, action: PayloadAction<ISetFilterAction>) => {
            console.log(action);
            console.log(state.filters);

            if (action.payload.searchBy || action.payload.searchBy === "") {
                state.searchBy = action.payload.searchBy;
            }

            if (action.payload.filter) {
                state.filters = [action.payload.filter];
            }
        },
    },
});

export const { updateFiltersData } = filtersSlice.actions;
