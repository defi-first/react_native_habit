import { AppDispatch, RootState } from "@/store";
import { deleteHabit, getHabit } from "@/store/habit/action";
import { Habit } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { FlatList, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Surface, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

const Index = () => {
  const { habitList } = useSelector((state: RootState) => state.habitReducer);
  const route = useRouter();
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getHabit());
  }, []);

  const renderRightActions = (item: Habit) => (
    <View
      className="flex-row justify-end items-center flex-1 rounded-[18px] overflow-hidden"
      style={{ backgroundColor: item.light, opacity: 0.8 }}
    >
      <TouchableOpacity className="flex justify-center items-center w-16 h-full bg-[#4caf50]">
        <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        className="flex justify-center items-center w-16 h-full bg-[#e53935]"
        onPress={() => handleDeleteHabit(item)}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const handleDeleteHabit = async (item: Habit) => {
    dispatch(deleteHabit(item));
  };

  const closeOtherSwiper = (id: string) => {
    for (let key in swipeableRefs.current) {
      if (key !== id) {
        swipeableRefs.current[key]?.close();
      }
    }
  };

  const renderItem = (item: Habit) => (
    <Swipeable
      containerStyle={{ marginBottom: 18 }}
      key={`${item.id}}`}
      ref={(ref) => {
        swipeableRefs.current[item.id] = ref;
      }}
      overshootLeft={false}
      overshootRight={false}
      renderRightActions={() => renderRightActions(item)}
      onSwipeableOpen={(direction) => {
        // if (direction === "left") {
        // }
        // if (direction === "right") {
        // }

        closeOtherSwiper(item.id);
      }}
    >
      <Surface
        elevation={0}
        style={{
          borderRadius: 18,
          backgroundColor: item.light,
          opacity: 0.8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <TouchableWithoutFeedback onPress={() => closeOtherSwiper(item.id)}>
          <View className="p-5">
            <Text className="text-[20px] font-bold mb-1" style={{ color: "#22223b" }}>
              {item.title}
            </Text>
            <Text className="text-[15px] mb-4" style={{ color: "#6c6c80" }}>
              {item.description}
            </Text>
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center text-[#ccc] rounded-l py-2 px-1">
                <MaterialCommunityIcons name="fire" size={18} color="#ff9800" />
                <Text className="ml-2 text-[#ff9800] font-bold text-[14px]">
                  {item.streak_count} day streak
                </Text>
              </View>
              <View className="bg-[#ede7f6] rounded-l py-2 px-1">
                <Text className="font-bold text-[14px]" style={{ color: "#7c4dff" }}>
                  {item.frequency}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Surface>
    </Swipeable>
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-[#666666]">No Habits yet. Add your first Habit!</Text>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={habitList || []}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 6 }}
        ListEmptyComponent={() => ListEmptyComponent()}
        ListFooterComponent={() => <View style={{ paddingVertical: 40 }}></View>}
      />
    </View>
  );
};

export default Index;
