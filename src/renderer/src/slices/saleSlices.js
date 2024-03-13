import { apiSlice } from "./apiSlices";
const SALE_URL = "/api/sale";

export const saleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerSale: builder.mutation({
      query: (data) => ({
        url: `${SALE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    updatePaidOrder: builder.mutation({
      query: (data) => ({
        url: `${SALE_URL}/updatepaid`,
        method: "POST",
        body: data,
      }),
    }),
    retrieveSaleSummary: builder.query({
      query: () => ({
        url: `${SALE_URL}/summary`,
        method: "GET",
      }),
    }),
    retrieveTodayItemSold: builder.query({
      query: () => ({
        url: `${SALE_URL}/itemcount`,
        method: "GET",
      }),
    }),
    retrieveUnpaidOrder: builder.query({
      query: () => ({
        url: `${SALE_URL}/unpaid`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterSaleMutation,
  useRetrieveSaleSummaryQuery,
  useRetrieveTodayItemSoldQuery,
  useRetrieveUnpaidOrderQuery,
  useUpdatePaidOrderMutation,
} = saleApiSlice;
