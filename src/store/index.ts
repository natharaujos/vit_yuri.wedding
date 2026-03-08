// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import giftReducer from "./giftSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    gifts: giftReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
