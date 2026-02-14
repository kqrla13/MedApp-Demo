import { post } from "../../../core/axios/axios"

export const createUser = async (user: any) => {
    return await post("/auth/register", user)
}
