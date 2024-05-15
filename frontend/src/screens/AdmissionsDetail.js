import { useEffect, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Button, Card, MD2Colors, TextInput, Title } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
import Api, { authApi, endpoints } from "../core/Api";
import useGlobal from "../core/global";
import moment from "moment";
import utils from "../core/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const AdmissionsDetailHeader = ({ item }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: MD2Colors.white,
          marginLeft: 10,
          fontSize: 18,
          fontWeight: "bold",
        }}
      ></Text>
    </View>
  );
};

const AdmissionsContact = () => {
  return (
    <View>
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Card style={{ backgroundColor: MD2Colors.grey100 }}>
          <Card.Title
            title="MỌI THẮC MẮC, VUI LÒNG LIÊN HỆ"
            titleVariant="titleMedium"
            titleStyle={{
              color: "blue",
              fontWeight: "bold",
            }}
          />
          <Card.Content>
            <Text variant="bodyMedium">
              Hotline:{" "}
              <Text style={{ color: MD2Colors.blue800 }} variant="bodyMedium">
                1800 5858 84
              </Text>
            </Text>
            <Text variant="bodyMedium">
              Email:{" "}
              <Text style={{ color: MD2Colors.blue800 }} variant="bodyMedium">
                tuyensinh@ou.edu.vn
              </Text>
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
};

const CommentBubble = ({ item }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
      }}
    >
      <Image
        source={utils.thumbnail(item.user.avatar)}
        style={{ width: 30, height: 30, marginRight: 10 }}
      ></Image>
      <View>
        <Card
          mode="contained"
          style={{
            backgroundColor: MD2Colors.grey100,
            width: 0.4 * height,
          }}
        >
          <Card.Title
            title={item.user.last_name + " " + item.user.first_name}
            titleVariant="titleSmall"
            style={{ marginBottom: -20 }}
          />
          <Card.Content>
            <Text>{item.content}</Text>
          </Card.Content>
        </Card>
        <Text>{moment(item.created_date).fromNow()}</Text>
      </View>
    </View>
  );
};

function AdmissionsDetail({ navigation, route }) {
  const [comments, setComment] = useState(null);
  const [content, setContent] = useState("");
  const [next, setNext] = useState(null);
  const admissionsId = route.params.id;

  const user = useGlobal((state) => state.user);
  const commentsList = useGlobal((state) => state.commentsList);
  const commentsNext = useGlobal((state) => state.commentsNext);

  const commentList = useGlobal((state) => state.commentList);
  const commentSend = useGlobal((state) => state.commentSend);

  const loadComment = async (next) => {
    console.log(next);
    try {
      if (next === 0) {
        let res = await Api.get(endpoints["comments"](admissionsId));
        setComment(res.data.results);
        setNext(res.data.next);
        commentList(res.data);
      } else if (next !== null) {
        let res = await Api.get(next);
        setComment((current) => [res.data.results, ...current]);
        setNext(res.data.next);
        commentList(res.data);
      }

      console.log(commentsList.length);
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    loadComment(0);
  }, []);
  const { width } = useWindowDimensions();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: MD2Colors.lightBlue400,
      },
      headerTitle: () => (
        <AdmissionsDetailHeader
          item={route.params.name}
        ></AdmissionsDetailHeader>
      ),
    });
  }, []);

  const comment = async () => {
    if (content !== undefined && content !== "") {
      const access_token = await AsyncStorage.getItem("token-access");
      const res = await authApi(access_token).post(
        endpoints["add_comments"](admissionsId),
        {
          content: content,
        }
      );
      console.info(res.data);
      setComment((current) => [res.data, ...current]);
      commentSend(res.data);
      setContent("");
    } else {
      alert("Vui lòng nhập nội dung bình luận");
    }
  };
  return (
    <>
      <ScrollView style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
        <Title
          style={{ padding: 20, color: MD2Colors.blue900, fontWeight: "bold" }}
        >
          {route.params.name}
        </Title>
        <RenderHTML
          contentWidth={width}
          source={{ html: route.params.content }}
        ></RenderHTML>
        <AdmissionsContact />
        {user !== null ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={utils.thumbnail(user.avatar)}
              style={{ width: 30, height: 30 }}
            ></Image>
            <TextInput
              mode="outlined"
              value={content}
              onChangeText={(t) => setContent(t)}
              placeholder="Nội dung bình luận...."
              style={{ width: 0.3 * height }}
            ></TextInput>
            <Button
              style={{
                marginLeft: 10,
                justifyContent: "center",
                backgroundColor: MD2Colors.blue800,
              }}
              icon="send"
              mode="contained"
              onPress={comment}
            ></Button>
          </View>
        ) : (
          ""
        )}
        {/* {comments === null ? (
        ""
      ) : (
        <>
          {comments.map((c) => (
            <View
              key={c.id}
              style={{
                flexDirection: "row",
                padding: 10,
              }}
            >
              <Image
                source={utils.thumbnail(c.user.avatar)}
                style={{ width: 30, height: 30, marginRight: 10 }}
              ></Image>
              <View>
                <Card
                  mode="contained"
                  style={{
                    backgroundColor: MD2Colors.grey100,
                    width: 0.4 * height,
                  }}
                >
                  <Card.Title
                    title={c.user.last_name + " " + c.user.first_name}
                    titleVariant="titleSmall"
                    style={{ marginBottom: -20 }}
                  />
                  <Card.Content>
                    <Text>{c.content}</Text>
                  </Card.Content>
                </Card>
                <Text>{moment(c.created_date).fromNow()}</Text>
              </View>
            </View>
          ))}
        </>
      )} */}
        <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
          <FlatList
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
              paddingTop: 30,
            }}
            data={commentsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CommentBubble item={item} />}
            onEndReached={() => {
              loadComment(next);
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}

export default AdmissionsDetail;
