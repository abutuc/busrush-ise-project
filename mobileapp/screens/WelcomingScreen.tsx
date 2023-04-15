import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  PixelRatio,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomingScreen = () => {
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const { width, height } = Dimensions.get("window");

  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { currentPage: pageIndex } = sliderState;

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          style={{ flex: 1 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event: any) => {
            setSliderPage(event);
          }}
        >
          <View style={{ width, height }}>
            <View>
              <Image
                source={require("../assets/logo.png")}
                style={styles.imageStyle}
              />
              <View
                style={{
                  alignContent: "center",
                  alignSelf: "center",
                  paddingTop: 100,
                  paddingLeft: 20,
                }}
              >
                <Image
                  source={require("../assets/swipe.png")}
                  style={{ width: 200, height: 50 }}
                />
              </View>
            </View>
          </View>

          <View style={{ width, height }}>
            <Image
              source={require("../assets/closest_to.png")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Browse The Nearest Bus Stops...</Text>
            </View>
            <View
              style={{
                alignContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../assets/swipe.png")}
                style={{ width: 150, height: 40 }}
              />
            </View>
          </View>
          <View style={{ width, height }}>
            <Image
              source={require("../assets/origin.png")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>
                ... or from a personalized origin!
              </Text>
            </View>
            <View
              style={{
                alignContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../assets/swipe.png")}
                style={{ width: 150, height: 40 }}
              />
            </View>
          </View>

          <View style={{ width, height }}>
            <Image
              source={require("../assets/destination.png")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>
                You can also choose your destination!
              </Text>
            </View>
            <View
              style={{
                alignContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../assets/swipe.png")}
                style={{ width: 150, height: 40 }}
              />
            </View>
          </View>

          <View style={{ width, height }}>
            <Image
              source={require("../assets/bus_info.png")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>
                See details of a bus in real-time!
              </Text>
            </View>
            <View
              style={{
                alignContent: "center",
                alignSelf: "center",
              }}
            >
              <Image
                source={require("../assets/swipe.png")}
                style={{ width: 150, height: 40 }}
              />
            </View>
          </View>

          <View style={{ width, height }}>
            <Image
              source={require("../assets/aveirobus.jpg")}
              style={styles.imageStyle}
            />
            <View style={styles.wrapper}>
              <Text style={styles.header}>Never miss a bus again!</Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ paddingBottom: 50 }}>
          <View style={styles.paginationWrapper}>
            {Array.from(Array(6).keys()).map((key, index) => (
              <View
                style={[
                  styles.paginationDots,
                  { opacity: pageIndex === index ? 1 : 0.2 },
                ]}
                key={index}
              />
            ))}
          </View>
        </View>
        <Button
          onPress={() => navigation.navigate("Home")}
          style={{
            borderWidth: 1,
            borderColor: "lightgrey",
            width: 200,
            alignSelf: "center",
            marginBottom: 20,
            backgroundColor: "#3B2E6E",
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>Get Started</Text>
        </Button>
      </SafeAreaView>
    </>
  );
};
export default WelcomingScreen;

const styles = StyleSheet.create({
  imageStyle: {
    height: PixelRatio.getPixelSizeForLayoutSize(155),
    width: "100%",
  },
  swipeImage: {
    width: 100,
    height: 50,
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 17,
    textAlign: "center",
  },
  paginationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#0898A0",
    marginLeft: 10,
  },
});
