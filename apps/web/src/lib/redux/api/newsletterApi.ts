import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/catalog";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  createdAt: string;
}

export interface SubscribeNewsletterPayload {
  email: string;
  /** Where on the site the signup happened, e.g. "homepage_footer". */
  source?: string;
}

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Backs the "The Noor Circle / Join Our Community" section. Public
     * endpoint — works for guests and logged-in users alike.
     */
    subscribeNewsletter: builder.mutation<NewsletterSubscriber, SubscribeNewsletterPayload>({
      query: (body) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<NewsletterSubscriber>) => response.data,
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
