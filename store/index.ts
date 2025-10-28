import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./habit";

const store = configureStore({
  reducer: {
    habitReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
