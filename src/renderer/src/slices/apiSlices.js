import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:5001' })

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({})
})
