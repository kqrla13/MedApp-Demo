import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { Appointment, AppointmentStatus } from '../types/Appointments.types';

interface AppointmentsCalendarProps {
    appointments: Appointment[];
    onDateClick: (date: Date, time: string) => void;
    onEventClick: (appointment: Appointment) => void;
    doctorId?: number | string;
}

const statusColors: Record<AppointmentStatus, string> = {
    CONFIRMED: 'border-blue-500 bg-blue-50 text-blue-700',
    COMPLETED: 'border-green-500 bg-green-50 text-green-700',
    CANCELLED: 'border-red-500 bg-red-50 text-red-700',
    PENDING: 'border-yellow-500 bg-yellow-50 text-yellow-700',
};

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
    appointments,
    onDateClick,
    onEventClick,
    doctorId
}) => {
    const filteredAppointments = useMemo(() => {
        if (!doctorId) return appointments;
        return appointments.filter(app => Number(app.doctorId) === Number(doctorId));
    }, [appointments, doctorId]);

    const events = useMemo(() => {
        return filteredAppointments.map(app => {
            // Helper to parse 12h time (HH:MM AM/PM) to 24h for FullCalendar
            const parseTime = (timeStr: string) => {
                const [time, ampm] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                let h = parseInt(hours);
                if (ampm === 'PM' && h < 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                return `${h.toString().padStart(2, '0')}:${minutes}:00`;
            };

            const datePart = app.date.split('T')[0];
            const timePart = parseTime(app.time);

            return {
                id: String(app.id),
                title: `${app.patient?.name} ${app.patient?.lastName} - ${app.specialty}`,
                start: `${datePart}T${timePart}`,
                extendedProps: app,
                className: statusColors[app.status] || ''
            };
        });
    }, [filteredAppointments]);

    const handleDateClick = (arg: any) => {
        const date = arg.date;
        const timeSplit = arg.dateStr.split('T');
        const time = timeSplit.length > 1 ? timeSplit[1].substring(0, 5) : '09:00';
        onDateClick(date, time);
    };

    const handleEventClick = (arg: any) => {
        onEventClick(arg.event.extendedProps as Appointment);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500">
            <style>
                {`
                    .fc { --fc-border-color: #f1f5f9; --fc-button-bg-color: #3b82f6; --fc-button-border-color: #3b82f6; --fc-button-hover-bg-color: #2563eb; --fc-button-active-bg-color: #1d4ed8; }
                    .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
                    .fc .fc-button { font-weight: 600; text-transform: capitalize; border-radius: 0.5rem; }
                    .fc .fc-col-header-cell { padding: 0.75rem 0; background: #f8fafc; color: #64748b; font-weight: 600; font-size: 0.875rem; }
                    .fc .fc-event { border-left-width: 4px; border-radius: 0.375rem; padding: 2px 4px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
                    .fc .fc-event:hover { transform: translateY(-1px); filter: brightness(0.95); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                    .fc-daygrid-day:hover { background-color: #f8fafc !important; cursor: pointer; }
                    .fc-timegrid-slot:hover { background-color: #f1f5f9 !important; cursor: pointer; }
                    .fc .fc-highlight { background: rgba(59, 130, 246, 0.1) !important; }
                `}
            </style>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height="auto"
                aspectRatio={1.8}
                expandRows={true}
                stickyHeaderDates={true}
                allDaySlot={false}
                slotMinTime="07:00:00"
                slotMaxTime="21:00:00"
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                }}
            />
        </div>
    );
};
