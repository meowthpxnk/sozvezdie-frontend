import { IUser, TypeUserPassword } from "@shared/types/user.types";

export type TypeAccessToken = string;

export interface IAuthForm extends Pick<IUser, "username"> {
    password: TypeUserPassword;
}

export interface IRegisterForm extends IAuthForm {
    full_name: string;
    email: string;
    phone: string;
}

export interface AccessTokenResponse {
    "Access-Token": TypeAccessToken;
}

export interface IVkAuthoriseRequest {
    code: string;
    deviceId: string;
    codeVerifier: string;
}
