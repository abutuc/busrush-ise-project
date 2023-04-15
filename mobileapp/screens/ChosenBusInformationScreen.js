import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import LoadingAnimation from "../components/LoadingAnimation";
import BackArrow from "../components/BackArrow";
import BusInfo from "../components/BusInfo";
import NextBusStop from "../components/NextBusStop";
import TimeInfo from "../components/TimeInfo";
import Passengers from "../components/Passengers";
import { Dimensions } from "react-native";

const ChosenBusInformationScreen = ({ route }) => {
  const api_addr = "http://192.168.160.222:8080";
  const navigation = useNavigation();
  const id = route.params.id;
  const linha = route.params.linha;
  const [data, setData] = useState({
    id: "",
    bus: { id: "", registration: "", brand: "", model: "" },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "Chosen Bus Information",
    });

    (async () => {
      try {
        const response = await fetch(api_addr + "/api/schedules/info/" + id);
        const json = await response.json();
        setData(json);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView
        style={{
          flex: 1,
          height: Dimensions.get("screen").height,
          backgroundColor: "white",
        }}
      >
        {isLoading ? (
          <LoadingAnimation content="Loading bus details..." time={4000} />
        ) : (
          <View style={{ backgroundColor: "white" }}>
            <BackArrow onPress={() => navigation.navigate("Home")} />
            <BusInfo bus={data.bus} />
            <NextBusStop busStop={data.next_stop.designation} />
            <TimeInfo time={data.time} delay={data.delay} />
            <Passengers passengers={data.passengers} />
          </View>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ChosenBusInformationScreen;

const styles = StyleSheet.create({
  white_bg: {
    backgroundColor: "white",
  },
  redtext: {
    color: "red",
  },
});
