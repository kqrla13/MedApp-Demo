import { get, post, put, remove } from "../../../core/axios/axios"
import type { Doctor } from "../types/DoctorsTypes"

export const getAllDoctors = async () => {
    return await get('/doctors')
}

export const getDoctorById = async (id: number) => {
    return await get(`/doctors/${id}`)
}

export const createDoctor = async (doctor: Doctor) => {
    return await post('/doctors', doctor)
}

export const updateDoctor = async (id: number, doctor: Doctor) => {
    return await put(`/doctors/${id}`, doctor)
}

export const deleteDoctor = async (id: number) => {
    return await remove(`/doctors/${id}`)
}