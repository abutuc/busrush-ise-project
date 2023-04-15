import { View } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { Icon } from "@rneui/themed";

const ClosestBusStop = (props) => {
  return (
    <View>
      <View style={{ margin: 15 }}>
        <Card>
          <Card.Content style={{ flexDirection: "row" }}>
            <Icon reverse name="my-location" color="#3B2E6E" size={20} />
            <View>
              <Title style={{ textAlign: "center" }}>You are closest to:</Title>
              <Paragraph
                style={{
                  textAlign: "center",
                  width: 280,
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                {props.closestBusStop}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};
export default ClosestBusStop;
