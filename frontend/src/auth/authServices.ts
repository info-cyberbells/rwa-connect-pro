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
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    society: string | null;
  };
}
 
const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(AUTHROUTES.LOGIN, payload);
    return data;
  },
 
    logout: async (): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post(
      AUTHROUTES.LOGOUT
    );
    return data;
  },
 
};  
 
export default authService;
 
 
// SUPERADMIN SERVICES
 
export const getAllSocietiesSuperAdminService = async (): Promise<any> => {
  const response = await axiosInstance.get(
    AUTHROUTES.SUPERADMIN_GET_ALL_SOCIETIES
  );
 
  return response.data;
};
 
//SUPERADMIN VIEW SOCIETY DETAILS
export const getSocietyDetailsSuperAdminService = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(
    `${AUTHROUTES.SUPERADMIN_VIEW_SOCIETY_DETAILS}/${id}`
  );
  return response.data;
}
 
//SUPERADMIN CREATE SOCIETY
export const createSocietyBySuperAdminService = async (payload: any): Promise<any> => {
  const response = await axiosInstance.post(
    AUTHROUTES.SUPERADMIN_CREATE_SOCIETY,
    payload
  );
  return response.data;
}
 
// SUPERADMIN CREATE SOCIETY ADMIN
export const createSocietyAdminBySuperAdminService = async (payload: any): Promise<any> => {
  const response = await axiosInstance.post(
    AUTHROUTES.SUPERADMIN_CREATE_SOCIETY_ADMIN,
    payload
  );
  return response.data;
}
 
//SUPERADMIN TOGGLE USER STATUS
export const toggleUserStatusBySuperAdminService = async (id: string): Promise<any> => {
  const response = await axiosInstance.patch(
    `${AUTHROUTES.SUPERADMIN_TOGGLE_USER_STATUS}/${id}/toggle-status`
  );
  return response.data;
}
 
 
 //SUPERADMIN GET SECURITY INFO
 export const getSecurityInfoService = async(): Promise<any>=>{
  const response = await axiosInstance.get(
    AUTHROUTES.SUPERADMIN_GET_SECURITY_INFO
  );
  return response.data;
 }

 //SUPERADMIN GET ACTIVE SESSIONS
 export const getActiveSessionsService = async(): Promise<any>=>{
  const response = await axiosInstance.get(
    AUTHROUTES.SUPERADMIN_GET_ACTIVE_SESSIONS
  );
  return response.data;
 }

 //SUPERADMIN REVOKE SPECFIC SESSIONS
 export const revokeActiveSessionService = async (id: string): Promise<any>=>{
  const response = await axiosInstance.delete(
    `${AUTHROUTES.SUPERADMIN_REVOKE_SPECIFIC_SESSION}/${id}`
  );
  return response.data
 }
 
 // SUPERADMIN SYSTEM SETTINGS
 export const systemSettingsService = async (): Promise<any>=>{
  const response = await axiosInstance.get(
    AUTHROUTES.SUPERADMIN_SYSTEM_SETTINGS
  );
  return response.data;
 }
 
 // SUPER ADMIN UPDATE PALTFROM CONFIG
export const updatePlatformConfigService = async(payload: any): Promise<any>=>{
  const response = await axiosInstance.patch(
    AUTHROUTES.SUPERADMIN_UPDATE_PLATFORM_CONFIG,
    payload
  );
  return response.data;
}

//SUPERADMIN UPDATE NOTIFICATION RULE
export const updateNotificationRulesService = async(payload: any): Promise<any>=>{
  const response = await axiosInstance.patch(
    AUTHROUTES.SUPERADMIN_UPDATE_NOTIFICATION_RULES,
    payload
  );
  return response.data;
}

// SUPERADMIN GETALL SUBSCRIPTION PLAN
export const getAllSubscriptionService = async(): Promise<any>=>{
  const response = await axiosInstance.get(
    AUTHROUTES.SUPERADMIN_GETALL_SUBSCRIPTIONS_PALN
  );
  return response.data;
}

// SUPERADMIN ADD NEW SUBSCRIPTION PLAN
export const addNewSubscriptionPlanService = async(payload: any): Promise<any>=>{
  const response = await axiosInstance.post(
    AUTHROUTES.SUPERADMIN_POST_SUBSCRIPTION_PLAN,
    payload
  );
  return response.data;
}

// SUPERADMIN UPADTE SUBSCRIPTION PALN
export const updateSubscriptionPlanService = async(id: string, payload: any): Promise<any>=>{
  const response =  await axiosInstance.patch(
    `${AUTHROUTES.SUPERADMIN_UPDATE_SUBSCRIPTION_PLAN}/${id}`,
    payload
  );
  return response.data;
}

// SUPERADMIN DELETE SUBSCRIPTION PALN
 export const deleteSubscriptionPlanService = async(id: string): Promise<any>=>{
  const response = await axiosInstance.delete(
    `${AUTHROUTES.SUPERADMIN_DELETE_SUBSCRIPTION_PLAN}/${id}`
  );
  return response.data;
 }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
// SOCIETY USER SERVICES
 
// SOCIETY USER GET OWN PROFILE
export const getMyProfileService = async (): Promise<any> => {
  const response = await axiosInstance.get(
    AUTHROUTES.USER_GET_MY_PROFILE
  );
  return response.data;
}
 
//USER UPDATE OWN PROFILE
export const updateMyProfileService = async (payload: any): Promise<any> => {
  const response = await axiosInstance.patch(
    AUTHROUTES.USER_UPDATE_MY_PROFILE,
    payload
  );
  return response.data;
}
 
// USER CHANGE PASSWORD
export const changeMyPasswordService = async (payload: any): Promise<any> => {
  const response = await axiosInstance.patch(
    AUTHROUTES.USER_CHANGE_PASSWORD,
    payload
  );
  return response.data;
}
 
//USER GET ALL NOTICES
export const getAllNoticesByUserService = async (): Promise<any> => {
  const response = await axiosInstance.get(
    AUTHROUTES.USER_GET_ALL_NOTICES,
  );
  return response.data;
}
 
// USER FILTER NOTICE DETAILS
export const getFilterNoticesByUserService = async (category: string): Promise<any> =>{
  const response = await axiosInstance.get(
    AUTHROUTES.USER_FILTER_NOTICES,
     {
      params: { category },
    }
  );
  return response.data
}
 
// USER GET SINGLE NOTICE
export const getSingleNoticeByUserService = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(
    `${AUTHROUTES.USER_GET_NOTICE_DETAILS}/${id}`
  );
  return response.data;
}
 
//USER GET ALL ACTIVE NOTICES
export const getAllActiveNoticesService = async (): Promise<any> => {
  const response = await axiosInstance.get(
    AUTHROUTES.USER_GET_ALL_ACTIVE_NOTICES,
    {
      params: { active: true }
    }
  );
  return response.data;
};
 
 
// USER GET MY ALL CHARGES
export const getMyAllChargesServices = async (filters = {}): Promise<any> => {
  const response = await axiosInstance.get(
    AUTHROUTES.USER_GET_MY_CHARGES,{
      params: filters
    }
  );
  return response.data;
}
 
//USER VIEW MY SINGLE CHARGE IN DETAIL
export const getMySingleChargeService = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(
    `${AUTHROUTES.USER_GET_MY_SINGLE_CHARGE}/${id}`
  );
  return response.data;
}
 
//GET USER PAYMENT HISTORY
export const getUserPaymentHistoryService = async (filters={}): Promise<any>=>{
  const response = await  axiosInstance.get(
    AUTHROUTES.USER_GET_PAYMENT_HISTORY,{
      params: filters
    }
  );
  return response.data;
}
 
// USER SUBMIT PAYMENT
export const userSubmitPaymentService = async(payload: any): Promise<any>=>{
  const response = await axiosInstance.post(
    AUTHROUTES.USER_SUBMIT_PAYMENT,
    payload
  );
  return response.data;
}
 
//USER GET MY COMPLAINTS
export const getMyComplaintsService = async(filters = {}): Promise<any>=>{
  const response = await axiosInstance.get(
    AUTHROUTES.USER_GET_MY_COMPLAINTS,{
      params: filters
    }
  );
  return response.data;
}
 
//USER VIEW COMPLAINT DETAILS
export const getMyComplaintDetailService = async(id: string): Promise<any>=>{
  const response = await axiosInstance.get(
    `${AUTHROUTES.USER_VIEW_COMPLAINT_DETAILS}/${id}`
  );
  return response.data;
}
 
//USER SUBMIT COMPLAINT
export const submitComplaintService = async(payload: any): Promise<any>=>{
  const response = await axiosInstance.post(
    AUTHROUTES.USER_SUBMIT_COMPLAINTS,
    payload,
  );
  return response. data;
}