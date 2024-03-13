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
    })
  })
})

export const { useLazyRetrieveSaleReportQuery } = reportApiSlice
