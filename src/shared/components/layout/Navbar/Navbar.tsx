import { Menu } from 'lucide-react';
import type { NavbarProps } from './Navbar.props';
import { cn } from '../../../../core/utils/cn';

export const Navbar: React.FC<NavbarProps> = ({
    title,
    leftContent,
    rightContent,
    onMenuClick,
    showMenuButton = true,
    className,
}) => {
    return (
        <header
            className={cn(
                'h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-subtle',
                className
            )}
        >
            <div className="flex items-center gap-4">
                {showMenuButton && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}

                {leftContent}

                {title && (
                    <h1 className="text-lg font-semibold text-slate-800 hidden md:block">
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center gap-2">
                {rightContent}
            </div>
        </header>
    );
};
