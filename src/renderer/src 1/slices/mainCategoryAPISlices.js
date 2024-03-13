import { apiSlice } from "./apiSlices";
const MAIN_CAT_URL = "/api/main-category";

export const mainCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMainCategory: builder.query({
      query: () => ({
        url: `${MAIN_CAT_URL}/getAll`,
        method: "GET",
      }),
    }),
    registerMainCategory: builder.mutation({
      query: (data) => ({
        url: `${MAIN_CAT_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    updateMainCategory: builder.mutation({
      query: (data) => ({
        url: `${MAIN_CAT_URL}/update`,
        method: "POST",
        body: data,
      }),
    }),
    deleteMainCategory: builder.mutation({
      query: (data) => ({
        url: `${MAIN_CAT_URL}/delete`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMainCategoryQuery,
  useRegisterMainCategoryMutation,
  useUpdateMainCategoryMutation,
  useDeleteMainCategoryMutation,
} = mainCategoryApiSlice;
