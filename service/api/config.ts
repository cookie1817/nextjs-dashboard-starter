"use client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const AUTH_API_PREFIX = '/api/v1/auth';
export const AUTH_SIGIN_URL = API_URL + AUTH_API_PREFIX +  "/signin";
export const AUTH_SIGUP_URL = API_URL + AUTH_API_PREFIX +  "/signup";
export const AUTH_SIGNOUT_URL = API_URL + AUTH_API_PREFIX +  "/signout";
export const AUTH_OTP = API_URL + AUTH_API_PREFIX + "/otp";
export const AUTH_OTP_RESEND = API_URL + AUTH_API_PREFIX + "/resendotp";
export const AUTH_REFRESH_URL = API_URL + AUTH_API_PREFIX + "/refresh";
export const AUTH_USER_INFO_URL = API_URL + AUTH_API_PREFIX + "/user";
