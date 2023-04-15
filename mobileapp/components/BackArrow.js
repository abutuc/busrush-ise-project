import { StyleSheet } from "react-native";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BackArrow = ({ onPress }) => (
  <View
    style={{
      flexDirection: "row",
      backgroundColor: "#3B2E6E",
    }}
  >
    <View
      style={{
        flex: 1,
        alignItems: "flex-start",
        height: 40,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View style={styles.backArrowContainer}>
          <Ionicons name="arrow-back-outline" color={"white"} size={25} />
        </View>
      </TouchableOpacity>
    </View>
  </View>
);
export default BackArrow;

const styles = StyleSheet.create({
  backArrowContainer: {
    paddingLeft: 15,
  },
});
