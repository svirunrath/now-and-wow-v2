import { apiSlice } from './apiSlices'
const STOCK_URL = '/api/stock'

export const stockApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStockItemBySubId: builder.query({
      query: ({ sub_category_id, category_id }) => ({
        url: `${STOCK_URL}/master/getAll`,
        method: 'POST',
        body: { sub_category_id: sub_category_id, category_id: category_id }
      })
    }),
    getStockDetailByStockId: builder.query({
      query: ({ stock_id }) => ({
        url: `${STOCK_URL}/detail/getByStockId`,
        method: 'POST',
        body: { stock_id: stock_id }
      })
    }),
    updateStockMasterByProductId: builder.mutation({
      query: (data) => ({
        url: `${STOCK_URL}/master/cutStock`,
        method: 'POST',
        body: data
      })
    }),
    updateStockDetailByProductIdAndPriceId: builder.mutation({
      query: (data) => ({
        url: `${STOCK_URL}/detail/cutStock`,
        method: 'POST',
        body: data
      })
    }),
    getStockInfoByProductId: builder.query({
      query: ({ product_id, import_detail_id }) => ({
        url: `${STOCK_URL}/getStock`,
        method: 'POST',
        body: { product_id: product_id, import_detail_id: import_detail_id }
      })
    })
  })
})

export const {
  useGetStockItemBySubIdQuery,
  useGetStockDetailByStockIdQuery,
  useUpdateStockDetailByProductIdAndPriceIdMutation,
  useUpdateStockMasterByProductIdMutation,
  useLazyGetStockInfoByProductIdQuery
} = stockApiSlice
