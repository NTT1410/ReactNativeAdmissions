import { useEffect, useLayoutEffect, useState } from "react";
import Api, { endpoints } from "../core/Api";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Card, MD2Colors, Title } from "react-native-paper";
import utils from "../core/utils";
import useGlobal from "../core/global";

const { height } = Dimensions.get("window");

const StreamCard = ({ navigation, item }) => {
  const goToStreamDetail = (s) => {
    navigation.navigate("StreamDetail", s);
  };

  return (
    <View style={{ marginTop: 20, borderBottomWidth: 1, paddingBottom: 20 }}>
      <Card
        style={{ backgroundColor: MD2Colors.grey100 }}
        onPress={() => {
          goToStreamDetail(item);
        }}
      >
        <Card.Content>
          <Text
            style={{ fontWeight: "bold", color: "blue" }}
            variant="bodyMedium"
          >
            {item.name}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const StreamScreen = ({ navigation, route }) => {
  const streamsList = useGlobal((state) => state.streamsList);
  const streamsNext = useGlobal((state) => state.streamsNext);

  const streamList = useGlobal((state) => state.streamList);

  const loadStream = async (next) => {
    try {
      let res;
      if (next === 0) {
        res = await Api.get(endpoints["streams"]);
        streamList(res.data);
      } else if (next !== null) {
        res = await Api.get(next);
        streamList(res.data);
      }
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    loadStream(0);
  }, []);

  return (
    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
      <FlatList
        initialNumToRender={10}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{
          paddingTop: 30,
        }}
        data={streamsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StreamCard navigation={navigation} item={item} />
        )}
        onEndReached={() => {
          loadStream(streamsNext);
        }}
      />
    </View>
  );
};

export default StreamScreen;
