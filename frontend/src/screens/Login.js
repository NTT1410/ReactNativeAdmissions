import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Api, { authApi, endpoints } from "../core/Api";
import useGlobal from "../core/global";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [user, dispatch] = useContext(MyContext);
  const [loading, setLoading] = useState();

  const log = useGlobal((state) => state.login);

  const login = async () => {
    setLoading(true);
    try {
      let res = await Api.post(endpoints["login"], {
        client_id: "Bhksskn98YYNWOn0ImB1m1a5qxZWoup1a0mAeNPJ",
        client_secret:
          "z0KdFCFBmuthrp8jACYIlMMlBYFSibvtPhgQAxUlfakjZgcxZtNO2KjrVbRitZgJnRTS1yfY4tyPlnPMTUbcZSl1bKpm3xH7ppLIPsQUaKBvlTmo6BRRLIhtkMpYzEOm",
        username: username,
        password: password,
        grant_type: "password",
      });
      console.info(res.data);
      await AsyncStorage.setItem("token-access", res.data.access_token);
      let user = await authApi(res.data.access_token).get(
        endpoints["current_user"]
      );
      console.info(user.data);
      dispatch({
        type: "login",
        payload: {
          user: user.data,
        },
      });
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
    log(user);
    // if(username==="admin"&&password==="123"){
    //     dispatch({
    //         'type': 'login',
    //         'payload': {
    //             'username': 'admin'
    //         }
    //     })
    // }else
    //     alert("Đăng nhập không thanh công!");
  };

  return (
    <View>
      <Text>ĐĂNG NHẬP</Text>
      <TextInput
        value={username}
        onChangeText={(t) => setUsername(t)}
        placeholder="Enter username..."
      ></TextInput>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={(t) => setPassword(t)}
        placeholder="Enter password..."
      ></TextInput>
      {loading === true ? (
        <ActivityIndicator />
      ) : (
        <>
          <TouchableOpacity onPress={login}>
            <Text>Login</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Login;
