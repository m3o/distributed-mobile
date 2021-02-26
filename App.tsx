import * as React from 'react';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
  if(!loaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
        <Stack.Screen name="Room" component={RoomScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;