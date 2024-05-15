import { useEffect, useLayoutEffect, useState } from "react";
import Api, { endpoints } from "../core/Api";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors, Title } from "react-native-paper";
import utils from "../core/utils";

const { height } = Dimensions.get("window");

const ScoreScreen = ({ navigation, route }) => {
  const [scores, setScores] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: MD2Colors.lightBlue400,
      },
      headerTitle: () => (
        <Title style={{ color: MD2Colors.white, fontWeight: "bold" }}>
          Score
        </Title>
      ),
    });
  }, []);

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        let res = await Api.get(endpoints["scores"]);
        setScores(res.data);
        console.info(utils.thumbnail(res.data[0].image));
      } catch (error) {
        console.error(error.response);
      }
    };
    loadDepartment();
  }, []);

  return (
    <View
      style={{
        backgroundColor: MD2Colors.lightBlue400,
      }}
    >
      {scores === null ? (
        <ActivityIndicator
          style={{ backgroundColor: "#fff" }}
          color={MD2Colors.blue800}
        />
      ) : (
        <ScrollView
          style={{
            backgroundColor: "#fff",
            borderTopRightRadius: 40,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {scores.map((c) => (
            <View
              key={c.id}
              style={{ marginTop: 20, borderBottomWidth: 1, paddingBottom: 20 }}
            >
              <Title
                style={{
                  fontWeight: "bold",
                  color: MD2Colors.red700,
                  textAlign: "center",
                }}
              >
                {c.name}
              </Title>
              <Image
                source={utils.thumbnail(c.image)}
                style={{
                  width: "auto",
                  height: 0.7 * height,
                  resizeMode: "stretch",
                }}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ScoreScreen;
