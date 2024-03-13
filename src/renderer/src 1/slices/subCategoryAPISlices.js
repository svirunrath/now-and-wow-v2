import { apiSlice } from "./apiSlices";
const SUB_CAT_URL = "/api/sub-category";

export const subCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategory: builder.query({
      query: () => ({
        url: `${SUB_CAT_URL}/getAll`,
        method: "GET",
      }),
    }),
    registerSubCategory: builder.mutation({
      query: (data) => ({
        url: `${SUB_CAT_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    updateSubCategory: builder.mutation({
      query: (data) => ({
        url: `${SUB_CAT_URL}/update`,
        method: "POST",
        body: data,
      }),
    }),
    deleteSubCategory: builder.mutation({
      query: (data) => ({
        url: `${SUB_CAT_URL}/delete`,
        method: "POST",
        body: data,
      }),
    }),
    getSubCategoryByMainId: builder.query({
      query: ({ category_id }) => ({
        url: `${SUB_CAT_URL}/getByMainId`,
        method: "POST",
        body: { category_id: category_id },
      }),
    }),
  }),
});

export const {
  useGetSubCategoryQuery,
  useGetSubCategoryByMainIdQuery,
  useRegisterSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApiSlice;
