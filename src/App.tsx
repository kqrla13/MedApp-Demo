import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './modules/auth/pages/LoginPage'
import { PrivateRoutes } from './core/routes/Private.routes'
import HomePage from './modules/home/pages/HomePage'
import { PatientsPage } from './modules/patients/pages/PatientsPage'
import { PatientDetailsPage } from './modules/patients/pages/PatientDetailsPage'
import { AppointmentsPage } from './modules/appointments/pages/AppointmentsPage'
import { AppointmentDetailsPage } from './modules/appointments/pages/AppointmentDetailsPage'
import { DoctorsPage } from './modules/doctors/pages/DoctorsPage'
import { DoctorDetailsPage } from './modules/doctors/pages/DoctorDetailsPage'
import { NursesDetailsPage } from './modules/nurses/pages/NursesDetailsPage'
import { NursesPage } from './modules/nurses/pages/NursesPage'
import { MedicalConsultationPage } from './modules/medicalRecord/pages/MedicalConsultationPage'

function App() {
  const token = useSelector((state: any) => state.auth.token)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
        <Route path="/appointments/:id/consultation" element={<MedicalConsultationPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
        <Route path="/nurses" element={<NursesPage />} />
        <Route path="/nurses/:id" element={<NursesDetailsPage />} />
      </Route>

      <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
