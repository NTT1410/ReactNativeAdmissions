import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import useGlobal from "../core/global";
import utils from "../core/utils";
import Thumbnail from "../common/Thumbnail";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api, { authApi, endpoints } from "../core/Api";
import { append } from "domutils";

function ProfileImage() {
  const uploadThumbnail = useGlobal((state) => state.uploadThumbnail);
  const user = useGlobal((state) => state.user);
  const updateUser = useGlobal((state) => state.updateUser);

  const [avatar, setAvatar] = useState("");

  const login = useGlobal((state) => state.login);

  const [users, setUsers] = useState({
    avatar: "",
  });

  const change = (field, value) => {
    setUsers((current) => {
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
  const changeProfileImage = async () => {
    await picker();
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
      console.info(a);
      const url = `${endpoints["users"]}avatar/`;
      const res = await Api.patch(endpoints["users"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // updateUser(res.data);
      console.info("res.data");
    } catch (error) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    }
  };

  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={changeProfileImage}>
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

      <ProfileLogout />
    </View>
  );
}

export default ProfileScreen;
