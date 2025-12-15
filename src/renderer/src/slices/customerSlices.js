import { apiSlice } from './apiSlices'
const CUSTOMER_URL = '/api/customer'

export const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/`,
        method: 'POST',
        body: data
      })
    }),
    retrieveListCustomers: builder.query({
      query: () => ({
        url: `${CUSTOMER_URL}/getCustomers`,
        method: 'GET'
      })
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: `${CUSTOMER_URL}/updateCustomer`,
        method: 'POST',
        body: data
      })
    })
  })
})

export const {
  useRegisterCustomerMutation,
  useRetrieveListCustomersQuery,
  useUpdateCustomerMutation
} = customerApiSlice
