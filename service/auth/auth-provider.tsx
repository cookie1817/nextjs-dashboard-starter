"use client";

import { Tokens } from "@/service/api/types/tokens";
import { User } from "@/service/api/types/user";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  TokensInfo,
} from "./auth-context";
import Cookies from "js-cookie";
import useFetchBase from "@/service/api/use-fetch-base";
import { AUTH_SIGNOUT_URL, USER_INFO_URL } from "@/service/api/config";
import { HTTP_CODES_ENUM } from "../api/types/http-codes";

function AuthProvider(props: PropsWithChildren<{}>) {
  const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY || "auth-token-data";
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const tokensInfoRef = useRef<Tokens>({
    accessToken: null,
    refreshToken: null,
    tokenExpires: null,
  });
  const fetchBase = useFetchBase();

  const setTokensInfoRef = useCallback((tokens: TokensInfo) => {
    tokensInfoRef.current = tokens ?? {
      accessToken: null,
      refreshToken: null,
      tokenExpires: null,
    };
  }, []);

  const setTokensInfo = useCallback(
    (tokensInfo: TokensInfo) => {
      setTokensInfoRef(tokensInfo);

      if (tokensInfo) {
        Cookies.set(AUTH_TOKEN_KEY, JSON.stringify(tokensInfo));
      } else {
        Cookies.remove(AUTH_TOKEN_KEY);
        setUser(null);
      }
    },
    [setTokensInfoRef]
  );


  const loadData = useCallback(async () => {
    const tokens = JSON.parse(
      Cookies.get(AUTH_TOKEN_KEY) ?? "null"
    ) as TokensInfo;

    setTokensInfoRef(tokens);

    try {
      if (tokens?.accessToken) {
        const response = await fetchBase(
          USER_INFO_URL,
          {
            method: "GET",
          },
          {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenExpires: tokens.tokenExpires,
            setTokensInfo,
          }
        );

        if (response.status === HTTP_CODES_ENUM.UNAUTHORIZED) {
          // logOut();
          return;
        }

        const data = await response.json();
        setUser(data);
      }
    } catch {
      // logOut();
    } finally {
      setIsLoaded(true);
    }
  }, [fetchBase, setTokensInfoRef, setTokensInfo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
    }),
    [isLoaded, user]
  );

  const contextActionsValue = useMemo(
    () => ({
      setUser,
      // logOut,
    }),
    // [logOut]
    []
  );

  const contextTokensValue = useMemo(
    () => ({
      tokensInfoRef,
      setTokensInfo,
    }),
    [setTokensInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={contextActionsValue}>
        <AuthTokensContext.Provider value={contextTokensValue}>
          {props.children}
        </AuthTokensContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
