import { apiSlice } from "./apiSlices";
const BARCODE_URL = "/api/barcode";

export const barcodeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerBarcode: builder.mutation({
      query: (data) => ({
        url: `${BARCODE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    retrieveProductByBarcode: builder.query({
      query: (data) => ({
        url: `${BARCODE_URL}/getProduct`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterBarcodeMutation,
  useLazyRetrieveProductByBarcodeQuery,
} = barcodeApiSlice;
