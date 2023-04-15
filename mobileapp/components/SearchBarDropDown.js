import React, { useState } from "react";
import { SearchBar } from "@rneui/themed";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const SearchBarDropDown = (props) => {
  const [search, setSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);

  const updateSearch = (search) => {
    if (search.length > 0) {
      matchData(search);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setSearch(search);
  };

  const matchData = (search) => {
    const newData = props.DATA.filter((item) => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
  };

  const onSelectOption = (item) => {
    setSearch(item.name);
    props.setQueryIsLoading(true);
    if (props.setOriginStop != undefined) {
      props.setOriginStop(item.id);
    }
    if (props.setDestinationStop != undefined) {
      props.setDestinationStop(item.id);
    }
    if (props.setOriginInput != undefined) {
      props.setOriginInput(item.name);
    }

    if (props.destinationStop != null) {
      props.getBusRoutes(item.id, props.destinationStop);
      console.log(props.destinationStop);
    } else {
      props.getBusRoutes(item.id);
    }

    setIsVisible(false);
  };

  const handleOnClear = (flag) => {
    setSearch("");
    if (flag == "origin") {
      if (props.setOriginInput != undefined) {
        props.setOriginInput(null);
      }
      props.setQueryIsLoading(true);

      if (props.setOriginStop != undefined) {
        props.setOriginStop(props.closestBusStopID);
      }
      if (props.setDestinationStop != undefined) {
        props.setDestinationStop(null);
      }
      props.getBusRoutes(props.closestBusStopID);
      setIsVisible(false);
    } else if (flag == "destination") {
      if (props.setDestinationStop != undefined) {
        props.setDestinationStop(null);
      }
      props.setQueryIsLoading(true);
      props.getBusRoutes(props.originStop);
      setIsVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectOption(item)}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.view}>
      <SearchBar
        placeholder={props.placeholder}
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputStyle}
        onClear={() => handleOnClear(props.flag)}
        disabled={props.disabled}
      />
      {isVisible ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.optionList}
        />
      ) : null}
    </View>
  );
};
export default SearchBarDropDown;

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 10,
  },
  container: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#3B2E6E",
    borderRadius: 10,
    height: 45,
    borderBottomWidth: 0,
  },
  inputStyle: {
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3B2E6E",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: "#245A8D",
  },
  optionList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    maxHeight: 260,
  },
});
