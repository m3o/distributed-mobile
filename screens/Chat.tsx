import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, Image } from 'react-native';
import { Colors } from '../globalStyles';
import Person1 from '../assets/person1.png';
import NavBar from '../components/NavBar';
import Chat from './Room/Chat';

interface Props {
  route: RouteProp<any,any>
  navigation: NavigationProp<{}>
}

interface State {
  refreshing: boolean;
}

export default class ChatScreen extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.renderHeaderRight = this.renderHeaderRight.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      header: () => <NavBar {...this.props} headerRight={this.renderHeaderRight} />,
    })
  }

  onRefresh() {
    this.setState({ refreshing: true })
    setTimeout(() => this.setState({ refreshing: false }), 700)
  }

  renderHeaderRight(): JSX.Element {
    return <View style={styles.headerRight}>
      <Image style={styles.headerRightImage} source={Person1} />
    </View>
  }
  
  render() {
    return <Chat />
  }
}

const styles = StyleSheet.create({
  headerRight: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  headerRightImage: {
    height: 30,
    width: 30,
    marginLeft: -15,
    borderRadius: 15,
    borderColor: Colors.White,
    borderWidth: 1,
  },
})