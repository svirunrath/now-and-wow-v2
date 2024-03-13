import { apiSlice } from "./apiSlices";
const PRICE_URL = "/api/price";

export const priceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductPriceByPriceId: builder.query({
      query: ({ product_id }) => ({
        url: `${PRICE_URL}/getPrice`,
        method: "POST",
        body: {
          product_id: product_id,
        },
      }),
    }),
    getPriceIdByProductPrice: builder.query({
      query: ({ product_id, product_sell_price }) => ({
        url: `${PRICE_URL}/getPriceId`,
        method: "POST",
        body: {
          product_id: product_id,
          product_sell_price: product_sell_price,
        },
      }),
    }),
  }),
});

export const {
  useGetProductPriceByPriceIdQuery,
  useGetPriceIdByProductPriceQuery,
} = priceApiSlice;
