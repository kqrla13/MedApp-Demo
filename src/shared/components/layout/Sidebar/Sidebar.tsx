import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import type { SidebarProps, NavigationItem } from './Sidebar.props';
import { cn } from '../../../../core/utils/cn';

export const Sidebar: React.FC<SidebarProps> = ({
    navigationItems = [],
    isCollapsed = false,
    onToggleCollapse,
    className = '',
    visibleOnMobile = false,
    logo,
}) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (itemId: string) => {
        if (isCollapsed) return;
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    const handleItemClick = (item: NavigationItem) => {
        if (item.subitems && item.subitems.length > 0) {
            if (isCollapsed) {
                onToggleCollapse?.();
                setExpandedItems(new Set([item.id]));
            } else {
                toggleExpanded(item.id);
            }
        } else if (item.action) {
            item.action();
        }
    };

    return (
        <aside
            className={cn(
                'bg-slate-900 shadow-xl flex flex-col transition-all duration-300 h-screen sticky top-0',
                isCollapsed ? 'w-20' : 'w-72',
                !visibleOnMobile ? 'hidden lg:flex' : 'flex',
                className
            )}
        >
            {/* Header */}
            <div className="p-5 border-b border-slate-800">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            {logo || <h2 className="text-xl font-bold text-white tracking-tight">MedApp</h2>}
                        </div>
                    )}
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                <ul className="px-3 space-y-1.5">
                    {navigationItems.map((item) => (
                        <li key={item.id} className="relative">
                            <div
                                className={cn(
                                    'flex items-center justify-between cursor-pointer rounded-xl transition-all duration-200 group',
                                    isCollapsed ? 'p-3 justify-center' : 'px-4 py-3',
                                    item.isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                )}
                                onClick={() => handleItemClick(item)}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <div className={cn('flex items-center gap-4', isCollapsed && 'justify-center')}>
                                    {item.icon && (
                                        <div className={cn(
                                            'w-5 h-5 flex items-center justify-center flex-shrink-0 transition-colors',
                                            item.isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                        )}>
                                            {item.icon}
                                        </div>
                                    )}

                                    {!isCollapsed && (
                                        <span className="font-medium text-sm tracking-wide">
                                            {item.label}
                                        </span>
                                    )}
                                </div>

                                {!isCollapsed && item.subitems && item.subitems.length > 0 && (
                                    <div className="text-slate-500">
                                        {expandedItems.has(item.id) ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>
                                )}

                                {/* Active Indicator */}
                                {item.isActive && isCollapsed && (
                                    <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                                )}
                            </div>

                            {/* Submenu */}
                            {!isCollapsed && item.subitems && item.subitems.length > 0 && expandedItems.has(item.id) && (
                                <ul className="mt-2 ml-10 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                    {item.subitems.map((subitem) => (
                                        <li key={subitem.id}>
                                            <button
                                                onClick={subitem.action}
                                                className={cn(
                                                    'block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200',
                                                    subitem.isActive
                                                        ? 'bg-slate-800 text-blue-400 font-medium'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                )}
                                            >
                                                {subitem.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer / User Area (Optional) */}
            {!isCollapsed && (
                <div className="p-4 border-t border-slate-800 mx-3 mb-3 bg-slate-800/20 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-500/20">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">admin@medapp.com</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};
