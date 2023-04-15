import { View } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const TimeInfo = ({ time, delay }) => {
  return (
    <View style={{ margin: 15 }}>
      <Card>
        <Card.Content style={{ flexDirection: "row" }}>
          <View style={{ justifyContent: "center" }}>
            <Ionicons name="time-outline" color={"#3B2E6E"} size={40} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: 300,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Paragraph
                style={{ textAlign: "center", fontWeight: "700", fontSize: 18 }}
              >
                Expected Arrival
              </Paragraph>
              <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
                {time}
              </Paragraph>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Paragraph
                style={{ textAlign: "center", fontWeight: "700", fontSize: 18 }}
              >
                Delay (min)
              </Paragraph>
              <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
                {(delay / 60).toFixed(0)}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
export default TimeInfo;
