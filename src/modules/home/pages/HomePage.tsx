import HomeCardItemComponent from '../components/HomeCardItemComponent';
import {
    Users,
    UserPlus,
    Calendar,
    ClipboardList,
    Settings,
    Activity,
    MessageSquare,
    Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../../core/hooks/useRole';



const HomePage = () => {
    const navigate = useNavigate();
    const { isAdmin, isDoctor } = useRole();

    const homeMenuItems = [
        {
            title: 'Pacientes',
            icon: Users,
            color: 'blue' as const,
            onClick: () => navigate('/patients'),
            isAvailable: true
        },
        {
            title: 'Citas Médicas',
            icon: Calendar,
            color: 'purple' as const,
            onClick: () => navigate('/appointments'),
            isAvailable: true
        },
        {
            title: 'Doctores',
            icon: UserPlus,
            color: 'green' as const,
            onClick: () => navigate('/doctors'),
            isAvailable: true
        },
        {
            title: 'Enfermeros',
            icon: Package,
            color: 'red' as const,
            onClick: () => navigate('/nurses'),
            isAvailable: true
        },
        ...((isAdmin || isDoctor) ? [{
            title: 'Historial',
            icon: ClipboardList,
            color: 'orange' as const,
            isAvailable: false
        }] : []),
        {
            title: 'Laboratorio',
            icon: Activity,
            color: 'teal' as const,
            isAvailable: false
        },
        {
            title: 'Mensajes',
            icon: MessageSquare,
            color: 'blue' as const,
            isAvailable: false
        },
        {
            title: 'Configuración',
            icon: Settings,
            color: 'purple' as const,
            isAvailable: false
        }
    ];

    return (
        <div className="p-8 pb-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {homeMenuItems.map((item, index) => (
                        <HomeCardItemComponent
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            emphasisColor={item.color}
                            onClick={item.onClick}
                            isAvailable={item.isAvailable}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
