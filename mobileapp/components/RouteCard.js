import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const RouteCard = ({ routeNumber }) => {
  return (
    <View style={Styles.buttonStyle}>
      <TouchableOpacity
        onPress={onBtnPressed}
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
      >
        <Text style={Styles.textStyle}>{routeNumber}</Text>
      </TouchableOpacity>
    </View>
  );
};

onBtnPressed = ({ routeNumber }) => {
  console.log("Button pressed");
  console.log(routeNumber);
};

const Styles = {
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#fff",
    width: 60,
    height: 50,
    marginTop: 2,
    marginBottom: 10,
    marginRight: 15,
    borderRadius: 5,
    padding: 5,
    elevation: 10,
    shadowColor: "#52006A",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  textStyle: {
    color: "#517fa4",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
};

export { RouteCard };
