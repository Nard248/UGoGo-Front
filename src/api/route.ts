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

export const forgotPassword = async (email: string) => {
  return await api.post(`/users/forgot-password/`, { email });
};

export const resetPassword = async (data: {
  uid: string;
  token: string;
  new_password: string;
  confirm_password: string;
}) => {
  return await api.post(`/users/reset-password/`, data);
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
  origin_airport?: string;
  destination_airport?: string;
  takeoff_date?: string;
}) => {
  return await api.get(`/offers/search_offer/`, { params });
};

export const advancedSearchOffer = async (params: Record<string, any>) => {
  return await api.get(`/offers/advanced_search/`, {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Serialize arrays as repeated params: categories=1&categories=2
          value.forEach((v) => searchParams.append(key, v.toString()));
        } else if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      return searchParams.toString();
    },
  });
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
export const requestsAction = async (data: {request_id: string | number, action: 'accept' | 'reject' | 'complete'}) => {
  const endpoint = data.action === 'complete' ? '/flight-requests/complete/' : '/flight-requests/action/';
  return await api.post(endpoint, data);
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

export const updateProfile = async (data: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  birthdate: string;
  gender?: string;
}) => {
  return await api.put(`/users/profile/edit/`, data);
};

// New Pricing & Validation Endpoints
export const validateSpace = async (data: {
  offer_id?: number;
  item_id?: number;
  space_dimensions?: string;
  item_dimensions?: string;
}) => {
  return await api.post(`/flight-requests/validate/space/`, data);
};

export const calculatePrice = async (params: {
  weight?: number;
  item_id?: number;
}) => {
  if (params.weight !== undefined) {
    return await api.get(`/flight-requests/validate/price/`, { params: { weight: params.weight } });
  } else {
    return await api.post(`/flight-requests/validate/price/`, { item_id: params.item_id });
  }
};

export const validateRequest = async (data: {
  offer_id: number;
  item_id: number;
}) => {
  return await api.post(`/flight-requests/validate/request/`, data);
};

// Profile Picture Management
export const getProfilePicture = async () => {
  return await api.get(`/users/profile/picture/`);
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append('profile_picture', file);

  return await api.post(`/users/profile/picture/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteProfilePicture = async () => {
  return await api.delete(`/users/profile/picture/delete/`);
};