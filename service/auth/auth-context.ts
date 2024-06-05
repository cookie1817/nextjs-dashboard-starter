"use client";

import { Tokens } from "@/service/api/types/tokens";
import { User } from "@/service/api/types/user";
import { createContext } from "react";

export type TokensInfo = Tokens | null;

export const AuthContext = createContext<{
  user: User | null;
  isLoaded: boolean;
}>({
  user: null,
  isLoaded: true,
});

export const AuthActionsContext = createContext<{
  user: React.MutableRefObject<User> | null
  setUser: (user: User) => void;
  logOut: () => Promise<void>;
}>({
  user: null,
  setUser: () => {},
  logOut: async () => {},
});

export const AuthTokensContext = createContext<{
  tokensInfoRef: React.MutableRefObject<Tokens>;
  setTokensInfo: (tokensInfo: TokensInfo) => void;
}>({
  tokensInfoRef: {
    current: {
      accessToken: null,
      refreshToken: null,
      tokenExpires: null,
    },
  },
  setTokensInfo: () => {},
});
