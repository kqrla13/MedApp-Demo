import type { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface HomeCardItemComponentProps {
    title: string;
    icon: LucideIcon;
    emphasisColor: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';
    onClick?: () => void;
    className?: string;
    isAvailable?: boolean;
}

const colorConfig = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        hover: 'hover:bg-blue-100',
        border: 'border-blue-100'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        title: 'text-green-800',
        hover: 'hover:bg-green-100',
        border: 'border-green-100'
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        title: 'text-purple-800',
        hover: 'hover:bg-purple-100',
        border: 'border-purple-100'
    },
    orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        hover: 'hover:bg-orange-100',
        border: 'border-orange-100'
    },
    red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        title: 'text-red-800',
        hover: 'hover:bg-red-100',
        border: 'border-red-100'
    },
    teal: {
        bg: 'bg-teal-50',
        icon: 'text-teal-600',
        title: 'text-teal-800',
        hover: 'hover:bg-teal-100',
        border: 'border-teal-100'
    }
};

const HomeCardItemComponent = ({
    title,
    icon: Icon,
    emphasisColor,
    onClick,
    className,
    isAvailable = true
}: HomeCardItemComponentProps) => {
    const config = colorConfig[emphasisColor];

    return (
        <button
            onClick={isAvailable ? onClick : undefined}
            disabled={!isAvailable}
            className={cn(
                'group relative flex flex-col items-center justify-center p-12 rounded-3xl border transition-all duration-300 transform text-center min-h-[240px] overflow-hidden',
                isAvailable ? [config.bg, config.border, config.hover, 'hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] cursor-pointer'] : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed',
                className
            )}
        >
            {!isAvailable && (
                <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Próximamente
                    </span>
                </div>
            )}

            <div className={cn(
                'mb-5 transition-all duration-300',
                isAvailable ? config.icon : 'text-slate-400 group-hover:scale-100',
                isAvailable && 'group-hover:scale-110 group-hover:-translate-y-1'
            )}>
                <Icon size={72} strokeWidth={1.2} />
            </div>

            <h3 className={cn(
                "text-2xl font-black tracking-tight",
                isAvailable ? config.title : 'text-slate-500'
            )}>
                {title}
            </h3>

        </button>
    );
};

export default HomeCardItemComponent;
