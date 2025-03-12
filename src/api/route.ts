import { api } from "./api";
import { ILogin, IOfferCreate } from "../types/global";
import { log } from "console";

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

export const emailVerification = async (data: {
  email: string;
  email_verification_code: string;
}) => {
  return await api.post(`/users/verfiy-email/`, data);
};

export const getUserDetails = async () => {
  try {
    // Assuming your API provides a /users/me or similar endpoint to fetch current user info
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
