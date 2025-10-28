import { Habit } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HabitState {
  habitList: Habit[];
}

const initialState: HabitState = {
  habitList: [],
};

export const habitSlice = createSlice({
  name: "habit",
  initialState: initialState,
  reducers: {
    updateHabit(state, actions: PayloadAction<Habit[]>) {
      state.habitList = actions.payload;
    },
  },
});

export const { updateHabit } = habitSlice.actions;

export default habitSlice.reducer;
