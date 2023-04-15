import { View } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
const BusInfo = ({ bus }) => {
  return (
    <View style={{ margin: 15 }}>
      <Card>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "center" }}>
              <Ionicons name="bus-outline" color="#3B2E6E" size={80} />
            </View>
            <View
              style={{ flexDirection: "column", paddingLeft: 30, width: 200 }}
            >
              <View style={{ flexDirection: "column" }}>
                <Paragraph style={{ textAlign: "center", fontWeight: "700" }}>
                  Model
                </Paragraph>
                <Paragraph style={{ textAlign: "center" }}>
                  {bus.model}
                </Paragraph>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Paragraph style={{ textAlign: "center", fontWeight: "700" }}>
                    Brand
                  </Paragraph>
                  <Paragraph style={{ textAlign: "center" }}>
                    {bus.brand}
                  </Paragraph>
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Paragraph style={{ textAlign: "center", fontWeight: "700" }}>
                    Registration
                  </Paragraph>
                  <Paragraph style={{ textAlign: "center" }}>
                    {bus.registration}
                  </Paragraph>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};
export default BusInfo;
