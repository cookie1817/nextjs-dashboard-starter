import { useCallback } from "react";
import useFetchBase from "../use-fetch-base";
import useFetch from "../use-fetch";
import { 
  AUTH_SIGIN_URL,
  AUTH_SIGUP_URL,
  AUTH_USER_INFO_URL,
  AUTH_OTP,
  AUTH_OTP_RESEND,
  AUTH_FORGET_PASSWORD,
  AUTH_RESET_PASSWORD
} from "../config";
import { User } from "../types/user";
import { Tokens } from "../types/tokens";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = Tokens & {
  user: User;
};

export function useAuthLoginService() {
  const fetchBase = useFetchBase();

  return useCallback(
    (data: AuthLoginRequest) => {
      return fetchBase(`${AUTH_SIGIN_URL}`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then(wrapperFetchJsonResponse<AuthLoginResponse>);
    },
    [fetchBase]
  );
}

export type AuthSignUpRequest = {
  email: string;
  password: string;
};

export type AuthSignUpResponse = void;

export function useAuthSignUpService() {
  const fetchBase = useFetchBase();

  return useCallback(
    (data: AuthSignUpRequest, requestConfig?: RequestConfigType) => {
      return fetchBase(`${AUTH_SIGUP_URL}`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AuthSignUpResponse>);
    },
    [fetchBase]
  );
}

export type AuthEmailOtpRequest = {
  emailOtpCode: string;
};

export type AuthEmailOtpResponse = void;

export function useAuthEmailOtpService() {
  const fetchBase = useFetch();

  return useCallback(
    (data: AuthEmailOtpRequest) => {
      return fetchBase(`${AUTH_OTP}`, {
        method: "POST",
        body: JSON.stringify(data),
      }).then(wrapperFetchJsonResponse<AuthLoginResponse>);
    },
    [fetchBase]
  );
}

export type AuthEmailOtpResendResponse = void;

export function useAuthEmailOtpResendService() {
  const fetchBase = useFetch();

  return useCallback(
    () => {
      return fetchBase(`${AUTH_OTP_RESEND}`, {
        method: "GET",
      }).then(wrapperFetchJsonResponse<AuthLoginResponse>);
    },
    [fetchBase]
  );
}

export type AuthForgotPasswordRequest = {
  email: string;
};

export type AuthForgotPasswordResponse = void;

export function useAuthForgotPasswordService() {
  const fetchBase = useFetchBase();

  return useCallback(
    (data: AuthForgotPasswordRequest, requestConfig?: RequestConfigType) => {
      return fetchBase(`${AUTH_FORGET_PASSWORD}`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AuthForgotPasswordResponse>);
    },
    [fetchBase]
  );
}

export type AuthResetPasswordRequest = {
  password: string;
  token: string;
};

export type AuthResetPasswordResponse = void;

export function useAuthResetPasswordService() {
  const fetchBase = useFetchBase();

  return useCallback(
    (data: AuthResetPasswordRequest, requestConfig?: RequestConfigType) => {
      return fetchBase(`${AUTH_RESET_PASSWORD}`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AuthResetPasswordResponse>);
    },
    [fetchBase]
  );
}

// export type AuthPatchMeRequest =
//   | Partial<Pick<User, "firstName" | "lastName" | "email">>
//   | { password: string; oldPassword: string };

// export type AuthPatchMeResponse = User;

// export function useAuthPatchMeService() {
//   const fetch = useFetch();

//   return useCallback(
//     (data: AuthPatchMeRequest, requestConfig?: RequestConfigType) => {
//       return fetch(`${API_URL}/v1/auth/me`, {
//         method: "PATCH",
//         body: JSON.stringify(data),
//         ...requestConfig,
//       }).then(wrapperFetchJsonResponse<AuthPatchMeResponse>);
//     },
//     [fetch]
//   );
// }

export type AuthGetMeResponse = User;

export function useAuthGetMeService() {
  const fetch = useFetch();

  return useCallback(
    (requestConfig?: RequestConfigType) => {
      return fetch(`${AUTH_USER_INFO_URL}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<AuthGetMeResponse>);
    },
    [fetch]
  );
}
