import * as React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import LoginScreen from './screens/Login/Login';
import ForgotPasswordScreen from './screens/Login/ForgotPassword';
import CodeInputScreen from './screens/Login/CodeInput';
import NewPasswordScreen from './screens/Login/NewPassword';
import HomeScreen from './screens/Home';
import GroupScreen from './screens/Group';
import RoomScreen from './screens/Room';
import ChatScreen from './screens/Chat';

const Stack = createStackNavigator();

function App() {
  const [loaded, error] = useFonts({
    HKGroteskBold: require("./assets/fonts/HKGrotesk-Bold.otf"),
    HKGroteskItalic: require("./assets/fonts/HKGrotesk-Italic.otf"),
    HKGroteskMedium: require("./assets/fonts/HKGrotesk-Medium.otf"),
    HKGroteskRegular: require("./assets/fonts/HKGrotesk-Regular.otf"),
    HKGroteskSemiBold: require("./assets/fonts/HKGrotesk-SemiBold.otf"),
  })
  if(error) console.warn(`Error loading fonts: ${error}`)
  if(!loaded) return <AppLoading />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CodeInput" component={CodeInputScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      </Stack.Navigator>
      {/* <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default App;