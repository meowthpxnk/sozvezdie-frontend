import { IUser, TypeUserPassword } from "./user.types";

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
