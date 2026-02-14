import { get } from "../axios/axios";
import type { CatalogItem } from "../types/Catalog";

export const getSpecialties = async () => {
    return await get<CatalogItem[]>('/catalogs/specialties');
};

export const getDoctors = async () => {
    return await get<CatalogItem[]>('/catalogs/doctors');
};
