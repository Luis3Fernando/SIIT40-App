import { NavigatorScreenParams } from "@react-navigation/native";

export type HomeStackParamList = {
  HomeDashboard: undefined;
  Stats: {
    metricName: string;
    metricUnit: string;
    metricKey: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Control: undefined;
  Data: undefined;
  Connectivity: undefined;
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
