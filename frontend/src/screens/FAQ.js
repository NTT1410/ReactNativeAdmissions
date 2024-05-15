import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Input from "../common/Input";
import Button from "../common/Button";
import MyContext from "../core/MyContext";
import Api, { authApi, endpoints } from "../core/Api";
import useGlobal from "../core/global";
import {
  ActivityIndicator,
  Card,
  IconButton,
  MD2Colors,
  Title,
} from "react-native-paper";

import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
import {} from "firebase/auth";
import { getDatabase, get, ref, onValue, child } from "firebase/database";
import {} from "firebase/firestore";
import {} from "firebase/functions";
import {} from "firebase/storage";

const ErrorCard = ({ err }) => {
  return <Text style={{ color: "red", textAlign: "center" }}>{err}</Text>;
};

function FAQScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [loading, setLoading] = useState();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Trigger form validation when name,
    // email, or password changes
    validateForm();

    const firebaseConfig = {
      apiKey: "AIzaSyD5dM-iOCY2NXVOjKmSJxI16Ldrgy5_GHU",
      authDomain: "admission-663b7.firebaseapp.com",
      databaseURL: "https://admission-663b7-default-rtdb.firebaseio.com",
      projectId: "admission-663b7",
      storageBucket: "admission-663b7.appspot.com",
      messagingSenderId: "257069571322",
      appId: "1:257069571322:web:4e75ef8ba07fecaa3a3d43",
      measurementId: "G-1EXKW1CDH1",
    };

    // Initialize Firebase
    initializeApp(firebaseConfig);
    const u = "4";
    const db = getDatabase();
    const starCountRef = ref(db, "/messages/" + u);
    onValue(starCountRef, (snapshot) => {
      let array = [];
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        array.push({
          id: childSnapshot.key,
          message: childData.message,
        });
      });
      console.log(array);
      setMessages(array);
    });
  }, [name, email, phone, question]);

  const validateForm = () => {
    let errors = {};

    // Validate name field
    if (!name) {
      errors.name = "Name is required.";
    }

    // Validate email field
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    // Validate phone field
    if (!phone) {
      errors.phone = "Phone is required.";
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)
    ) {
      errors.phone = "Phone is invalid.";
    }

    // Validate question field
    if (!question) {
      errors.question = "Question is required.";
    }
    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (isFormValid) {
      try {
        let res = await Api.post(endpoints["create_faq"], {
          name: name,
          email: email,
          phone: phone,
          question: question,
        });
        console.log(res.data);
        setName("");
        setEmail("");
        setPhone("");
        setQuestion("");
        alert(
          "Cảm ơn bạn đã gửi câu hỏi cho ban tư vấn!\n Chúng tôi sẽ gửi câu trả lời cho bạn sớm nhất!"
        );
      } catch (error) {
        console.error(error.response);
      } finally {
        setLoading(false);
      }
    } else {
      // Form is invalid, display error messages
      console.log("Form has errors. Please correct them.");
      setLoading(false);
    }
  };

  const goToChat = () => {
    navigation.navigate("Chat");
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
            }}
          >
            <Title
              style={{
                fontWeight: "bold",
                color: MD2Colors.blue800,
                textAlign: "center",
              }}
            >
              CÂU HỎI TUYỂN SINH
            </Title>
            <Input title="Họ và Tên" value={name} setValue={setName} />
            {errors.name ? <ErrorCard err={errors.name} /> : <></>}
            <Input title="Email" value={email} setValue={setEmail} />
            {errors.email ? <ErrorCard err={errors.email} /> : <></>}
            <Input title="phone" value={phone} setValue={setPhone} />
            {errors.phone ? <ErrorCard err={errors.phone} /> : <></>}
            <Input
              title="Nội dung câu hỏi"
              value={question}
              setValue={setQuestion}
            />
            {errors.question ? <ErrorCard err={errors.question} /> : <></>}

            {loading === true ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button title="Send" onPress={handleSubmit} />
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Card
        style={{
          backgroundColor: MD2Colors.blue300,
          marginBottom: 20,
          marginTop: 20,
          width: 200,
          alignSelf: "center",
        }}
        onPress={goToChat}
      >
        <Card.Title
          titleStyle={{ color: MD2Colors.white }}
          right={(props) => (
            <IconButton {...props} icon="message" iconColor={MD2Colors.white} />
          )}
          title="Chat With OU"
          titleVariant="titleMedium"
        />
      </Card>
    </ScrollView>
  );
}

export default FAQScreen;
