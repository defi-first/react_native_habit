import { getData, storeData } from "@/utils";
import { HABIT_LIST } from "@/utils/constant";
import { updateHabit } from ".";
import { AppDispatch, RootState } from "@/store";
import { Habit } from "@/types";

export const getHabit = () => async (dispatch: AppDispatch) => {
  const habitList = (await getData(HABIT_LIST)) || [];
  dispatch(updateHabit(habitList));
};

export const addHabit =
  (obj: Habit) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const habitList = (await getData(HABIT_LIST)) || [];
    const newHabitList = [...habitList, obj];
    await storeData(HABIT_LIST, newHabitList);
    dispatch(updateHabit(newHabitList));
  };

export const deleteHabit =
  (obj: Habit) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const habitList = ((await getData(HABIT_LIST)) || []) as Habit[];
    const newHabitList = habitList.filter((item) => item.id !== obj.id);
    await storeData(HABIT_LIST, newHabitList);
    dispatch(updateHabit(newHabitList));
  };
