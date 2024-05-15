import { useLayoutEffect } from "react";
import { SafeAreaView, Text, View, useWindowDimensions } from "react-native";
import { Card, IconButton, MD2Colors, Title } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import { ScrollView } from "react-native-virtualized-view";

const DepartmentDetailHeader = ({ item }) => {
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
        Khoa {item}
      </Text>
    </View>
  );
};

const DepartmentDetailScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();

  const goToScore = () => {
    navigation.navigate("Score");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: MD2Colors.lightBlue400,
      },
      headerTitle: () => (
        <DepartmentDetailHeader
          item={route.params.name}
        ></DepartmentDetailHeader>
      ),
    });
  }, []);
  console.log(route.params.name);
  return (
    <ScrollView style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
      <Title
        style={{ padding: 20, color: MD2Colors.blue900, fontWeight: "bold" }}
      >
        Giới thiệu Khoa {route.params.name}
      </Title>
      <RenderHTML
        contentWidth={width}
        source={{ html: route.params.description }}
      ></RenderHTML>
      <Card
        style={{
          backgroundColor: MD2Colors.blue300,
          marginBottom: 20,
        }}
        onPress={goToScore}
      >
        <Card.Title
          titleStyle={{ color: MD2Colors.white }}
          right={(props) => (
            <IconButton
              {...props}
              icon="menu-right"
              iconColor={MD2Colors.white}
            />
          )}
          title="Điểm trúng tuyển các năm"
          titleVariant="titleMedium"
        />
      </Card>
    </ScrollView>
  );
};

export default DepartmentDetailScreen;
