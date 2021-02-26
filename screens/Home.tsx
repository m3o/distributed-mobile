import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Colors, Fonts } from '../globalStyles';
import Profile from '../assets/profile.png';
import Person1 from '../assets/person1.png';
import Person2 from '../assets/person2.png';
import Person3 from '../assets/person3.png';
import Person4 from '../assets/person4.png';
import NavBar from '../components/NavBar';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
}

interface State {
  refreshing: boolean;
}

export default class HomeScreen extends React.Component<Props, State> {
  readonly state: State = { refreshing: false }

  constructor(props: Props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
    this.showProfileMenu = this.showProfileMenu.bind(this)
    this.renderHeaderRight = this.renderHeaderRight.bind(this)
  }

  showProfileMenu() {
    
  }

  renderHeaderRight(): JSX.Element {
    return <TouchableOpacity onPress={this.showProfileMenu} style={styles.headerRight}>
      <Image style={styles.headerRightImage} source={Profile} />
    </TouchableOpacity>
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
  
  render() {
    const onClick = (title: string) => {
      this.props.navigation.navigate('Group', { title })
    }

    const refreshControl = <RefreshControl onRefresh={this.onRefresh} refreshing={this.state.refreshing} size={20} />
    return <ScrollView refreshControl={refreshControl}>
      <Text style={styles.sectionHeader}>Groups</Text>
      
      <TouchableOpacity onPress={() => onClick("Micro")} style={[styles.row, { borderTopWidth: 1 }]}>
        <View>
          <Text style={styles.rowTitle}>Micro</Text>
          <Text style={styles.rowSubtitle}>12 members online</Text>
        </View>
        <View style={styles.rowImageContainer}>
          <Image style={styles.rowImage} source={Person1} />
          <Image style={styles.rowImage} source={Person2} />
          <Image style={styles.rowImage} source={Person3} />
          <Image style={styles.rowImage} source={Person4} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onClick("Friends")} style={styles.row}>
        <View>
          <Text style={styles.rowTitle}>Friends</Text>
          <Text style={styles.rowSubtitle}>2 members online</Text>
        </View>
        <View style={styles.rowImageContainer}>
          <Image style={styles.rowImage} source={Person1} />
          <Image style={styles.rowImage} source={Person2} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onClick("Family")} style={styles.row}>
        <View>
          <Text style={styles.rowTitle}>Family</Text>
          <Text style={styles.rowSubtitle}>No members online</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowNewTitle}>Create a new group</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Upcoming Events</Text>
      
      <TouchableOpacity style={[styles.row, { borderTopWidth: 1 }]}>
        <View>
          <Text style={styles.rowTitle}>Standup</Text>
          <Text style={styles.rowSubtitle}>Starts in 4 minutes</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <View>
          <Text style={styles.rowTitle}>Family Quiz Night</Text>
          <Text style={styles.rowSubtitle}>Starts tonight at 8pm</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Text style={styles.rowNewTitle}>Create a new event</Text>
      </TouchableOpacity>
    </ScrollView>
  }
}

const styles = StyleSheet.create({
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
    flexDirection: 'row',
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
  rowImageContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  rowImage: {
    height: 30,
    width: 30,
    marginLeft: -15,
    borderRadius: 15,
    borderColor: Colors.White,
    borderWidth: 1,
  },
  rowNewTitle: {
    fontFamily: Fonts.Regular,
    color: Colors.LightGray,
    fontSize: 14,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
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