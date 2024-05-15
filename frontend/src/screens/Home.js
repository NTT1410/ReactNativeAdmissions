import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfileScreen from "./Profile";
import { useLayoutEffect } from "react";
import OuScreen from "./Ou";
import AdmissionsScreen from "./Admissions";
import { MD2Colors } from "react-native-paper";
import DepartmentScreen from "./Department";
import StreamScreen from "./Stream";
import FAQScreen from "./FAQ";

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSearch = () => {
    navigation.navigate("Search");
  };

  return (
    <Tab.Navigator
      // sceneContainerStyle={{ backgroundColor: "red" }}
      screenOptions={({ route, navigation }) => ({
        headerTitleStyle: {
          color: "#fff",
          fontFamily: Platform.OS === "ios" ? "Helvetica" : "sans-serif-medium",
        },
        headerStyle: {
          backgroundColor: MD2Colors.lightBlue400,
          borderBottomLeftRadius: 30,
          height: 100,
        },
        headerLeft: () => (
          <View style={{ marginLeft: 16, color: "red" }}>
            <Image
              source={require("../assets/profile.png")}
              style={{
                width: 30,
                height: 30,
                borderRadius: 14,
                backgroundColor: "#e0e0e0",
              }}
            />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={onSearch}>
            <FontAwesomeIcon
              style={{ marginRight: 16 }}
              icon="magnifying-glass"
              size={22}
              // color="#404040"
              color="#fff"
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            HomeOU: "home",
            Admissions: "newspaper",
            Profile: "user",
            Department: "school",
            Stream: "bell",
            FAQ: "question-circle",
            Registera: "home",
          };
          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} size={28} color={color} />;
        },
        tabBarActiveTintColor: "#202020",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="HomeOU" component={OuScreen} />
      <Tab.Screen name="Admissions" component={AdmissionsScreen} />
      <Tab.Screen name="Department" component={DepartmentScreen} />
      <Tab.Screen name="Stream" component={StreamScreen} />
      <Tab.Screen name="FAQ" component={FAQScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
