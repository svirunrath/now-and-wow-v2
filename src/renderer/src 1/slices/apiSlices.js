import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const dynamicBaseQuery = async (args, WebApi, extraOptions) => {
  const baseUrl = (WebApi.getState()).configuration.baseUrl;
  const rawBaseQuery = fetchBaseQuery({ baseUrl });
  return rawBaseQuery(args, WebApi, extraOptions);
};

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:5000" });

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}),
});
