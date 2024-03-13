import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlices";
import exchangeRateReducer from "./slices/exchangeRateSlices";
import { apiSlice } from "./slices/apiSlices";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    exchangeRate: exchangeRateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
