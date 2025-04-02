import { api } from "./api";
import {IItemCreate, ILogin, IOfferCreate} from "../types/global";

export const login = async (data: ILogin) => {
  return await api.post(`/users/token/`, data);
};

export const logout = async (token: string) => {
  try {
    await api.post("/users/token/logout/", { refresh: token });
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  } catch (error) {
    console.error("Logout failed:", error);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};

export const register = async (data: ILogin) => {
  return await api.post(`/users/register/`, data);
};

export const getSingleProduct = async (id: string) => {
  return await api.get(`/offers/offers/${id}/`);
};

export const getAirports = async () => {  
  return await api.get(`/locations/airports/`);
};

export const getCategories = async () => {
  return await api.get(`/items/get_all_categories/`);
};

export const creatOffer = async (data: IOfferCreate) => {      
  return await api.post(`/offers/create_offer/`, data);
};

export const getItems = async () => {
  return await api.get(`/items/items/`);
};

export const createItem = async (data: IItemCreate) => {
  return await api.post(`/items/items/unified_create/`, data);
};

export const emailVerification = async (data: {
  email: string;
  email_verification_code: string;
}) => {
  return await api.post(`/users/verfiy-email/`, data);
};

export const getUserDetails = async () => {
  try {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user details", error);
    return null;
  }
};

export const searchOffer = async (params: {
  origin_airport: string;
  destination_airport: string;
  takeoff_date: string;
}) => {
  return await api.get(`/offers/search_offer/`, { params });
};

export const getAllOffers = async () => {
  return await api.get(`/offers/get_all_offers/`);
};
