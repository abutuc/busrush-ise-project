import { View, ActivityIndicator, Text } from "react-native";
const Loading = (props) => {
  return (
    <View style={styles.indicatorWrapper}>
      <ActivityIndicator size="large" color="#3B2E6E" />
      <Text style={styles.indicatorText}>{props.content}</Text>
    </View>
  );
};
export default Loading;

const styles = {
  indicatorWrapper: {
    paddingTop: 100,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
};
