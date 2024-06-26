import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import useGlobal from "../core/global";
import utils from "../core/utils";
import Thumbnail from "../common/Thumbnail";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api, { authApi, endpoints } from "../core/Api";
import { append } from "domutils";
// import * as mime from "react-native-mime-types";
import mime from "mime";

function ProfileLogout() {
  const logout = useGlobal((state) => state.logout);

  return (
    <TouchableOpacity
      onPress={logout}
      style={{
        flexDirection: "row",
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 26,
        backgroundColor: "#202020",
        marginTop: 40,
      }}
    >
      <FontAwesomeIcon
        icon="right-from-bracket"
        size={20}
        color="#d0d0d0"
        style={{ marginRight: 12 }}
      />
      <Text
        style={{
          fontWeight: "bold",
          color: "#d0d0d0",
        }}
      >
        Logout
      </Text>
    </TouchableOpacity>
  );
}

function ProfileScreen() {
  const [users, setUsers] = useState({
    avatar: "",
  });

  const updateUser = useGlobal((state) => state.updateUser);
  function ProfileImage() {
    const uploadThumbnail = useGlobal((state) => state.uploadThumbnail);
    const user = useGlobal((state) => state.user);

    const [avatar, setAvatar] = useState("");

    const login = useGlobal((state) => state.login);

    const change = (field, value) => {
      setUsers((current) => {
        return { ...current, [field]: value };
      });
    };

    const picker = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied!");
      } else {
        const res = await ImagePicker.launchImageLibraryAsync();
        if (!res.canceled) {
          change("avatar", res.assets[0]);
        }
      }
    };

    return (
      <TouchableOpacity
        style={{ marginBottom: 20 }}
        onPress={() => {
          picker();
        }}
      >
        <Thumbnail url={user.avatar} size={180} />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#202020",
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: "white",
          }}
        >
          <FontAwesomeIcon icon="pencil" size={15} color="#d0d0d0" />
        </View>
      </TouchableOpacity>
    );
  }
  const changeProfileImage = async () => {
    try {
      let form = new FormData();
      for (key in user) {
        if (key === "avatar") {
          let a = {
            uri: users[key].uri,
            name: users[key].fileName,
            type: users[key].mimeType,
          };
          console.log(a);
          form.append(key, a);
        } else form.append(key, users[key]);
      }
      const access_token = await AsyncStorage.getItem("token-access");
      const url = `${endpoints["users"]}avatar/`;
      const res = await authApi(access_token).patch(url, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.info(res.data);
      updateUser(res.data);
      setUsers({ avatar: "" });
    } catch (error) {
      console.error(error);
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    }
  };
  const user = useGlobal((state) => state.user);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <ProfileImage />
      <Text
        style={{
          textAlign: "center",
          color: "#303030",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 6,
        }}
      >
        {user.name}
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#606060",
          fontSize: 14,
        }}
      >
        @{user.username}
      </Text>
      {users.avatar !== "" ? (
        <TouchableOpacity
          onPress={changeProfileImage}
          style={{
            flexDirection: "row",
            height: 52,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 26,
            backgroundColor: "#202020",
            marginTop: 40,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#d0d0d0",
            }}
          >
            Update Avatar
          </Text>
        </TouchableOpacity>
      ) : (
        <ProfileLogout />
      )}
    </View>
  );
}

const Styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    backgroundColor: "#202020",
    marginTop: 40,
  },
});

export default ProfileScreen;
