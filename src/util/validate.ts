import { Dispatch, SetStateAction } from 'react';
import { LoginInput, Errors, AriaInvalid, RegisterInput } from '@/types/form';

const isFieldEmpty = (field: string) => !field;

export const validateEmpty = (key: string, value: string, setErrors: Dispatch<SetStateAction<Errors[]>>, setAriaInvalid: Dispatch<SetStateAction<AriaInvalid>>) => {
  if (isFieldEmpty(value)) {
    setErrors((prevState) => [...prevState, { name: key, message: `${key} is required`}]);
    setAriaInvalid((prevState) => ({...prevState, [key]: true }));
  }
}

export const handleValidate = (values: RegisterInput | LoginInput | {}, setErrors: Dispatch<SetStateAction<Errors[]>>, setAriaInvalid: Dispatch<SetStateAction<AriaInvalid>>) => {
  for (const [key, value] of Object.entries(values)) {
    validateEmpty(key, value, setErrors, setAriaInvalid);
  }

  if ('email' in values) validateEmail(values, setErrors, setAriaInvalid);
  if ('confirmPassword' in values) passwordValidate(values, setErrors, setAriaInvalid);

}

const isEmailValid = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validateEmail = (values: RegisterInput, setErrors: Dispatch<SetStateAction<Errors[]>>, setAriaInvalid:Dispatch<SetStateAction<AriaInvalid>>) => {
    const { email } = values;
    if (!isFieldEmpty(email) && !isEmailValid(email)) {
      setErrors((prevState) => [...prevState, { name: 'email', message: 'Email is invalid'}]);
      setAriaInvalid((prevState) => ({...prevState, email: true }));
    }
}

export const passwordValidate = (values: RegisterInput, setErrors: Dispatch<SetStateAction<Errors[]>>, setAriaInvalid: Dispatch<SetStateAction<AriaInvalid>>) => {
  const { password, confirmPassword } = values;
  if (!isFieldEmpty(confirmPassword) && !isFieldEmpty(confirmPassword)) {
    if(password !== confirmPassword) {
      setErrors((prevState) => [...prevState, { name: 'confirmPassword', message: 'Passwords do not match' }]);
      setAriaInvalid((prevState) => ({...prevState, confirmPassword: true }));
    }
  }
}
