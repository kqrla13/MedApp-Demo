import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { UserDropdown } from './Navbar/UserDropdown';
import { Activity } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar
                showMenuButton={false}
                leftContent={
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Activity size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">
                            MedApp
                        </span>
                    </div>
                }
                rightContent={<UserDropdown />}
            />

            <Breadcrumbs />

            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};
