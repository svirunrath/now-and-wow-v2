import { apiSlice } from "./apiSlices";
const EXCH_URL = "/api/exch-rate";

export const exchangeRateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExchangeRate: builder.query({
      query: ({ exch_currency }) => ({
        url: `${EXCH_URL}/currency`,
        method: "POST",
        body: { exch_currency: exch_currency },
      }),
    }),
    registerExchangeRate: builder.mutation({
      query: (data) => ({
        url: `${EXCH_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetExchangeRateQuery, useRegisterExchangeRateMutation } =
  exchangeRateApiSlice;
