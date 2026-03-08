import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  giftId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) => {
      const { giftId, title, image, price, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.giftId === giftId);

      if (existingItem) {
        existingItem.quantity += quantity;
        return;
      }

      state.items.push({ giftId, title, image, price, quantity });
    },
    updateQuantity: (state, action: PayloadAction<{ giftId: string; quantity: number }>) => {
      const { giftId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.giftId === giftId);

      if (!existingItem) {
        return;
      }

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.giftId !== giftId);
        return;
      }

      existingItem.quantity = quantity;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.giftId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
