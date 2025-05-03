import { api } from "./api";
import {IItemCreate, ILogin, IOfferCreate, IPay, IPayData} from "../types/global";

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

export const createItem = async (data: FormData) => {
  return await api.post(`/items/create_item/`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
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

export const getAllRequests = async () => {
  return await api.get(`/flight-requests/list-requests/`);
};

export const requestsAction = async (data: {request_id: string | number, action: 'accept' | 'reject'}) => {
  return await api.post(`/flight-requests/action/`, data);
};

export const pay = async (data: IPay): Promise<{ data: IPayData }> => {
  return await api.post(`/flight-requests/create/`, data);
};

export const confirmSession = async (data: {session_id: string}) => {
  return await api.post(`/flight-requests/stripe/confirm-session/`, data);
};

export const profileVerification = async (data: FormData) => {
  return await api.post(`/users/pid-upload/`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};