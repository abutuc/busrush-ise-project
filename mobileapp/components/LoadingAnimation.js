import { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";

const LoadingAnimation = (props) => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: props.time,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={styles.indicatorWrapper}>
      <Animated.Image
        source={require("../assets/bus.png")}
        style={[styles.busImage, { transform: [{ translateX }] }]}
        resizeMode="contain"
      />
      <Text style={styles.indicatorText}>{props.content}</Text>
    </View>
  );
};
export default LoadingAnimation;

const styles = {
  indicatorWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {},
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
  },
  busImage: {
    width: 50,
    height: 50,
    margin: 10,
  },
};
