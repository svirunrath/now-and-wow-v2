import { apiSlice } from './apiSlices'
const PRODUCT_URL = '/api/product'

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    insertImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/image/insert`,
        method: 'POST',
        body: data
      })
    }),
    deleteImage: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/image/delete`,
        method: 'DELETE',
        body: data
      })
    }),
    registerProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/register`,
        method: 'POST',
        body: data
      })
    }),
    getAllProduct: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/getAll`,
        method: 'GET'
      })
    }),
    getProductBySubId: builder.query({
      query: (data) => ({
        url: `${PRODUCT_URL}/getById`,
        method: 'POST',
        body: data
      })
    }),
    updateProductById: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/update`,
        method: 'POST',
        body: data
      })
    }),
    retrieveProductByProductId: builder.query({
      query: (data) => ({
        url: `${PRODUCT_URL}/getByProductId`,
        method: 'POST',
        body: data
      })
    }),
    retrieveProductByMainCategoryId: builder.query({
      query: (data) => ({
        url: `${PRODUCT_URL}/getAllByMainId`,
        method: 'POST',
        body: data
      })
    })
  })
})

export const {
  useInsertImageMutation,
  useDeleteImageMutation,
  useRegisterProductMutation,
  useGetAllProductQuery,
  useGetProductBySubIdQuery,
  useUpdateProductByIdMutation,
  useRetrieveProductByProductIdQuery,
  useRetrieveProductByMainCategoryIdQuery
} = productApiSlice
