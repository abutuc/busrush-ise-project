import { View } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const Passengers = ({ passengers }) => {
  return (
    <View style={{ margin: 15 }}>
      <Card>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "center" }}>
              <Ionicons name="people-outline" color="#3B2E6E" size={50} />
            </View>
            <View
              style={{ flexDirection: "column", paddingLeft: 30, width: 200 }}
            >
              <View style={{ flexDirection: "column" }}>
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  Passengers
                </Paragraph>
                <Paragraph style={{ textAlign: "center", fontSize: 16 }}>
                  {passengers}
                </Paragraph>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
export default Passengers;
