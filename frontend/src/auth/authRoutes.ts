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

    SUPERADMIN_GET_SECURITY_INFO: '/superadmin/settings/security',
    SUPERADMIN_GET_ACTIVE_SESSIONS: '/superadmin/settings/sessions',
    SUPERADMIN_REVOKE_SPECIFIC_SESSION: '/superadmin/settings/sessions',

    SUPERADMIN_SYSTEM_SETTINGS: '/superadmin/settings/platform',
    SUPERADMIN_UPDATE_PLATFORM_CONFIG: '/superadmin/settings/platform',
    SUPERADMIN_UPDATE_NOTIFICATION_RULES: '/superadmin/settings/notifications',


    SUPERADMIN_GETALL_SUBSCRIPTIONS_PALN: '/superadmin/settings/plans',
    SUPERADMIN_POST_SUBSCRIPTION_PLAN: '/superadmin/settings/plans',
    SUPERADMIN_UPDATE_SUBSCRIPTION_PLAN: '/superadmin/settings/plans',
    SUPERADMIN_DELETE_SUBSCRIPTION_PLAN: '/superadmin/settings/plans',
 
 
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
 