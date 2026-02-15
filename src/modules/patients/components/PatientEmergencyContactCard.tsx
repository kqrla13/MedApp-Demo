import { Ambulance, Phone, Mail, Plus, Pencil, MapPin } from 'lucide-react';
import { Card, Button } from '../../../shared/components';
import type { EmergencyContact } from '../types/Patients.types';
import { useRole } from "../../../core/hooks/useRole";

interface PatientEmergencyContactCardProps {
    emergencyContact?: EmergencyContact;
    onEdit: () => void;
}

export const PatientEmergencyContactCard = ({ emergencyContact, onEdit }: PatientEmergencyContactCardProps) => {
    const { isAdmin, isNurse } = useRole();
    return (
        <Card
            title={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Ambulance size={20} className="text-red-500" />
                        <span>Contacto de Emergencia</span>
                    </div>
                    {(emergencyContact && (isAdmin || isNurse)) && (
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={onEdit}
                        >
                            <Pencil size={14} />
                        </Button>
                    )}
                </div>
            }
            className="shadow-sm border-l-4 border-l-red-500"
        >
            {emergencyContact ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-slate-900">{emergencyContact.name} {emergencyContact.lastName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                        <Phone size={14} />
                        <span className="font-medium text-slate-900">{emergencyContact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                        <Mail size={14} />
                        <span className="font-medium text-slate-900 truncate">{emergencyContact.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                        <MapPin size={14} className="mt-1 shrink-0" />
                        <span className="font-medium text-slate-900 line-clamp-2">{emergencyContact.address}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <Plus size={24} className="text-red-400" />
                    </div>
                    <p className="text-sm text-slate-500">¿No tienes un contacto de emergencia registrado?</p>
                    {(isAdmin || isNurse) && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                            onClick={onEdit}
                        >
                            Agregar Contacto
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
};
