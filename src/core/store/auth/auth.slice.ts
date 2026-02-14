import { createSlice } from "@reduxjs/toolkit";
import { decodeToken, isExpired } from "react-jwt";

interface AuthState {
    id: number | null;
    name: string | null;
    email: string | null;
    role: string | null;
    token: string | null;
}

const getInitialState = (): AuthState => {
    const token = localStorage.getItem("token");
    if (!token) return { id: null, name: null, email: null, role: null, token: null };

    const decoded: any = decodeToken(token);
    const expired = isExpired(token);

    if (!decoded || expired) {
        localStorage.removeItem("token");
        return { id: null, name: null, email: null, role: null, token: null };
    }

    return {
        id: decoded.id ?? null,
        name: decoded.name ?? "Usuario",
        email: decoded.email ?? null,
        role: decoded.role ?? null,
        token: token,
    };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    selectors: {
        isAuthenticated: (state) => !!state.token,
    },
    reducers: {
        setAuth: (state, action) => {
            const token = action.payload;
            const decoded: any = decodeToken(token);
            const expired = isExpired(token);
            if (!decoded || expired) {
                state.id = null;
                state.name = null;
                state.email = null;
                state.role = null;
                state.token = null;
                localStorage.removeItem("token");
                return;
            }

            state.id = decoded.id ?? null;
            state.name = decoded.name ?? "Usuario";
            state.email = decoded.email ?? null;
            state.role = decoded.role ?? null;
            state.token = token;
            localStorage.setItem("token", token);
        },

        logout: (state) => {
            state.id = null;
            state.name = null;
            state.email = null;
            state.role = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
});

export default authSlice.reducer;

export const { setAuth, logout } = authSlice.actions;
export const { isAuthenticated } = authSlice.selectors;
