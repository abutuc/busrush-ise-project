import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Card, Paragraph } from "react-native-paper";

const NextBusStop = ({ busStop }) => {
  return (
    <View style={{ margin: 15 }}>
      <Card>
        <Card.Content style={{ flexDirection: "row" }}>
          <View style={{ justifyContent: "center" }}>
            <Ionicons name="trail-sign-outline" color={"#3B2E6E"} size={40} />
          </View>
          <View style={{ flexDirection: "column", paddingLeft: 30 }}>
            <Paragraph
              style={{ textAlign: "center", fontWeight: "700", fontSize: 18 }}
            >
              Next Bus Stop
            </Paragraph>
            <Paragraph style={{ textAlign: "center", fontSize: 15 }}>
              {busStop}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
export default NextBusStop;
