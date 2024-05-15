import React, { useEffect, useReducer, useState } from "react";
import { SafeAreaView, StatusBar, Text } from "react-native";

import "./src/core/fontawesome";

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./src/screens/Splash";
import SignInScreen from "./src/screens/SignIn";
import SignUpScreen from "./src/screens/SignUp";
import HomeScreen from "./src/screens/Home";
import SearchScreen from "./src/screens/Search";
import useGlobal from "./src/core/global";
import { PaperProvider } from "react-native-paper";
import AdmissionsListScreen from "./src/screens/AdmissionsList";
import AdmissionsDetail from "./src/screens/AdmissionsDetail";
import DepartmentDetailScreen from "./src/screens/DepartmentDetail";
import ScoreScreen from "./src/screens/Score";
import StreamDetailScreen from "./src/screens/StreamDetail";
import ChatScreen from "./src/screens/Chat";

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};

const Stack = createNativeStackNavigator();

function App() {
  const [initialized] = useState(true);
  const authenticated = useGlobal((state) => state.authenticated);
  const user = useGlobal((state) => state.user);

  return (
    <PaperProvider>
      <NavigationContainer theme={LightTheme}>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator>
          {!initialized ? (
            <>
              <Stack.Screen name="Splash" component={SplashScreen} />
            </>
          ) : !authenticated ? (
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen
                name="AdmissionsList"
                component={AdmissionsListScreen}
              />
              <Stack.Screen
                name="AdmissionsDetail"
                component={AdmissionsDetail}
              />
              <Stack.Screen
                name="DepartmentDetail"
                component={DepartmentDetailScreen}
              />
              <Stack.Screen name="Score" component={ScoreScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen
                name="StreamDetail"
                component={StreamDetailScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
