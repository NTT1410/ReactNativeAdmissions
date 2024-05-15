import { useContext, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
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
import { MD2Colors } from "react-native-paper";

function SignInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errors, setErrors] = useState("");

  const [loading, setLoading] = useState();

  const login = useGlobal((state) => state.login);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSignIn = async () => {
    setLoading(true);
    console.log("onSignIn:", username, password);

    // Check username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("Username not provided");
    }
    // Check password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("Password not provided");
    }
    // Break out of this function if there were any issues
    if (failUsername || failPassword) {
      return;
    }

    try {
      let res = await Api.post(endpoints["login"], {
        client_id: "4UMBmJPrPwYmgrfC2yeHOmO66VeWOpINtdNIZMjy",
        client_secret:
          "HCiQm9B2IHJ5ZeOS05CTpGr1UiojRMc1j8c86H5V1TkWL71gfDYkU8gtkmBrZSZBLpb81E4JWvyIguemxPEjgYchK9Ma1EbntSEDIUTBhmVSMGBzcuXNfdNvnHyyY1Xe",
        username: username,
        password: password,
        grant_type: "password",
      });
      let user = await authApi(res.data.access_token).get(
        endpoints["current_user"]
      );
      console.info(res.data.access_token);

      login(user.data, res.data.access_token);
    } catch (error) {
      if (error.response.status === 400)
        setErrors("Invalid username or password");
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
      console.log(error.config);
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

            {errors !== "" ? (
              <Text
                style={{
                  textAlign: "center",
                  color: MD2Colors.red600,
                }}
              >
                {errors}
              </Text>
            ) : (
              ""
            )}

            <Input
              title="Username"
              value={username}
              error={usernameError}
              setValue={setUsername}
              setError={setUsernameError}
            />

            <Input
              title="Password"
              value={password}
              error={passwordError}
              setValue={setPassword}
              setError={setPasswordError}
              secureTextEntry={true}
            />

            <Button title="Sign In" onPress={onSignIn} />

            <Text style={{ textAlign: "center", marginTop: 40 }}>
              Don't have an account?{" "}
              <Text
                style={{ color: "blue" }}
                onPress={() => navigation.navigate("SignUp")}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

export default SignInScreen;
