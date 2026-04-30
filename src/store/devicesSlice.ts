import {
    DeviceData,
    DeviceStatus,
    TypeDeviceName,
} from "@/shared/types/device.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useQueryClient } from "@tanstack/react-query";

export interface IDeviceStoreData {
    device_name: TypeDeviceName;
    data: Partial<DeviceData>;
}

export interface IDevicesStoreState {
    devices: IDeviceStoreData[];
}
const initialState: IDevicesStoreState = {
    devices: [],
};

export const devicesSlice = createSlice({
    name: "devices",
    initialState: initialState,
    reducers: {
        updateDeviceData: (state, action: PayloadAction<IDeviceStoreData>) => {
            const device = state.devices.find(
                (device) => device.device_name == action.payload.device_name
            );

            if (!device) {
                state.devices.push(action.payload);
                return;
            }

            const data = Object.assign({}, device.data, action.payload.data);

            device.data = data;
        },
    },
});

export const { updateDeviceData } = devicesSlice.actions;
