import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data: {
    user: { id: string; name: string; email: string };
    accessToken: string;
    refreshToken: string;
  };
};

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login-account",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getMe: build.query<{ data: { id: string; name: string; email: string } }, void>({
      query: () => "/users/me",
      providesTags: [tagTypes.auth],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
