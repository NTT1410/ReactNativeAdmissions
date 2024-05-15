import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import Api, { endpoints } from "../core/Api";
import { Card, MD2Colors } from "react-native-paper";
import utils from "../core/utils";

const DepartmentCard = ({ navigation, item }) => {
  const goToDepartmentDetail = (d) => {
    navigation.navigate("DepartmentDetail", d);
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
        borderBottomWidth: 1,
        paddingBottom: 20,
      }}
    >
      <Card
        style={{ backgroundColor: MD2Colors.grey100, flex: 1 }}
        onPress={() => {
          goToDepartmentDetail(item);
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
        <Card.Cover source={utils.thumbnail(item.image)} />
      </Card>
    </View>
  );
};

const DepartmentScreen = ({ navigation, route }) => {
  const [departments, setDepartments] = useState();
  useEffect(() => {
    const loadDepartment = async () => {
      try {
        let res = await Api.get(endpoints["departments"]);
        setDepartments(res.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    loadDepartment();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <FlatList
        initialNumToRender={10}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{
          paddingTop: 30,
        }}
        data={departments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DepartmentCard navigation={navigation} item={item} />
        )}
      />
    </View>
  );
};

export default DepartmentScreen;
