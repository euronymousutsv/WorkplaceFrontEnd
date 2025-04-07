import React, { createContext, useState, useContext, ReactNode } from "react";
import { registerUser } from "../api/auth/authApi";
import { RegisterRequest } from "../api/auth/auth";
import { ApiError } from "../api/utils/apiResponse";
import { AxiosError } from "axios";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  inviteLink: string;
}

interface SignupContextType {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: string) => void;
}

// Set default values for form data
const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  inviteLink: "",
};

// Create the context with the default value and types
const SignupContext = createContext<SignupContextType>({
  formData: defaultFormData,
  updateFormData: () => {},
});

export const useSignup = () => useContext(SignupContext);

// Define the type for the provider's children
interface SignupProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SignupProvider = ({ children }: SignupProviderProps) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  return (
    <SignupContext.Provider value={{ formData, updateFormData }}>
      {children}
    </SignupContext.Provider>
  );
};
