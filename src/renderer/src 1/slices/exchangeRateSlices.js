import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchangeRate: localStorage.getItem("exchangeRate")
    ? JSON.parse(localStorage.getItem("exchangeRate"))
    : null,
};

const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {
    setExchangeRate: (state, action) => {
      state.rememberMe = action.payload;
      localStorage.setItem("exchangeRate", JSON.stringify(action.payload));
    },
  },
});

export const { setExchangeRate } = exchangeRateSlice.actions;

export default exchangeRateSlice.reducer;
