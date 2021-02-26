import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import { Fonts, Colors } from '../globalStyles';
import Logo from '../assets/logo.png';
import Back from '../assets/back.png';

interface Props {
  noShadow?: boolean;
  route: RouteProp<any,any>;
  navigation: NavigationProp<{}>;
  headerRight?: () => JSX.Element;
}

export default function NavBar (props: Props) {
  var backButton: JSX.Element = <Image source={Logo} style={styles.icon} />;
  if(props.navigation.canGoBack()) {
    backButton = <TouchableOpacity style={styles.backButton} onPress={props.navigation.goBack}>
      <Image source={Back} style={styles.icon} />
    </TouchableOpacity>
  }

  return <SafeAreaView style={[styles.container, props.noShadow ? { elevation: 0 } : {}]}>
    { backButton }
    <View style={styles.lower}>
      <Text style={styles.title}>{props.route.params?.title || 'Distributed'}</Text>
      { props.headerRight ? props.headerRight() : null }
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    paddingHorizontal: Device.osName === 'Android' ? 20 : 0,
    marginHorizontal: Device.osName === 'Android' ? 0 : 20,
    elevation: 5,
    height: 160,
  },
  backButton: {
    marginTop: 'auto',
  },
  icon: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginBottom: 15,
    marginTop: 'auto',
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.Bold,
    flexGrow: 1,
    flexShrink: 1,
  },
  lower: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  }
})