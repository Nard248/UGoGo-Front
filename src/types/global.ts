export interface IValidationModel {
  value: any;
  errorMessage?: string | null;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends ILogin {
  full_name: string;
}

export interface ILoginForm {
  email: IValidationModel;
  password: IValidationModel;
  rememberMe: boolean;
}

export interface IRegisterForm extends Omit<ILoginForm, "rememberMe"> {
  fullName: IValidationModel;
}

export interface IOfferCreate {
  flight_number: string;
  from_airport_id: number;
  to_airport_id: number;
  departure_datetime: Date | string;
  arrival_datetime: Date | string;
  flight_details?: string;
  publisher?: string;
  category_ids?: number[];
  allow_fragile?: boolean;
  available_dimensions?: string;
  available_weight: number;
  available_space?: number;
  price: number;
  notes?: string;
}

export interface IOfferCreateForm {
  flight_number: IValidationModel;
  from_airport_id: IValidationModel;
  to_airport_id: IValidationModel;
  departure_datetime: IValidationModel;
  arrival_datetime: IValidationModel;
  flight_details?: IValidationModel;
  publisher?: IValidationModel;
  category_ids?: IValidationModel;
  allow_fragile?: IValidationModel;
  available_dimensions: IValidationModel;
  available_weight: IValidationModel;
  available_space?: IValidationModel;
  price: IValidationModel;
  notes?: IValidationModel;
  description?: IValidationModel;
  is_fragile?: boolean;
  name?: IValidationModel;
}

export interface IItemCreate {

    // name: string,
    // weight: number,
    // dimensions: string,
    // fragile?: boolean,
    // description?: string,
    // pickup_name?: string,
    // pickup_surname?: string,
    // pickup_phone?: string,
    // pickup_email?: string,
    // category_ids?: string[],
    // uploaded_pictures?: Blob[],
    // state?: string
  name: string;
  weight: number;
  dimensions: string;
  fragile?: boolean;
  description?: string;
  pickup_name?: string;
  pickup_surname?: string;
  pickup_phone?: string;
  pickup_email?: string;
  category_ids?: number[];
  pictures?: {
    file: File;        
    image_path: string;
  }[];
  state?: string;
}

interface IOfferData {
  price?: string;
  available_space?: string;
  available_weight?: string;
  user_flight?: {
    flight: {
      departure_datetime?: string;
      arrival_datetime?: string;
      from_airport?: {
        airport_name?: string;
        city?: {
          city_name?: string;
        };
      };
      to_airport?: {
        airport_name?: string;
      };
    };

    user?: {
        full_name?: string;
        email?: string;
    }
}
}
export interface IPay {
    item: number,
    offer: number,
    comments?: string
}

export interface IPayData {
    error?: string;
    checkout_url: string;
    comments: string;
    created_at: string;
    id: number;
    item: number;
    offer: number;
    payment: null;
    requester: number;
    updated_at: string;
}

export interface IPID {
    pid_type: 'national_id' | 'passport';
    pid_picture: File;
    pid_selfie: File;
}

export interface IBankCard {
    id?: number;
    card_number: string;
    card_holder_name: string;
    expiration_date: string
}

export interface IPayout {
    transfer_amount: number;
    verification_code: string;
    card_id: number
}

export interface User {
    name: string;
    email: string;
    balance?: number
}

  
  // user?: {
  //   full_name?: string;
  //   email?: string;
  // };

