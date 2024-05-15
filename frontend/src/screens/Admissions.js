import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Api, { authApi, endpoints } from "../core/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import global from "../styles/global";
import {
  Avatar,
  Button,
  Card,
  Text,
  ActivityIndicator,
  MD2Colors,
  IconButton,
} from "react-native-paper";

const AdmissionsDetail = ({ navigation, cate }) => {
  const [list, setList] = useState(null);

  useEffect(() => {
    const load = async () => {
      url = endpoints["get_each_cate"];
      const access_token = await AsyncStorage.getItem("token-access");
      try {
        let res = await authApi(access_token).get(
          endpoints["get_each_cate"](cate.id)
        );
        setList(res.data);
      } catch (error) {
        console.error(error.response.status);
      }
    };
    load();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {list === null ? (
        // <Text style={{ textAlign: "center" }}>No News</Text>
        <ActivityIndicator color={"green"} />
      ) : (
        <View>
          {list.map((l) => (
            <View key={l.id} style={{ padding: 5 }}>
              <TouchableOpacity>
                <View style={global.row}>
                  <Image
                    source={{
                      uri: "https://tuyensinh.ou.edu.vn/theme/ts2020/assets/images/icon-new.gif",
                    }}
                    style={{
                      flex: 1,
                      width: 40,
                      height: 20,
                    }}
                  />
                  <Text
                    style={{
                      paddingRight: 5,
                      paddingLeft: 5,
                      flex: 7,
                      color: MD2Colors.black,
                    }}
                  >
                    {l.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const AdmissionsScreen = ({ navigation }) => {
  const [cate, setCate] = useState(null);
  useEffect(() => {
    const load = async () => {
      const access_token = await AsyncStorage.getItem("token-access");
      try {
        let res = await authApi(access_token).get(endpoints["categories"]);
        setCate(res.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    load();
  }, []);

  const goToAdmissionsList = (cate) => {
    navigation.navigate("AdmissionsList", cate);
  };
  return (
    <View
      style={{
        backgroundColor: MD2Colors.lightBlue400,
      }}
    >
      {cate === null ? (
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
          {cate.map((c) => (
            <View
              key={c.id}
              style={{ marginTop: 20, borderBottomWidth: 1, paddingBottom: 20 }}
            >
              <Card style={{ backgroundColor: MD2Colors.grey100 }}>
                <Card.Title
                  title={c.name.toUpperCase()}
                  titleVariant="titleMedium"
                  titleStyle={{
                    color: "blue",
                    fontWeight: "bold",
                  }}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="menu-right"
                      onPress={() => goToAdmissionsList(c)}
                      iconColor={MD2Colors.blue800}
                    />
                  )}
                />
                <Card.Content>
                  <View style={[global.row, { flex: 1 }]}>
                    <AdmissionsDetail navigation={navigation} cate={c} />
                  </View>
                </Card.Content>
              </Card>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default AdmissionsScreen;
