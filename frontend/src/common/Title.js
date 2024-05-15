import { Text } from "react-native";
import {
  useFonts,
  LeckerliOne_400Regular,
} from "@expo-google-fonts/leckerli-one";
import { ActivityIndicator } from "react-native-paper";

function Title({ text, color }) {
  let [fontsLoaded] = useFonts({
    LeckerliOne_400Regular,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator color="blue" />;
  }
  return (
    <Text
      style={{
        color: color,
        textAlign: "center",
        fontSize: 48,
        fontFamily: "LeckerliOne_400Regular",
        marginBottom: 30,
      }}
    >
      {text}
    </Text>
  );
}

export default Title;
