import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

const AuthScreen = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setError(null);
    router.replace("/(tabs)");
  };

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f5f5f5]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1 p-4 justify-center">
        <Text className="text-center mb-6" variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <TextInput
          label="email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="password"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
        />
        {error && (
          <Text className="my-2" style={{ color: theme.colors.error }}>
            {error}
          </Text>
        )}
        <Button mode="contained" className="mt-2" onPress={handleAuth}>
          {isSignUp ? "Sign up" : "Sign in"}
        </Button>
        <Button mode="text" onPress={handleSwitchMode} className="mt-4">
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
