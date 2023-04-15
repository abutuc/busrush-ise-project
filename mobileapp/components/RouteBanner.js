import { Card, Paragraph, Title } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RouteBanner = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Card style={styles.card}>
        <Card.Content style={{ flexDirection: "column" }}>
          <Title style={{ fontSize: 18, alignSelf: "center" }}>
            {props.buses.length == 1
              ? "Found 1 Route from:"
              : "Found " + props.buses.length + " routes from:"}
          </Title>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            {props.originStop != null ? (
              <Paragraph style={{ fontSize: 15, fontWeight: "700" }}>
                {props.originStop}
              </Paragraph>
            ) : null}
            {props.originStop != null && props.destinationStop != null ? (
              <Ionicons name="ellipsis-vertical" color="#3B2E6E" size={20} />
            ) : null}
            {props.destinationStop != null ? (
              <Paragraph style={{ fontSize: 15, fontWeight: "700" }}>
                {props.destinationStop}
              </Paragraph>
            ) : null}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
export default RouteBanner;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
