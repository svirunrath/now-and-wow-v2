import { apiSlice } from "./apiSlices";
const IMPORT_URL = "/api/import";

export const importApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerImport: builder.mutation({
      query: (data) => ({
        url: `${IMPORT_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    updateImport: builder.mutation({
      query: (data) => ({
        url: `${IMPORT_URL}/update`,
        method: "POST",
        body: data,
      }),
    }),
    // retrieveImportHistory: builder.query({
    //   query: ({ startDate, endDate }) => ({
    //     url: `${IMPORT_URL}/history`,
    //     method: "POST",
    //     body: { startDate: startDate, endDate: endDate },
    //   }),
    // }),
    retrieveImportHistory: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `${IMPORT_URL}/history`,
        method: "POST",
        body: { startDate: startDate, endDate: endDate },
      }),
    }),
    retrieveImportById: builder.query({
      query: ({ import_id }) => ({
        url: `${IMPORT_URL}/detail`,
        method: "POST",
        body: { import_id: import_id },
      }),
    }),
  }),
});

export const {
  useRegisterImportMutation,
  useLazyRetrieveImportHistoryQuery,
  useRetrieveImportByIdQuery,
  useUpdateImportMutation,
} = importApiSlice;
