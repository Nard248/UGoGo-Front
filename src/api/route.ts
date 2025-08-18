import { api } from "./api";
import {IBankCard, IItemCreate, ILogin, IOfferCreate, IPay, IPayData, IPayout} from "../types/global";

export const login = async (data: ILogin) => {
  return await api.post(`/users/token/`, data);
};

export const logout = async (token: string) => {
  try {
    await api.post("/users/token/logout/", { refresh: token });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Always clear user data regardless of API call result
    const { clearUserData } = await import("../utils/auth");
    clearUserData();
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

export const advancedSearchOffer = async (params: Record<string, any>) => {
  return await api.get(`/offers/advanced_search/`, { params });
};

export const getAllOffers = async () => {
  return await api.get(`/offers/get_all_offers/`);
};


export const getMyOffers = async () => {
  return await api.get(`/offers/my_offers/`);
};

export const getReceivedRequests = async () => {
  return await api.get(`/flight-requests/received/`);
};

export const getSentRequests = async () => {
  return await api.get(`/flight-requests/sent/`);
};

// For requesters to perform actions on their sent requests (if needed in future)
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

export const createBankCard = async (data: IBankCard) => {
  return await api.post(`/users/bankcards/`, data);
};

export const getBankCard = async (): Promise<IBankCard[]> => {
  return (await api.get(`/users/bankcards/`)).data;
};

export const payout = async (data: IPayout) => {
  return (await api.post(`/users/pay-out/`, data));
};

export const verifyPayout = async () => {
  return (await api.post(`/users/send-verification-code/`));
};