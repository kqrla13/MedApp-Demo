import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
    onClose: () => void;
}

const toastStyles = {
    success: {
        icon: CheckCircle,
        styles: "bg-emerald-50 border-emerald-200 text-emerald-800",
        iconColor: "text-emerald-500"
    },
    error: {
        icon: XCircle,
        styles: "bg-red-50 border-red-200 text-red-800",
        iconColor: "text-red-500"
    },
    warning: {
        icon: AlertTriangle,
        styles: "bg-amber-50 border-amber-200 text-amber-800",
        iconColor: "text-amber-500"
    },
    info: {
        icon: Info,
        styles: "bg-blue-50 border-blue-200 text-blue-800",
        iconColor: "text-blue-500"
    }
};

const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
};

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 3000,
    position = 'top-center', // Default to top-center as requested
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // Handle entry animation
    useEffect(() => {
        // Small delay to allow mounting before transition
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    // Handle auto-dismiss
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for exit animation to finish before calling onClose
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const { icon: Icon } = toastStyles[type];

    return (
        <div
            className={cn(
                "fixed z-50 flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-md",
                "bg-white/80 backdrop-blur-md shadow-lg rounded-xl border border-slate-200/60",
                "transition-all duration-300 ease-in-out transform",
                positionStyles[position],
                isVisible
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-4",
                // Ensure centering transformations are preserved and not overridden by simple translate-y
                (position === 'top-center' || position === 'bottom-center') && "-translate-x-1/2"
            )}
            role="alert"
        >
            <div className={cn(
                "p-2 rounded-xl flex items-center justify-center shadow-sm",
                type === 'success' && "bg-emerald-500 shadow-emerald-100",
                type === 'error' && "bg-red-500 shadow-red-100",
                type === 'warning' && "bg-amber-500 shadow-amber-100",
                type === 'info' && "bg-blue-600 shadow-blue-100"
            )}>
                <Icon className="w-5 h-5 text-white" />
            </div>

            <p className="flex-1 text-sm font-semibold text-slate-800">
                {message}
            </p>

            <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
