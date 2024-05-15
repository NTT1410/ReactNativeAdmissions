import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  InputAccessoryView,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Thumbnail from "../common/Thumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useGlobal from "../core/global";
import { authApi, endpoints } from "../core/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Card,
  IconButton,
  MD2Colors,
  Title,
} from "react-native-paper";
import global from "../styles/global";
import ReactPaginate from "react-paginate";

function AdmissionsListHeader({ cate }) {
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
      >
        {cate}
      </Text>
    </View>
  );
}

const AdmissionsCard = ({ navigation, item }) => {
  const goToAdmissionsList = (cate) => {
    navigation.navigate("AdmissionsDetail", cate);
  };

  return (
    <View style={{ marginTop: 20, borderBottomWidth: 1, paddingBottom: 20 }}>
      <Card
        style={{ backgroundColor: MD2Colors.grey100 }}
        onPress={() => {
          goToAdmissionsList(item);
        }}
      >
        <Card.Title
          title={item.name}
          titleVariant="titleMedium"
          titleStyle={{
            color: "blue",
            fontWeight: "bold",
          }}
        />
        <Card.Content>
          <Text variant="bodyMedium">{item.name}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

function AdmissionsListScreen({ navigation, route }) {
  const admissionsList = useGlobal((state) => state.admissionsList);
  const admissionsNext = useGlobal((state) => state.admissionsNext);

  const admissionList = useGlobal((state) => state.admissionList);
  // Update the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: MD2Colors.lightBlue400,
      },
      headerRight: () => (
        <FontAwesomeIcon
          style={{ marginRight: 16 }}
          icon="magnifying-glass"
          size={22}
          // color="#404040"
          color="#fff"
        />
      ),
      headerTitle: () => (
        <AdmissionsListHeader cate={route.params.name}></AdmissionsListHeader>
      ),
    });
  }, []);

  const [admissions, setAdmissions] = useState(null);
  const admissionsId = route.params.id;

  const loadAdmissions = async (next) => {
    const access_token = await AsyncStorage.getItem("token-access");
    try {
      let res;
      if (next === 0) {
        res = await authApi(access_token).get(
          endpoints["admissions"](admissionsId)
        );
        admissionList(res.data);
      } else if (next !== null) {
        res = await authApi(access_token).get(next);
        admissionList(res.data);
      }
    } catch (error) {
      console.error(error.response);
    }
  };

  useEffect(() => {
    loadAdmissions(0);
  }, []);

  const [p, setP] = useState([
    { id: "1", name: "Tru" },
    { id: "2", name: "Tru" },
    { id: "3", name: "Tru" },
    { id: "4", name: "Tru" },
    { id: "5", name: "Tru" },
    { id: "6", name: "Tru" },
  ]);

  return (
    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
      <FlatList
        initialNumToRender={10}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{
          paddingTop: 30,
        }}
        data={admissionsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdmissionsCard navigation={navigation} item={item} />
        )}
        onEndReached={() => {
          loadAdmissions(admissionsNext);
        }}
      />
    </View>
  );
}

export default AdmissionsListScreen;
