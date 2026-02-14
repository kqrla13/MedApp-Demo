import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
    'home': 'Inicio',
    'patients': 'Pacientes',
    'patients/:id': 'Detalles del Paciente',
    'appointments': 'Citas Médicas',
    'doctors': 'Doctores',
    'doctors/:id': 'Detalles del Doctor',
    'nurses': 'Enfermeros',
    'nurses/:id': 'Detalles del Enfermero',
};

export const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex items-center justify-center pt-4 pb-2 px-2">
            <ol className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
                <li className="flex items-center">
                    <Link
                        to="/home"
                        className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                        <Home size={14} />
                        <span>Inicio</span>
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    if (value === 'home') return null;

                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const label = routeLabels[value] || value;

                    return (
                        <li key={to} className="flex items-center space-x-2">
                            <ChevronRight size={14} className="text-slate-300" />
                            {last ? (
                                <span className="text-slate-900 font-semibold">{label}</span>
                            ) : (
                                <Link
                                    to={to}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
