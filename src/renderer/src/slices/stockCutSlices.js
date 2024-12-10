import { apiSlice } from './apiSlices'
const STOCK_CUT_URL = '/api/stock/cut'

export const stockCutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerStockCut: builder.mutation({
      query: (data) => ({
        url: `${STOCK_CUT_URL}/`,
        method: 'POST',
        body: data
      })
    }),
    retrieveStockCutList: builder.query({
      query: (data) => ({
        url: `${STOCK_CUT_URL}/getAll`,
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useRegisterStockCutMutation, useLazyRetrieveStockCutListQuery } = stockCutApiSlice
