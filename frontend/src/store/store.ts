import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "../features/authSlice";
import adminReducer from "../features/admin/adminSlice";
import superAdminReducer from "../features/Superadmin/superAdminSlice";
import userReducer from "../features/User/userSlice"
 
const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    superAdmin: superAdminReducer,
    user: userReducer,
  },
});
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 
export default store;
 