import { SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from './API';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Register(): JSX.Element {
  console.log('--Register()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userPw2, setUserPw2] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const onIdChange = (newId: string) => {
    setUserId(newId);
    if (newId) {
      setShowPasswordInput(true); // 아이디 입력 후 비밀번호 입력창을 보여줌
    } else {
      setShowPasswordInput(false); // 아이디가 지워지면 비밀번호 입력창 숨김
    }
  };

  const Register = async() => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')||''
    api.register(userId, userPw,`${fcmToken}`)
      .then(response => {
        let { code, message } = response.data[0];
        let title = '알림';
        if (code == 0) {
          navigation.pop();
        } else {
          title = '오류';
        }

        Alert.alert(title, message, [{
          text: '확인',
          onPress: () => console.log('cancel pressed'),
          style: 'cancel'
        }]);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  };

  const isDisabled = () => {
    return !(userId && userPw && userPw2 && userPw === userPw2);
  };

  const gotoLogin = () => {
    navigation.push('Login'); // 'Login' 화면으로 이동
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, { justifyContent: 'flex-end' }]}>
        <Icon name="taxi" size={80} color="#3498db" />
      </View>
      <View style={[styles.container, { flex: 2 }]}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          onChangeText={onIdChange}
          value={userId}
        />

        {/* 아이디 입력 후에 비밀번호 입력창과 확인 입력창을 보여줌 */}
        {showPasswordInput && (
          <>
            <TextInput
              style={styles.input}
              placeholder="패스워드"
              secureTextEntry={true}
              onChangeText={(newPw) => setUserPw(newPw)}
              value={userPw}
            />
            <TextInput
              style={styles.input}
              placeholder="패스워드 확인"
              secureTextEntry={true}
              onChangeText={(newPw2) => setUserPw2(newPw2)}
              value={userPw2}
            />
          </>
        )}
      </View>

      <View style={[styles.container, { justifyContent: 'flex-start' }]}>
        <TouchableOpacity
          disabled={isDisabled()} onPress={Register}
          style={isDisabled() ? styles.buttonDisable : styles.button}
        >
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>

        {/* "이미 회원이신가요?" 문구 */}
        <TouchableOpacity onPress={gotoLogin}>
          <Text style={styles.loginText}>이미 회원이신가요?</Text>
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
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default Register;
