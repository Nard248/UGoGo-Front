export interface IValidationModel {
    value: any;
    errorMessage: string | null;
}

export interface ILogin {
    email: string;
    password: string
}

export interface IRegister extends ILogin{
    full_name: string;
}

export interface ILoginForm {
    email: IValidationModel;
    password: IValidationModel;
    rememberMe: boolean;
}

export interface IRegisterForm extends Omit<ILoginForm, 'rememberMe'>{
    fullName: IValidationModel;
}

export interface IOfferCreate {
    flight_number: string;
    from_airport_id: number;
    to_airport_id: number;
    departure_datetime: Date | string;
    arrival_datetime: Date | string;
    flight_details?: string
    publisher?: string;
    category_ids?: number[];
    allow_fragile?: boolean;
    available_dimensions?: string;
    available_weight: number;
    available_space?: number;
    price: number;
    notes?:	string;
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
}