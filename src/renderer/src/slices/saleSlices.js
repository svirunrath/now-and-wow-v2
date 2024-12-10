import { apiSlice } from './apiSlices'
const SALE_URL = '/api/sale'

export const saleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerSale: builder.mutation({
      query: (data) => ({
        url: `${SALE_URL}/`,
        method: 'POST',
        body: data
      })
    }),
    updatePaidOrder: builder.mutation({
      query: (data) => ({
        url: `${SALE_URL}/updatepaid`,
        method: 'POST',
        body: data
      })
    }),
    retrieveLastSaleId: builder.query({
      query: () => ({
        url: `${SALE_URL}/saleId`,
        method: 'GET'
      })
    }),
    retrieveSaleSummary: builder.query({
      query: () => ({
        url: `${SALE_URL}/summary`,
        method: 'GET'
      })
    }),
    retrieveTodayItemSold: builder.query({
      query: () => ({
        url: `${SALE_URL}/itemcount`,
        method: 'GET'
      })
    }),
    retrieveUnpaidOrder: builder.query({
      query: () => ({
        url: `${SALE_URL}/unpaid`,
        method: 'GET'
      })
    }),
    retrieveSaleMasterList: builder.query({
      query: ({ startDate, endDate, unpaidYn, refundedYn }) => ({
        url: `${SALE_URL}/list`,
        method: 'POST',
        body: { startDate: startDate, endDate: endDate, unpaidYn: unpaidYn, refundedYn: refundedYn }
      })
    }),
    updateRefundedSale: builder.mutation({
      query: ({ sale_id, modified_by }) => ({
        url: `${SALE_URL}/refund`,
        method: 'POST',
        body: { sale_id: sale_id, modified_by: modified_by }
      })
    }),
    retrieveSaleDetailBySaleId: builder.query({
      query: ({ sale_id }) => ({
        url: `${SALE_URL}/detail/list`,
        method: 'POST',
        body: { sale_id: sale_id }
      })
    })
  })
})

export const {
  useRegisterSaleMutation,
  useRetrieveSaleSummaryQuery,
  useRetrieveTodayItemSoldQuery,
  useRetrieveUnpaidOrderQuery,
  useRetrieveLastSaleIdQuery,
  useUpdatePaidOrderMutation,
  useLazyRetrieveSaleMasterListQuery,
  useUpdateRefundedSaleMutation,
  useLazyRetrieveSaleDetailBySaleIdQuery
} = saleApiSlice
