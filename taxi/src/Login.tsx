import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from './API';

function Login(): JSX.Element {
  console.log('--Login()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [disable, setDisable] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const onIdChange = (newId: string) => {
    setUserId(newId);
    if (newId) {
      setShowPasswordInput(true); // 아이디 입력 후 패스워드 입력창 보여주기
    } else {
      setShowPasswordInput(false); // 아이디가 입력되지 않으면 패스워드 입력창 숨기기
    }
  };

  const onPwChange = (newPw: string) => {
    setUserPw(newPw);
    newPw && userId ? setDisable(false) : setDisable(true);
  };

  const gotoRegister = () => {
    navigation.push('Register');
  };

  const gotoMain = () => {
    AsyncStorage.setItem('userId', userId).then(() => {
      navigation.push('Main');
    });
  };

  const onLogin = async() => {
      let fcmToken = await AsyncStorage.getItem('fcmToken') || ""
    api.login(userId, userPw, `${fcmToken}`)
      .then(response => {
        console.log("API login / data = " + JSON.stringify(response.data[0]));
        let { code, message } = response.data[0];
        console.log("API login / code = " + code + ", message = " + message);

        if (code === 0) {
          gotoMain();
        } else {
          Alert.alert("오류", message, [
            {
              text: "확인",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ]);
        }
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Icon name="taxi" size={80} color="#3498db" />
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          onChangeText={onIdChange}
          value={userId}
        />
        
        {/* 패스워드 입력창은 아이디가 입력된 후에만 나타남 */}
        {showPasswordInput && (
          <TextInput
            style={styles.input}
            placeholder="패스워드"
            secureTextEntry={true}
            onChangeText={onPwChange}
            value={userPw}
          />
        )}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={disable ? styles.buttonDisable : styles.button}
          disabled={disable}
          onPress={onLogin}
        >
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={gotoRegister}>
          <Text style={styles.signUpText}>
            계정이 없으신가요? 
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisable: {
    width: '70%',
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 10,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 14,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default Login;
