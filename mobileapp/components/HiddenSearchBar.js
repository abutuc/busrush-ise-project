import { View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SearchBarDropDown from "./SearchBarDropDown";

const HiddenSearchBar = (props) => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    if (props.originInput == null) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [props.originInput]);

  const toggleVisibility = () => {
    // Set the component's visibility to the opposite of its current value
    setSearchBarVisible(!searchBarVisible);
    props.setDestinationStop(null);
    props.getBusRoutes(props.originStop);
  };

  return (
    <View>
      {searchBarVisible ? (
        <SearchBarDropDown
          placeholder="Search Destination Bus Stop"
          DATA={props.DATA}
          getBusRoutes={props.getBusRoutes}
          closestBusStopID={props.closestBusStopID}
          setQueryIsLoading={props.setQueryIsLoading}
          setDestinationStop={props.setDestinationStop}
          originStop={props.originStop}
          destinationStop={props.destinationStop}
          disabled={disable}
          flag="destination"
        />
      ) : null}
      <TouchableOpacity onPress={toggleVisibility}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {searchBarVisible ? (
            <Ionicons name="chevron-up-outline" color="#3B2E6E" size={25} />
          ) : (
            <Ionicons name="chevron-down-outline" color="#3B2E6E" size={25} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default HiddenSearchBar;
