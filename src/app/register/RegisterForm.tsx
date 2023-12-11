"use client";
import { useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
// import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { AuthContext, AuthContextContent } from '@/context/AuthProvider';
import { useForm } from '@/hooks/useForm';
import { handleValidate, passwordValidate } from '@/util/validate';
import { showErrorMessage } from '@/util/errors';
import { REGISTER_USER } from '@/gql';
import { RegisterInput, Errors, AriaInvalid, RegisterAriaInvalid } from '@/types/form';
import ErrorSection from '@/components/ErrorSection';
import Button from '@/components/Button';
import {
  Label,
  ErrorMessage,
  Required,
  Mandatory,
  Input,
} from './styled';

const initialAriaInvalid = {
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
}

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterForm = () => {
  const [errors, setErrors] = useState<Errors[]>([]);
  const [apiErrors, setApiErrors] = useState<string>('');
  const [ariaInvalid, setAriaInvalid] = useState<AriaInvalid>(initialAriaInvalid);
  const [doSubmit, setDoSubmit] = useState<boolean>(false);

  const router = useRouter();
  const authContext = useContext<AuthContextContent>(AuthContext);

  const { onChange, onSubmit, values } = useForm(registerUserCallback, initialState);

  // const { data } = useSuspenseQuery(query);
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER, {
    onCompleted(data) {
      authContext.setAuthInfo({ accessToken: data.register.accessToken, userData: data.register});
      sessionStorage.setItem('accessToken', data.register.accessToken);
      router.push('/member');
    },
    onError(err) {
      setApiErrors('There is an error.');
    },
    variables: values,
  });

  function registerUserCallback() {
    setApiErrors('');
    setErrors([]);
    setAriaInvalid(initialAriaInvalid);
    setDoSubmit(false);
    handleValidate(values, setErrors, setAriaInvalid);
    if (errors.length === 0) {
      setDoSubmit((preState) => !preState);
    }
  }

  useEffect(() => {
    if (errors.length === 0 && doSubmit) {
      registerUser();
    }
  }, [errors, doSubmit, registerUser]);

  const {
    username,
    email,
    password,
    confirmPassword,
  } = ariaInvalid as RegisterAriaInvalid;

  return (
  <>
    <ErrorSection errors={errors} apiErrors={apiErrors}/>
    <form onSubmit={onSubmit} noValidate>
    <Label htmlFor="username">
      Username
      <Required>(Required)</Required>
      <Mandatory className="mandatory">*</Mandatory>
       <ErrorMessage>{showErrorMessage(errors, 'username')}</ErrorMessage>
    </Label>
    <Input id="username" name="username" aria-required="true" aria-invalid={username} 
      placeholder="Username" autoComplete="username" required $invalid={username}
      type="text" onChange={onChange} />
    <Label htmlFor="email">
      Email
      <Required>(Required)</Required>
      <Mandatory className="mandatory">*</Mandatory>
       <ErrorMessage>{showErrorMessage(errors, 'email')}</ErrorMessage>
    </Label>
    <Input id="email" name="email" aria-required="true" aria-invalid={email} 
      placeholder="Email" autoComplete="email" required $invalid={email}
      type="text" onChange={onChange} />
    <Label htmlFor="password">
      Password
      <Required>(Required)</Required>
      <Mandatory className="mandatory">*</Mandatory>
       <ErrorMessage>{showErrorMessage(errors, 'password')}</ErrorMessage>
    </Label>
    <Input id="password" name="password" aria-required="true" aria-invalid={password} 
      placeholder="Password" type="password" required $invalid={password} 
      onChange={onChange} />
    <Label htmlFor="confirmPassword">
      Confirm password
      <Required>(Required)</Required>
      <Mandatory className="mandatory">*</Mandatory>
       <ErrorMessage>{showErrorMessage(errors, 'confirmPassword')}</ErrorMessage>
    </Label>
    <Input id="confirmPassword" name="confirmPassword" aria-required="true" 
      aria-invalid={confirmPassword} placeholder="Confirm password" 
      type="password" required $invalid={confirmPassword} 
      onChange={onChange} />
    <Button type="submit">Submit</Button>
  </form>
  </>
)};

export default RegisterForm;
