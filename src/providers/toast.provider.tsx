import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../core/store/toast/toast.slice";
import type { AppState } from "../core/store/store";
import { Toast } from "../shared/components/UI/Toast";

interface ToastProviderProps {
    children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { message, type, duration, position, isVisible } = useSelector(
        (state: AppState) => state.toast
    );

    // We control visibility inside the Toast component itself for animations,
    // but we can also use this effect to ensure consistency with Redux state if needed.
    // However, the Toast component handles its own mounting/unmounting lifecycle via standard React rendering.
    // The previous implementation had a timer here, but the new Toast handles its own timer.
    // We just need to make sure we render it when isVisible is true.

    return (
        <>
            {children}
            {isVisible && (
                <Toast
                    message={message}
                    type={type}
                    duration={duration}
                    position={position || 'top-center'} // Default to top-center
                    onClose={() => dispatch(hideToast())}
                />
            )}
        </>
    );
};

export default ToastProvider;
