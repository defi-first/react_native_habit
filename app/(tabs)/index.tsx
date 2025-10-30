import { AppDispatch, RootState } from "@/store";
import { deleteHabit, getHabit } from "@/store/habit/action";
import { Habit } from "@/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
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

  const renderRightActions = () => (
    <View className="justify-center items-end flex-1 bg-[#4caf50] rounded-[18px] pr-4">
      <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff" />
    </View>
  );

  const renderLeftActions = () => (
    <View className="justify-center items-start flex-1 bg-[#e53935] rounded-[18px] pl-4">
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  const handleDeleteHabit = async (item: Habit) => {
    dispatch(deleteHabit(item));
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 p-4" showsHorizontalScrollIndicator={false}>
        {habitList.length ? (
          habitList.map((item, index) => (
            <Swipeable
              containerStyle={{ marginBottom: 18 }}
              key={`${item.id}}`}
              ref={(ref) => {
                swipeableRefs.current[item.id] = ref;
              }}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={renderRightActions}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  handleDeleteHabit(item);
                }
                if (direction === "right") {
                }

                // 移动完成之后自动复原
                swipeableRefs.current[item.id]?.close();
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
              </Surface>
            </Swipeable>
          ))
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-[#666666]">No Habits yet. Add your first Habit!</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        className="w-16 h-16 absolute right-6 bottom-6 rounded-full bg-[#2775f9] z-50 shadow-lg items-center justify-center"
        onPress={() => route.push("/(tabs)/add-habit")}
      >
        <Ionicons name="pencil" color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default Index;
