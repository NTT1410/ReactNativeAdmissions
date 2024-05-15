import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import global from "../styles/global";
import { useEffect, useState } from "react";
import Api, { endpoints } from "../core/Api";
import { MD2Colors } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "../core/utils";

const { height } = Dimensions.get("window");

const OuScreen = () => {
  const [school, setSchool] = useState(null);
  const [banners, setBanners] = useState([]);
  const [b, setB] = useState(null);
  useEffect(() => {
    const load = async () => {
      const access_token = await AsyncStorage.getItem("token-access");
      try {
        let res = await Api.get(endpoints["school"]);
        let data = await Api.get(endpoints["banners"]);
        setSchool(res.data);
        let a = [];
        data.data.map((item) => {
          a.push(utils.image(item.image));
        });
        setBanners(a);
        console.log(banners);
      } catch (error) {
        console.error(error.response);
      }
    };
    load();
  }, []);

  return (
    <View
      style={{
        backgroundColor: MD2Colors.lightBlue400,
      }}
    >
      {school === null ? (
        <ActivityIndicator color={"green"} />
      ) : (
        <ScrollView
          style={{
            paddingTop: 40,
            backgroundColor: "#fff",
            borderTopRightRadius: 40,
          }}
        >
          <View>
            <SliderBox
              style={{
                height: 200,
                width: "auto",
                borderRadius: 30,
              }}
              images={banners}
              sliderBoxHeight={200}
              onCurrentImagePressed={(index) =>
                console.log(`image ${index} pressed`)
              }
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              paginationBoxVerticalPadding={20}
              autoplay
              circleLoop
            />
          </View>
          <View style={{ padding: 20 }}>
            <Text style={global.head_1}>Tổng quan về OU</Text>
            <Image
              source={require("../assets/logoOU.png")}
              style={{
                width: 200,
                height: 150,
                resizeMode: "stretch",
                alignSelf: "center",
              }}
            />
            <View>
              <Text style={global.head_2}>GIỚI THIỆU CHUNG</Text>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily:
                    Platform.OS === "ios" ? "Avenir-Roman" : "monospace",
                }}
              >
                {school[0].description}
              </Text>
            </View>
            <View>
              <Text style={[global.head_2, { color: "darkblue" }]}>
                SỨ MẠNG
              </Text>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily:
                    Platform.OS === "ios" ? "Avenir-Roman" : "monospace",
                }}
              >
                {school[0].mission}
              </Text>
            </View>
            <View>
              <Text style={[global.head_2, { color: "darkblue" }]}>
                TẦM NHÌN
              </Text>
              <Text
                style={{
                  marginBottom: 10,
                  fontFamily:
                    Platform.OS === "ios" ? "Avenir-Roman" : "monospace",
                }}
              >
                {school[0].vision}
              </Text>
            </View>
          </View>
          <Image
            source={{
              uri: "https://github.com/NTT1410/TuVanTuyenSinh/blob/main/university-entrace/src/assets/images/Sumang-TNOU2022.png?raw=true",
            }}
            style={{
              width: "auto",
              height: 1 * height,
              backgroundColor: "#e0e0e0",
              resizeMode: "stretch",
            }}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default OuScreen;
