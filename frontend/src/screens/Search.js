import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Empty from "../common/Empty";
import Thumbnail from "../common/Thumbnail";
import Cell from "../common/Cell";
import useGlobal from "./../core/global";
import Api, { authApi, endpoints } from "../core/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const user = useGlobal((state) => state.user);
// useEffect(() => {
//   const loadLesson = async () => {
//     const access_token = await AsyncStorage.getItem("token-access");
//     let res = await authApi(access_token).get(
//       endpoints["search_user"]("nguye")
//     );
//     console.info(res.data.length);
//   };
//   loadLesson();
// }, []);

const SearchButton = (user) => {
  const acceptRequest = async (receiver) => {
    const access_token = await AsyncStorage.getItem("token-access");
    try {
      let res = await authApi(access_token).put(
        endpoints["accept_friend_request"],
        {
          receiver_id: receiver.id,
        }
      );
      requestAccept(res.data);
    } catch (error) {
      console.error(error.response);
    }
  };
  const sendRequest = async (receiver) => {
    const access_token = await AsyncStorage.getItem("token-access");
    try {
      let res = await authApi(access_token).post(
        endpoints["send_friend_request"],
        {
          receiver_id: receiver.id,
        }
      );
      requestConnect(res.data);
      console.info(res.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  // Add tick if user is already  connected
  if (user.user.status === "connected") {
    return (
      <FontAwesomeIcon
        icon="circle-check"
        size={30}
        color="#20d080"
        style={{
          marginRight: 10,
        }}
      />
    );
  }

  const requestConnect = useGlobal((state) => state.requestConnect);
  const requestAccept = useGlobal((state) => state.requestAccept);

  const data = {};

  switch (user.user.status) {
    case "no-connection":
      data.text = "Connect";
      data.disabled = false;
      data.onPress = () => {
        console.info(data.text);
        sendRequest(user.user);
      };
      break;
    case "pending-them":
      data.text = "Pending";
      data.disabled = true;
      data.onPress = () => {};
      break;
    case "pending-me":
      data.text = "Accept";
      data.disabled = false;
      data.onPress = () => {
        acceptRequest(user.user);
      };
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: data.disabled ? "#505055" : "#202020",
        paddingHorizontal: 14,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
      }}
      disabled={data.disabled}
      onPress={data.onPress}
    >
      <Text
        style={{
          color: data.disabled ? "#808080" : "white",
          fontWeight: "bold",
        }}
      >
        {data.text}
      </Text>
    </TouchableOpacity>
  );
};

function SearchRow({ user }) {
  return (
    <Cell>
      <Thumbnail url={user.thumbnail} size={76} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "#202020",
            marginBottom: 4,
          }}
        >
          {user.last_name + " " + user.first_name}
        </Text>
        <Text
          style={{
            color: "#606060",
          }}
        >
          {user.username}
        </Text>
      </View>
      <SearchButton user={user} />
    </Cell>
  );
}

function SearchScreen() {
  const [kw, setKw] = useState("");

  const searchList = useGlobal((state) => state.searchList);
  const searchUsers = useGlobal((state) => state.searchUsers);

  useEffect(() => {
    const loadUser = async () => {
      const access_token = await AsyncStorage.getItem("token-access");
      let res = await authApi(access_token).get(endpoints["search_user"](kw));
      searchUsers(res.data);
    };
    loadUser();
  }, [kw]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: "#f0f0f0",
        }}
      >
        <View>
          <TextInput
            style={{
              backgroundColor: "#e1e2e4",
              height: 52,
              borderRadius: 26,
              padding: 16,
              fontSize: 16,
              paddingLeft: 50,
            }}
            value={kw}
            onChangeText={setKw}
            placeholder="Search..."
            placeholderTextColor="#b0b0b0"
          />
          <FontAwesomeIcon
            icon="magnifying-glass"
            size={20}
            color="#505050"
            style={{
              position: "absolute",
              left: 18,
              top: 17,
            }}
          />
        </View>
      </View>

      {searchList === null ? (
        <Empty
          icon="magnifying-glass"
          message="Search for friends"
          centered={false}
        />
      ) : searchList.length === 0 ? (
        <Empty
          icon="triangle-exclamation"
          message={'No users found for "' + kw + '"'}
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          renderItem={({ item }) => <SearchRow user={item} />}
          keyExtractor={(item) => item.username}
        />
      )}
    </SafeAreaView>
  );
}

export default SearchScreen;
