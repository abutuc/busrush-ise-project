import React from "react";
import { ScrollView } from "react-native";
import { RouteCard } from "./RouteCard.js";

// fetch data here and parse it to RouteCard with routeNumber as prop

const RouteNumbers = () => {
  return (
    <ScrollView horizontal showHorizontalScrollIndicator={false}>
      <RouteCard routeNumber="L1" />
      <RouteCard routeNumber="L2" />
      <RouteCard routeNumber="L3" />
      <RouteCard routeNumber="L4" />
      <RouteCard routeNumber="L5" />
      <RouteCard routeNumber="L6" />
      <RouteCard routeNumber="L7" />
      <RouteCard routeNumber="L8" />
      <RouteCard routeNumber="L9" />
      <RouteCard routeNumber="L10" />
      <RouteCard routeNumber="L11" />
      <RouteCard routeNumber="L12" />
      <RouteCard routeNumber="L13" />
    </ScrollView>
  );
};

export { RouteNumbers };
