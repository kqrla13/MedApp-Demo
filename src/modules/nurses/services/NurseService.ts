import { get, post, put, remove } from "../../../core/axios/axios"
import type { NurseDto } from "../types/NurseTypes";

export const getAllNurses = async () => {
    return await get("/nurses")
};

export const getNurseById = async (id: number) => {
    return await get(`/nurses/${id}`)
};

export const createNurse = async (nurse: NurseDto) => {
    return await post("/nurses", nurse)
};

export const updateNurse = async (id: number, nurse: NurseDto) => {
    return await put(`/nurses/${id}`, nurse)
};

export const deleteNurse = async (id: number) => {
    return await remove(`/nurses/${id}`)
};

