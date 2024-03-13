import { apiSlice } from "./apiSlices";
const STOCK_URL = "/api/stock";

export const stockApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockItemBySubId: builder.query({
      query: ({ sub_category_id, category_id }) => ({
        url: `${STOCK_URL}/master/getAll`,
        method: "POST",
        body: { sub_category_id: sub_category_id, category_id: category_id },
      }),
    }),
    getStockDetailByProductId: builder.query({
      query: ({ product_id }) => ({
        url: `${STOCK_URL}/detail/getByProductId`,
        method: "POST",
        body: { product_id: product_id },
      }),
    }),
    updateStockMasterByProductId: builder.mutation({
      query: (data) => ({
        url: `${STOCK_URL}/master/cutStock`,
        method: "POST",
        body: data,
      }),
    }),
    updateStockDetailByProductIdAndPriceId: builder.mutation({
      query: (data) => ({
        url: `${STOCK_URL}/detail/cutStock`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetStockItemBySubIdQuery,
  useGetStockDetailByProductIdQuery,
  useUpdateStockDetailByProductIdAndPriceIdMutation,
  useUpdateStockMasterByProductIdMutation,
} = stockApiSlice;
