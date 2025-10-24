import { Habit } from "@/types";
import { getData } from "@/utils";
import { HABIT_LIST } from "@/utils/constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

const Index = () => {
  const route = useRouter();
  const [habit, setHabit] = useState<Habit[]>([]);
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = (await getData(HABIT_LIST)) || [];
      setHabit(response);
      console.log({ response });
    } catch (error) {
      console.error(error);
    }
  };
  const renderRightActions = () => (
    <View className="justify-center items-end flex-1 bg-[#4caf50] rounded-[18px] pr-4">
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
      />
    </View>
  );

  const renderLeftActions = () => (
    <View className="justify-center items-start flex-1 bg-[#e53935] rounded-[18px] pl-4">
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  const handleDeleteHabit = async (created: string) => {
    alert(123);
  };

  return (
    <ScrollView
      className="flex-1 p-4 bg-[#f5f5f5]"
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text variant="headlineSmall">Today&apos;s Habit</Text>
        <Button
          mode="text"
          onPress={() => route.replace("/auth")}
          icon="logout"
        >
          Sign Out
        </Button>
      </View>
      {habit.length ? (
        habit.map((item, index) => (
          <Swipeable
            containerStyle={{ marginBottom: 18 }}
            key={`${item.created_at}_${index}`}
            ref={(ref) => {
              swipeableRefs.current[item.created_at] = ref;
            }}
            overshootLeft={false}
            overshootRight={false}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => {
              if (direction === "left") {
                handleDeleteHabit(item.created_at);
              }
              if (direction === "right") {
              }

              // 移动完成之后自动复原
              swipeableRefs.current[item.created_at]?.close();
            }}
          >
            <Surface
              elevation={0}
              style={{
                borderRadius: 18,
                backgroundColor: "#f7f2fa",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="p-5">
                <Text
                  className="text-[20px] font-bold mb-1"
                  style={{ color: "#22223b" }}
                >
                  {item.title}
                </Text>
                <Text className="text-[15px] mb-4" style={{ color: "#6c6c80" }}>
                  {item.description}
                </Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center bg-[#fff3e0] rounded-l py-2 px-1">
                    <MaterialCommunityIcons
                      name="fire"
                      size={18}
                      color="#ff9800"
                    />
                    <Text className="ml-2 text-[#ff9800] font-bold text-[14px]">
                      {item.streak_count} day streak
                    </Text>
                  </View>
                  <View className="bg-[#ede7f6] rounded-l py-2 px-1">
                    <Text
                      className="font-bold text-[14px]"
                      style={{ color: "#7c4dff" }}
                    >
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
          <Text className="text-[#666666]">
            No Habits yet. Add your first Habit!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Index;
