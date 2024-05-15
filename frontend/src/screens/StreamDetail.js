import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Card, MD2Colors, Title } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";
import useGlobal from "../core/global";
import { authApi, endpoints } from "../core/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const StreamDetailScreen = ({ navigation, route }) => {
  const [content, setContent] = useState();

  const user = useGlobal((state) => state.user);

  const { width } = useWindowDimensions();

  const onSend = async () => {
    if (content && content !== "") {
      const access_token = await AsyncStorage.getItem("token-access");
      console.info(content);
      console.info(route.params.id);
      console.info(access_token);
      let res = await authApi(access_token).post(
        endpoints["add_question"](route.params.id),
        {
          content: content,
        }
      );
      setContent("");
      alert(
        "Cảm ơn bạn đã gửi câu hỏi cho ban tư vấn!\n Chúc bạn có một ngày làm việc vui vẻ!"
      );
      console.info(res.status);
    } else {
      alert("Vui lòng nhập nội dung câu hỏi");
    }
  };
  return (
    <ScrollView style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Title
        style={{
          fontWeight: "bold",
          color: MD2Colors.blue900,
          textAlign: "center",
        }}
      >
        {route.params.name}
      </Title>
      <ScrollView style={{ height: 0.6 * height }}>
        <RenderHTML
          contentWidth={width}
          source={{ html: route.params.description }}
        ></RenderHTML>
      </ScrollView>
      <View>
        <Title
          style={{
            fontWeight: "bold",
            color: MD2Colors.blue800,
            textAlign: "center",
          }}
        >
          CÂU HỎI CHO BUỔI LIVESTREAM
        </Title>
        <Card style={{ marginBottom: 20 }}>
          <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Input value={content} setValue={setContent} />

                <Button title="Send" onPress={onSend} />
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Card>
      </View>
    </ScrollView>
  );
};

export default StreamDetailScreen;
