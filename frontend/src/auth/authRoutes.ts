export const AUTHROUTES = {
    LOGIN : "/auth/login",
    LOGOUT : "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
 
    // SUPER ADMIN ROUTES
    SUPERADMIN_GET_ALL_SOCIETIES : "/superadmin/societies",
    SUPERADMIN_VIEW_SOCIETY_DETAILS : "/superadmin/societies",
    SUPERADMIN_CREATE_SOCIETY: "/superadmin/societies",
    SUPERADMIN_CREATE_SOCIETY_ADMIN: "/superadmin/admins",
 
    SUPERADMIN_TOGGLE_USER_STATUS: "/superadmin/users",
 
 
    // SOCIETY USER ROUTES
    USER_GET_MY_PROFILE: "/profile",
    USER_UPDATE_MY_PROFILE: "/profile",
    USER_CHANGE_PASSWORD: "/profile/password",
 
    USER_GET_ALL_NOTICES: '/notices',
    USER_GET_ALL_ACTIVE_NOTICES: "/notices",
    USER_GET_NOTICE_DETAILS: '/notices',
    USER_FILTER_NOTICES: '/notices',
 
    USER_GET_MY_CHARGES:"/charges/my",
    USER_GET_MY_SINGLE_CHARGE:"/charges/my",
 
    USER_GET_PAYMENT_HISTORY:"/payments/my",
    USER_SUBMIT_PAYMENT:'/payments',
 
    USER_GET_MY_COMPLAINTS: '/complaints/my',
    USER_VIEW_COMPLAINT_DETAILS: '/complaints',
    USER_SUBMIT_COMPLAINTS: '/complaints',
}
 