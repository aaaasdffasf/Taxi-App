import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

function Intro(): JSX.Element {
  console.log('--Intro()');

  const [isSplashFinished, setSplashFinished] = useState(false);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    // 2초 후에 스플래쉬 화면이 종료되고 동일한 화면을 유지
    const timer = setTimeout(() => {
      setSplashFinished(true);  // 스플래쉬가 종료되면 상태 업데이트
    }, 2000);

    return () => clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 로그인 화면으로 이동하는 함수
  const navigateToLogin = () => {
    navigation.navigate('Login');  // 'Login' 화면으로 네비게이트
  };

  // 회원가입 화면으로 이동하는 함수
  const navigateToSignUp = () => {
    navigation.navigate('Register');  // 'SignUp' 화면으로 네비게이트
  };

  return (
    <SafeAreaView style={styles.container}>
      <Icon name='taxi' size={100} color={'#3498db'} />
      {!isSplashFinished ? (
        <Text style={styles.text}>로딩 중...</Text>  // 스플래쉬 화면에서 표시될 텍스트
      ) : (
        <>
          <Text style={styles.text}>스플래쉬 화면 이후의 내용</Text>
          <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
            <Text style={styles.buttonText}>택시 서비스 시작하기</Text>
          </TouchableOpacity>
          
          {/* "계정이 없으신가요?" 문구와 회원가입 이동 버튼 */}
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.signUpText}>계정이 없으신가요?</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#2c3e50',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    fontSize: 14,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default Intro;
