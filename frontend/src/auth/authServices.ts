import axiosInstance from "./axiosInstance";
import { AUTHROUTES } from "./authRoutes";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(AUTHROUTES.LOGIN, payload);
    return data;
  },
  
};

export default authService;