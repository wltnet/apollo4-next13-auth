export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput extends LoginInput{
  email: string;
  confirmPassword: string;
}

export interface Errors {
  name: string;
  message: string;
}

export type LoginAriaInvalid = {
  username: boolean;
  password: boolean;
}

export type  RegisterAriaInvalid = {
  email: boolean;
  confirmPassword: boolean;
} & LoginAriaInvalid

export type AriaInvalid = LoginAriaInvalid | RegisterAriaInvalid;
