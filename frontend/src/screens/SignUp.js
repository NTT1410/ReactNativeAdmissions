import { useContext, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Title from "../common/Title";
import Input from "../common/Input";
import Button from "../common/Button";
import MyContext from "./../core/MyContext";
import Api, { authApi, endpoints } from "../core/Api";
import useGlobal from "../core/global";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    password2: "",
    avatar: "",
    email: "",
  });

  const [loading, setLoading] = useState();

  const change = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const picker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
    } else {
      const res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        change("avatar", res.assets[0]);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSignUp = async () => {
    setLoading(true);
    // Check username
    const failUsername = !user.username || user.username.length < 5;
    if (failUsername) {
      setUsernameError("Username must be >= 5 characters");
    }
    // Check firstName
    const failFirstName = !user.first_name;
    if (failFirstName) {
      setFirstNameError("First Name was not provided");
    }
    // Check last Name
    const failLastName = !user.last_name;
    if (failLastName) {
      setLastNameError("Last Name was not provided");
    }
    // Check password1
    const failPassword1 = !user.password || user.password < 8;
    if (failPassword1) {
      setPassword1Error("Password is too short");
    }
    // Check password2
    const failPassword2 = user.password !== user.password2;
    if (failPassword2) {
      setPassword2Error("Passwords don't match");
    }
    // Check email
    const failEmail = !user.email;
    if (failEmail) {
      setEmailError("Email was not provided");
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      setEmailError("Email is invalid.");
    }
    // Check avatar
    const failAvatar = !user.avatar;
    if (failAvatar) {
      setAvatarError("Avatar was not provided");
    }
    // Break out of this function if there were any issues
    if (
      failUsername ||
      failFirstName ||
      failLastName ||
      failPassword1 ||
      failPassword2 ||
      failEmail
    ) {
      setLoading(false);
      return;
    }

    try {
      let form = new FormData();
      for (key in user) {
        if (key === "avatar") {
          const a = {
            uri: user[key].uri,
            name: user[key].fileName,
            type: user[key].mimeType,
          };
          form.append(key, a);
        } else form.append(key, user[key]);
      }

      console.log("onSignUp:", form._parts);
      const res = await Api.post(endpoints["users"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.info(res.data);

      navigation.navigate("SignIn");
    } catch (error) {
      console.error(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <Title text="Admissions OU" color="#202020" />

            <View>
              <Text
                style={{
                  color: firstNameError ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {firstNameError ? firstNameError : "First Name"}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => {
                  change("first_name", text);
                  if (firstNameError) {
                    setFirstNameError("");
                  }
                }}
                secureTextEntry={false}
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: firstNameError ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                value={user.first_name}
              />
            </View>

            <View>
              <Text
                style={{
                  color: firstNameError ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {lastNameError ? lastNameError : "First Name"}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => {
                  change("last_name", text);
                  if (lastNameError) {
                    setLastNameError("");
                  }
                }}
                secureTextEntry={false}
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: lastNameError ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                value={user.last_name}
              />
            </View>

            <View>
              <Text
                style={{
                  color: usernameError ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {usernameError ? usernameError : "Username"}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => {
                  change("username", text);
                  if (usernameError) {
                    setUsernameError("");
                  }
                }}
                secureTextEntry={false}
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: usernameError ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                value={user.username}
              />
            </View>

            <View>
              <Text
                style={{
                  color: password1Error ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {password1Error ? password1Error : "Password"}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => {
                  change("password", text);
                  if (password1Error) {
                    setPassword1Error("");
                  }
                }}
                secureTextEntry={true}
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: password1Error ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                value={user.password}
              />
            </View>

            <View>
              <Text
                style={{
                  color: password2Error ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {password2Error ? password2Error : "Confirm Password"}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => {
                  change("password2", text);
                  if (password2Error) {
                    setPassword2Error("");
                  }
                }}
                secureTextEntry={true}
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: password2Error ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                value={user.password2}
              />
            </View>

            <View>
              <Text
                style={{
                  color: emailError ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {emailError ? emailError : "Email"}
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="off"
                onChangeText={(text) => {
                  change("email", text);
                  if (emailError) {
                    setEmailError("");
                  }
                }}
                secureTextEntry={false}
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: emailError ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                }}
                value={user.email}
              />
            </View>

            <TouchableOpacity onPress={picker}>
              <Text
                style={{
                  color: avatarError ? "#ff5555" : "#70747a",
                  marginVertical: 6,
                  paddingLeft: 16,
                }}
              >
                {avatarError ? avatarError : "Avatar"}
              </Text>
              <Text
                style={{
                  backgroundColor: "#e1e2e4",
                  borderWidth: 1,
                  borderColor: emailError ? "#ff5555" : "transparent",
                  borderRadius: 26,
                  height: 52,
                  paddingHorizontal: 16,
                  fontSize: 16,
                  width: width,
                }}
              >
                Choose avatar....
              </Text>
            </TouchableOpacity>

            {user.avatar !== "" ? (
              <Image
                source={{ uri: user.avatar.uri }}
                style={{ width: 100, height: 100, margin: 10 }}
              ></Image>
            ) : (
              ""
            )}

            <Button title="Sign Up" onPress={onSignUp} />

            <Text style={{ textAlign: "center", marginTop: 40 }}>
              You have an account?{" "}
              <Text
                style={{ color: "blue" }}
                onPress={() => navigation.navigate("SignIn")}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

export default SignUpScreen;
