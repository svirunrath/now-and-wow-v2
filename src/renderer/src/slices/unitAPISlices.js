import { apiSlice } from "./apiSlices";
const UNIT_URL = "/api/unit";

export const unitApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUnitList: builder.query({
      query: () => ({
        url: `${UNIT_URL}/getAll`,
        method: "GET",
      }),
    }),
    registerUnit: builder.mutation({
      query: (data) => ({
        url: `${UNIT_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRetrieveUnitListQuery, useRegisterUnitMutation } =
  unitApiSlice;
