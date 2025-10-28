import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import { addHabit } from "@/store/habit/action";
import { useDispatch } from "react-redux";
import { uuid } from "expo-modules-core";
import { AppDispatch } from "@/store";

const FREQUENCY = ["Daily", "Weekly", "Monthly"];
type Frequency = (typeof FREQUENCY)[number];

const AddHabit = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("Daily");
  const [error, setError] = useState<string>("");
  const theme = useTheme();
  const route = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    try {
      dispatch(
        addHabit({
          id: uuid.v4(),
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
      );

      route.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setError("There was an error creating the habit");
    }
  };
  return (
    <View className="flex-1 justify-center p-4 bg-[#f5f5f5]">
      <TextInput
        style={{ marginBottom: 16 }}
        label="Title"
        mode="outlined"
        onChangeText={setTitle}
      />
      <TextInput
        style={{ marginBottom: 16 }}
        label="Description"
        mode="outlined"
        onChangeText={setDescription}
      />
      <View className="mb-6">
        <SegmentedButtons
          value={frequency}
          onValueChange={setFrequency}
          buttons={FREQUENCY.map((i) => ({
            value: i,
            label: i,
          }))}
          multiSelect={false}
        />
      </View>
      <Button mode="contained" onPress={handleSubmit} disabled={!title || !description}>
        Add Habit
      </Button>
      {error && (
        <Text className="my-2" style={{ color: theme.colors.error }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default AddHabit;
