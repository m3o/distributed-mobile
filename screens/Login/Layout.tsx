import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors, Fonts } from '../../globalStyles';
import Background from '../../assets/login-bg.png';
import Logo from '../../assets/logo.png';

interface Props {
  title: string;
}

interface State {}

const { width, height } = Dimensions.get('screen');

export default class Layout extends React.Component<Props,State> {
  readonly state: State = {}

  render(): JSX.Element {
    return <View style={styles.container}>
      <Image source={Background} style={styles.background} />
      <View style={styles.inner}>
        <Image style={styles.logo} source={Logo} />
        <Text style={styles.title}>{this.props.title}</Text>
        { this.props.children }
      </View>
    </View>
  }
}

export const Styles = StyleSheet.create({
  InputContainer: {
    width: '100%',
    marginTop: 30,
    minHeight: 30,
    backgroundColor: Colors.White,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.Border,
    overflow: 'hidden',
  },
  Input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: Colors.Border,
    fontSize: 15,
    fontFamily: Fonts.Regular,
  },
  Button: {
    backgroundColor: Colors.Brown,
    width: '100%',
    borderRadius: 5,
    height: 50,
    marginTop: 30,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'space-around',
  },
  ButtonDisabled: {
    backgroundColor: Colors.LightGray,
  },
  ButtonText: {
    color: Colors.White,
    fontFamily: Fonts.SemiBold,
    fontSize: 15,
    textAlign: 'center',
  },
  SubAction: {
    paddingVertical: 10,
    width: '100%'
  },
  SubActionText: {
    textAlign: 'center',
    fontFamily: Fonts.SemiBold,
    color: Colors.Gray,
  },
  Error: {
    marginTop: 20,
    fontFamily: Fonts.SemiBold,
    fontSize: 15,
    color: Colors.Red,
    textAlign: 'center',
  },
  Label: {
    marginTop: 20,
    fontFamily: Fonts.Medium,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.Black,
  }
})

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  },
  background: {
    width: width * 1.2,
    height: height * 0.35,
    position: 'absolute',
    resizeMode: 'contain',
    top: height * -0.15,
    zIndex: 0,
  },
  inner: {
    alignItems: 'center',
    marginTop: height * 0.2,
    width: width - 50,
  },
  logo: {
    width: 40,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: Fonts.Bold,
    fontSize: 28,
  },
})