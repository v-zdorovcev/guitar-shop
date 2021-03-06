import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  getCartFromLocalStorage,
  getTotalSumOfAllProducts,
  setCartToLocalStorage,
} from '../../utils/cart';
import { postCartOrder, postPromocodeDiscount } from './cart.async';

import type { CartSliceState } from '../../types/state';
import type { CartGuitar } from '../../types/guitar';

type AddQuantityItemPayload = {
  productId: number;
  value: number;
};

const INCREASE_PRODUCT_QUANTITY_STEP = 1;
const DECREASE_PRODUCT_QUANTITY_STEP = 1;
const LOCAL_STORAGE_CART_KEY = 'cart-state-value';

let initialState: CartSliceState = {
  data: {},
  coupon: null,
  discountPercent: 0,
  discount: 0,
  totalCartPrice: 0,
  totalCartPriceWithDiscount: 0,
  itemsQuantity: 0,
};

const localStorageCartState = getCartFromLocalStorage(LOCAL_STORAGE_CART_KEY) || null;

if (localStorageCartState) {
  initialState = localStorageCartState;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<CartGuitar>) => {
      const newProduct = action.payload;

      state.data[newProduct.id] = {
        product: newProduct,
        totalPrice: newProduct.price,
        quantity: INCREASE_PRODUCT_QUANTITY_STEP,
      };

      state.totalCartPrice += newProduct.price;
      state.itemsQuantity += INCREASE_PRODUCT_QUANTITY_STEP;

      state.discount = state.discountPercent
        ? (state.totalCartPrice * state.discountPercent) / 100
        : state.discountPercent;
      state.totalCartPriceWithDiscount = state.discount
        ? state.totalCartPrice - state.discount
        : state.totalCartPrice;

      setCartToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
    },
    removeProductFromCart: (state, action: PayloadAction<number>) => {
      const currentProductId = action.payload;

      state.totalCartPrice -= state.data[currentProductId].totalPrice;
      state.itemsQuantity -= state.data[currentProductId].quantity;

      delete state.data[currentProductId];

      state.discount = state.discountPercent
        ? (state.totalCartPrice * state.discountPercent) / 100
        : state.discountPercent;
      state.totalCartPriceWithDiscount = state.discount
        ? state.totalCartPrice - state.discount
        : state.totalCartPrice;

      setCartToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
    },
    increaseProductQuantity: (state, action: PayloadAction<number>) => {
      const currentProductId = action.payload;
      const currentProduct = state.data[currentProductId];
      const currentProductPrice = currentProduct.product.price;

      currentProduct.quantity += INCREASE_PRODUCT_QUANTITY_STEP;
      currentProduct.totalPrice += currentProductPrice;

      state.itemsQuantity += INCREASE_PRODUCT_QUANTITY_STEP;
      state.totalCartPrice += currentProductPrice;

      state.discount = state.discountPercent
        ? (state.totalCartPrice * state.discountPercent) / 100
        : state.discountPercent;
      state.totalCartPriceWithDiscount = state.discount
        ? state.totalCartPrice - state.discount
        : state.totalCartPrice;

      setCartToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
    },
    decreaseProductQuantity: (state, action: PayloadAction<number>) => {
      const currentProductId = action.payload;
      const currentProduct = state.data[currentProductId];
      const currentProductPrice = currentProduct.product.price;

      if (currentProduct.quantity > 1) {
        currentProduct.quantity -= DECREASE_PRODUCT_QUANTITY_STEP;
        currentProduct.totalPrice -= currentProductPrice;

        state.itemsQuantity -= DECREASE_PRODUCT_QUANTITY_STEP;
        state.totalCartPrice -= currentProductPrice;

        state.discount = state.discountPercent
          ? (state.totalCartPrice * state.discountPercent) / 100
          : state.discountPercent;
        state.totalCartPriceWithDiscount = state.discount
          ? state.totalCartPrice - state.discount
          : state.totalCartPrice;

        setCartToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
      }
    },
    addQuantityItem: (state, action: PayloadAction<AddQuantityItemPayload>) => {
      const currentProductId = action.payload.productId;
      const currentProduct = state.data[currentProductId];
      const currentProductPrice = currentProduct.product.price;
      const newQuantity = action.payload.value;

      currentProduct.quantity = newQuantity;
      currentProduct.totalPrice = currentProductPrice * newQuantity;

      const quantityOfAllProducts = getTotalSumOfAllProducts(state.data, 'quantity');
      const totalPriceOfAllProducts = getTotalSumOfAllProducts(state.data, 'totalPrice');

      state.itemsQuantity = quantityOfAllProducts;
      state.totalCartPrice = totalPriceOfAllProducts;

      state.discount = state.discountPercent
        ? (state.totalCartPrice * state.discountPercent) / 100
        : state.discountPercent;
      state.totalCartPriceWithDiscount = state.discount
        ? state.totalCartPrice - state.discount
        : state.totalCartPrice;

      setCartToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
    },
    setValidCoupon: (state, action: PayloadAction<string>) => {
      state.coupon = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(postPromocodeDiscount.fulfilled, (state, action) => {
        const discountPercent = action.payload;

        state.discountPercent = discountPercent;
        state.discount = (state.totalCartPrice * discountPercent) / 100;
        state.totalCartPriceWithDiscount = state.totalCartPrice - state.discount;
      })
      .addCase(postCartOrder.fulfilled, (state) => {
        state.data = {};
        state.coupon = null;
        state.discountPercent = 0;
        state.discount = 0;
        state.totalCartPrice = 0;
        state.totalCartPriceWithDiscount = 0;
        state.itemsQuantity = 0;

        setCartToLocalStorage(LOCAL_STORAGE_CART_KEY, state);
      })
      .addDefaultCase((state) => state),
});

export const {
  addProductToCart,
  removeProductFromCart,
  increaseProductQuantity,
  decreaseProductQuantity,
  addQuantityItem,
  setValidCoupon,
} = cartSlice.actions;
export default cartSlice.reducer;
