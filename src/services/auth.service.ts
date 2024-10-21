import api from "../custom-axios"
import { UserType } from "../types"

export const register = async ({ name, email, password }: UserType) => {
    let response;
    try {
        response = await api.post(
            "/signup",
            JSON.stringify({ name, email, password }),
        )
        return response.data
    } catch (error: any) {
        response = error.message
    }
}

export const signin = ({ password, email }: Omit<UserType, "name" | "profilImage">) => {
    return api.post(
        "/login",
        JSON.stringify({ password, email }),
    )
}