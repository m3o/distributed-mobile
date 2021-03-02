// Frameworks
import React, { useEffect, useState } from 'react';
import { Provider, connect } from 'react-redux';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import * as SecureStore from 'expo-secure-store';

// Screens
import LoginScreen from './screens/Login/Login';
import ForgotPasswordScreen from './screens/Login/ForgotPassword';
import CodeInputScreen from './screens/Login/CodeInput';
import NewPasswordScreen from './screens/Login/NewPassword';
import SignupScreen from './screens/Login/Signup';
import SignupPasswordScreen from './screens/Login/SignupPassword';
import HomeScreen from './screens/Home';
import GroupScreen from './screens/Group';
import RoomScreen from './screens/Room';
import ChatScreen from './screens/Chat';

// Utilities
import store, { GlobalState } from './store';
import { Login, User } from './store/user';
import API from './api';

export default function Wrapper() {
  return <Provider store={store}>
    <ActionSheetProvider>
      <ConnectedApp />
    </ActionSheetProvider>
  </Provider>
}

const Stack = createStackNavigator();

function App(props: { loggedIn: boolean, setUser: Function }) {
  const [loadedUser, setLoadedUser] = useState<boolean>(false)
  const [loadedFonts, error] = useFonts({
    HKGroteskBold: require("./assets/fonts/HKGrotesk-Bold.otf"),
    HKGroteskItalic: require("./assets/fonts/HKGrotesk-Italic.otf"),
    HKGroteskMedium: require("./assets/fonts/HKGrotesk-Medium.otf"),
    HKGroteskRegular: require("./assets/fonts/HKGrotesk-Regular.otf"),
    HKGroteskSemiBold: require("./assets/fonts/HKGrotesk-SemiBold.otf"),
  })
  if(error) console.warn(`Error loading fonts: ${error}`)

  useEffect(() => {
    SecureStore.getItemAsync('token')
      .then(async(token) => {
        if(!token) {
          console.info("Token not set")
          return
        }
  
        const rsp = await API.get('profile')
        props.setUser(rsp.data.user)
      })
      .catch(err => {
        console.error(`Error loading token: ${err}`)
        SecureStore.deleteItemAsync('token')
      })
      .finally(() => {
        setLoadedUser(true)
      })
  })

  if(!loadedFonts || !loadedUser) return <AppLoading />;

  let stack: JSX.Element;
  if(props.loggedIn) {
    stack = <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Group" component={GroupScreen} />
      <Stack.Screen name="Room" component={RoomScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  } else {
    stack = <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="CodeInput" component={CodeInputScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SignupPassword" component={SignupPasswordScreen} />
    </Stack.Navigator>
  }

  return <NavigationContainer>{ stack }</NavigationContainer>
}

function mapStateToProps(state: GlobalState): any {
  return { loggedIn: !!state.user.user }
}

function mapDispatchToProps(dispatch: Function): any {
  return { setUser: (user: User) => dispatch(Login(user)) }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);