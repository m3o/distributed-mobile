import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Colors, Fonts } from '../globalStyles';
import Person1 from '../assets/person1.png';
import Person2 from '../assets/person2.png';
import Person3 from '../assets/person3.png';
import Person4 from '../assets/person4.png';
import NavBar from '../components/NavBar';

interface Props {
  route: RouteProp<any,any>
  navigation: NavigationProp<{}>
}

interface State {
  refreshing: boolean;
}

export default class GroupScreen extends React.Component<Props, State> {
  readonly state: State = { refreshing: false }

  constructor(props: Props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
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
      <Image style={styles.headerRightImage} source={Person2} />
      <Image style={styles.headerRightImage} source={Person3} />
      <Image style={styles.headerRightImage} source={Person4} />
    </View>
  }
  
  render() {
    const onRoomPress = (title: string) => this.props.navigation.navigate('Room', { title })
    const onChatPress = (title: string) => this.props.navigation.navigate('Chat', { title })

    const refreshControl = <RefreshControl onRefresh={this.onRefresh} refreshing={this.state.refreshing} size={20} />
    return <ScrollView refreshControl={refreshControl}>
      <Text style={styles.sectionHeader}>🛋️ Rooms</Text>
      
      <TouchableOpacity onPress={() => onRoomPress('Kitchen')} style={[styles.row, { borderTopWidth: 1 }]}>
        <Text style={styles.rowTitle}>Kitchen</Text>
        <Text style={styles.rowSubtitle}>12 members online</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRoomPress('Office')} style={styles.row}>
        <Text style={styles.rowTitle}>Office</Text>
        <Text style={styles.rowSubtitle}>2 members online</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRoomPress('War Room')} style={styles.row}>
        <Text style={styles.rowTitle}>War Room</Text>
        <Text style={styles.rowSubtitle}>No members online</Text>
      </TouchableOpacity>
      
      <Text style={styles.sectionHeader}>👨‍👩‍👦 People</Text>
      
      <TouchableOpacity onPress={() => onChatPress('Asim Aslam')} style={[styles.row, { borderTopWidth: 1 }]}>
        <Text style={styles.rowTitle}>Asim Aslam</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChatPress('Dom Wong')} style={styles.row}>
        <Text style={styles.rowTitle}>Dom Wong</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChatPress('János Dobronszki')} style={styles.row}>
        <Text style={styles.rowTitle}>János Dobronszki</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onChatPress('Chris H')} style={styles.row}>
        <Text style={styles.rowTitle}>Chris H</Text>
      </TouchableOpacity>
    </ScrollView>
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
  sectionHeader: {
    fontFamily: Fonts.SemiBold,
    color: Colors.Black,
    fontSize: 16,
    marginLeft: 20,
    marginTop: 50,
    marginBottom: 10,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    backgroundColor: Colors.White,
    borderColor: Colors.Border,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    minHeight: 44,
    flexDirection: 'column',
  },
  rowTitle: {
    fontFamily: Fonts.Medium,
    color: Colors.Black,
    fontSize: 17,
  },
  rowSubtitle: {
    fontFamily: Fonts.Medium,
    color: Colors.LightGray,
    fontSize: 13,
    marginTop: 5,
  },
  rowNewTitle: {
    fontFamily: Fonts.Regular,
    color: Colors.LightGray,
    fontSize: 14,
    marginTop: 'auto',
    marginBottom: 'auto',
  }
})