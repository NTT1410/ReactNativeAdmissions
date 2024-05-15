import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
import {} from "firebase/auth";
import { getDatabase, get, ref, onValue, child } from "firebase/database";
import {} from "firebase/firestore";
import {} from "firebase/functions";
import {} from "firebase/storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import useGlobal from "../core/global";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../core/Api";
import moment from "moment";
import utils from "../core/utils";
import ConnFirebase from "../core/Firebase";

function MessageBubbleFriend({ text = "", user }) {
  //   console.log("friend");
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingLeft: 16,
      }}
    >
      {/* <Thumbnail url={user.avatar} size={42} /> */}
      <View
        style={{
          backgroundColor: "#d0d2db",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginLeft: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            color: "#202020",
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

function MessageBubbleMe({ text }) {
  //   console.log("me");
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 4,
        paddingRight: 12,
      }}
    >
      <View style={{ flex: 1 }} />
      <View
        style={{
          backgroundColor: "#303040",
          borderRadius: 21,
          maxWidth: "75%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          justifyContent: "center",
          marginRight: 8,
          minHeight: 42,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

function MessageBubble({ index, message, user }) {
  //   useEffect(() => {
  //     if (index !== 0) return;
  //   }, []);

  //   console.info(message.user + " " + user.id);
  //   console.info(Number(message.user) !== Number(user.id));

  return message.message !== undefined ? (
    Number(message.user) === Number(user.id) ? (
      <MessageBubbleMe text={message.message} />
    ) : (
      <MessageBubbleFriend text={message.message} user={user} />
    )
  ) : (
    <></>
  );
}

function MessageInput({ message, setMessage, onSend }) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Message..."
        placeholderTextColor="#909090"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 25,
          borderColor: "#d0d0d0",
          backgroundColor: "white",
          height: 50,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <FontAwesomeIcon
          icon="paper-plane"
          size={22}
          color={"#303040"}
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const user = useGlobal((state) => state.user);

  const onSend = async () => {
    setMessage("");
    const cleaned = message.replace(/\s+/g, " ").trim();
    if (cleaned.length === 0) return;
    console.log(cleaned);
    const access_token = await AsyncStorage.getItem("token-access");
    try {
      let res = await authApi(access_token).post(endpoints["send_message"], {
        receiver: user.id,
        message: cleaned,
      });
      console.info(res.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  function onType(value) {
    setMessage(value);
  }

  useEffect(() => {
    const db = ConnFirebase();
    const starCountRef = ref(db, "/messages/" + user.id);
    onValue(starCountRef, (snapshot) => {
      let array = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        array.push({
          id: childSnapshot.key,
          message: childData.message,
          user: childData.user,
          created_date: childData.created_date,
        });
      });
      //   console.log(array);
      array = array.sort((a, b) => {
        // Compare the "id" properties
        if (a.id < b.id) {
          return 1; // a comes after b
        } else if (a.id > b.id) {
          return -1; // a comes before b
        } else {
          return 0; // a and b are equal
        }
      });
      console.log(array);
      setMessages(array);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 28,
          color: MD2Colors.blue800,
        }}
      >
        Tư Vấn Tuyển Sinh OU
      </Text> */}
      <View
        style={{
          flex: 1,
          marginBottom: Platform.OS === "ios" ? 60 : 0,
        }}
      >
        <FlatList
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            paddingTop: 30,
          }}
          data={[{ id: -1 }, ...messages]}
          inverted={true}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MessageBubble index={index} message={item} user={user} />
          )}
        />
      </View>

      {Platform.OS === "ios" ? (
        <InputAccessoryView>
          <MessageInput message={message} setMessage={onType} onSend={onSend} />
        </InputAccessoryView>
      ) : (
        <MessageInput message={message} setMessage={onType} onSend={onSend} />
      )}
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
  },
  messageItem: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default ChatScreen;
