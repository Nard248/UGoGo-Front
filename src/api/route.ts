import {api} from "./api";
import {ILogin, IOfferCreate} from "../types/global";

export const login = async (data: ILogin) => {
    return await api.post(`/users/token/`, data)
}

export const logout = async (token: string) => {
    return await api.post(`/users/token/logout/`, {"refresh": token})
}

export const register = async (data: ILogin) => {
    return await api.post(`/users/register/`, data)
}

export const getSingleProduct = async (id: string) => {
    return await api.get(`/offers/offers/${id}/`)
}

export const getAirports = async () => {
    return await api.get(`/locations/airports/`)
}

export const getCategories = async () => {
    return await api.get(`/items/get_all_categories/`)
}

export const creatOffer = async (data: IOfferCreate) => {
    return await api.post(`/offers/create_offer/`, data)
}

export const emailVerification = async (data: {email: string, email_verification_code: string}) => {
    return await api.post(`/users/verfiy-email/`, data)
}