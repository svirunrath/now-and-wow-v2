import { apiSlice } from './apiSlices'
const REPORT_URL = '/api/report'

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveSaleReport: builder.query({
      query: (data) => ({
        url: `${REPORT_URL}/salereport`,
        method: 'POST',
        body: data
      })
    }),
    retrieveProductSaleReport: builder.query({
      query: (data) => ({
        url: `${REPORT_URL}/psalereport`,
        method: 'POST',
        body: data
      })
    }),
    retrieveStockMasterReport: builder.query({
      query: (data) => ({
        url: `${REPORT_URL}/mstock`,
        method: 'POST',
        body: data
      })
    }),
    retrieveStockDetailReport: builder.query({
      query: (data) => ({
        url: `${REPORT_URL}/dstock`,
        method: 'POST',
        body: data
      })
    })
  })
})

export const {
  useLazyRetrieveSaleReportQuery,
  useLazyRetrieveProductSaleReportQuery,
  useLazyRetrieveStockMasterReportQuery,
  useLazyRetrieveStockDetailReportQuery
} = reportApiSlice
