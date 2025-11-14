// components/SuspensionBall.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, ViewStyle } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const STORAGE_KEY = "FLOATING_BALL_POSITION_V2";

interface Props {
  size?: number;
  bottomSafeArea?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

type InternalAnimatedValue = Animated.Value & { _value: number };

type InternalValueXY = Animated.ValueXY & {
  x: InternalAnimatedValue;
  y: InternalAnimatedValue;
};

export default function SuspensionBall({ size = 64, bottomSafeArea = 80, onPress, style }: Props) {
  const initialX = SCREEN_WIDTH - size - 8;
  const initialY = SCREEN_HEIGHT / 2 - size / 2;

  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY }) as InternalValueXY).current;
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) pan.setValue(JSON.parse(saved));
      } catch {}
    })();
  }, []);

  const savePosition = (pos: { x: number; y: number }) =>
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pos));

  const clampPosition = (x: number, y: number) => {
    const maxY = SCREEN_HEIGHT - size - bottomSafeArea;
    return {
      x: Math.max(0, Math.min(x, SCREEN_WIDTH - size)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  };

  const snapToEdge = () => {
    const currentX = pan.x._value;
    const currentY = pan.y._value;

    const isLeftSide = currentX + size / 2 < SCREEN_WIDTH / 2;
    const targetX = isLeftSide ? 8 : SCREEN_WIDTH - size - 8;

    const { x, y } = clampPosition(targetX, currentY);

    Animated.spring(pan, {
      toValue: { x, y },
      friction: 7,
      tension: 80, // 更快一点
      useNativeDriver: false,
    }).start(() => savePosition({ x, y }));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDragging(true);
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        setDragging(false);
        pan.flattenOffset();

        snapToEdge();
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        pan.flattenOffset();

        snapToEdge();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.ball,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: dragging ? 1 : 0.92,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
        style,
      ]}
    >
      <Pressable style={{ flex: 1, borderRadius: size / 2 }} onPress={() => onPress?.()} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    position: "absolute",
    backgroundColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
});
