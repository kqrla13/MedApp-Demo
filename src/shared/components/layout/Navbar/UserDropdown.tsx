import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../../core/store/auth/auth.slice';
import { cn } from '../../../../core/utils/cn';

export const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const userName = useSelector((state: any) => state.auth.email);

    const handleLogout = () => {
        dispatch(logout());
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border transition-all duration-200",
                    "hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]",
                    isOpen ? "bg-slate-50 border-slate-300 shadow-sm" : "border-transparent"
                )}
            >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {userName}
                </span>
                <ChevronDown
                    size={16}
                    className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50 sm:hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            )}
        </div>
    );
};
