import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
    message: string;
    type: "success" | "error" | "warning" | "info";
    duration?: number;
    position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
    isVisible: boolean;
}

const initialState: ToastState = {
    message: "",
    type: "info",
    duration: 3000,
    position: "top-center",
    isVisible: false,
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state: ToastState, action: PayloadAction<Omit<ToastState, "isVisible">>) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.duration = action.payload.duration || 1500;
            state.position = action.payload.position || "top-center";
            state.isVisible = true;
        },
        hideToast: (state: ToastState) => {
            state.isVisible = false;
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;