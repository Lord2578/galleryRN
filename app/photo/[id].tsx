import { Image, Text } from "react-native";
import React, { useEffect } from "react";
import { photos } from "../../data";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function PhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const photo = photos.find((p) => p.id === Number.parseInt(id));

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gesture = Gesture.Pinch()
    .onChange((e) => {
      scale.value = e.scale;
    })
    .onEnd((e) => {
      if (e.velocity < 0) {
        runOnJS(router.back)();
      } else {
        scale.value = withTiming(1);
      }
    });

  if (!photo) {
    return <Text>Photo not found</Text>;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.Image
        source={photo.image}
        style={[{ width: "100%", height: "100%" }, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
}
