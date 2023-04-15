import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import { Card, Title, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NextBuses = (props) => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Chosen Bus Information", {
          id: item.id,
          linha: item.linha,
        })
      }
    >
      <Card style={styles.card}>
        <Card.Content style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.titleContainer}>
              <Title style={styles.title}>{item.linha}</Title>
              <View
                style={{
                  justifyContent: "flex-end",
                  paddingLeft: 305,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  color="#3B2E6E"
                  size={25}
                />
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="time" color="#3B2E6E" size={20} />
              <View style={{ flexDirection: "column" }}>
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {item.time}
                </Paragraph>
                <Text style={{ color: "grey" }}>(expected arrival)</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="timer" color="#3B2E6E" size={20} />
              <View style={{ flexDirection: "column" }}>
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {(item.delay / 60).toFixed(0)} min.
                </Paragraph>
                <Text style={{ color: "grey" }}>(delayed time)</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={props.dados}
      renderItem={renderItem}
      keyExtractor={(item) => item.linha}
      style={{ height: 500 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { NextBuses };
