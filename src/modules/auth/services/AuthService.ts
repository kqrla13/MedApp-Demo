import { post } from "../../../core/axios/axios";
import type { IAuthLogin } from "../../../core/types/auth.types";
import type { TResult } from "../../../core/types/TResult";

export const login = async (data: IAuthLogin): Promise<TResult<string>> => {
    return await post("/users/login", data);
};
