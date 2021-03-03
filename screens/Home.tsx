import React from 'react';
import { connect } from 'react-redux';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, RefreshControl, ImageSourcePropType } from 'react-native';
import { connectActionSheet, ActionSheetOption } from '@expo/react-native-action-sheet';
import * as SecureStore from 'expo-secure-store';
import { Colors, Fonts } from '../globalStyles';
import Profile from '../assets/profile.png';
import Person1 from '../assets/person1.png';
import Person2 from '../assets/person2.png';
import Person3 from '../assets/person3.png';
import Person4 from '../assets/person4.png';
import NavBar from '../components/NavBar';
import { Logout } from '../store/user';
import API from '../api';
import { Group, SetGroups } from '../store/groups';
import { GlobalState } from '../store';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
  showActionSheetWithOptions: (opts: ActionSheetOption, callback: ((i: number) => void)) => void
  logout: Function
  groups?: Group[]
  setGroups: (groups: Group[]) => void
}

interface State {
  loading: boolean;
}

class HomeScreen extends React.Component<Props, State> {
  readonly state: State = { loading: false }

  constructor(props: Props) {
    super(props)
    this.loadData = this.loadData.bind(this)
    this.showProfileMenu = this.showProfileMenu.bind(this)
    this.renderHeaderRight = this.renderHeaderRight.bind(this)
    this.renderGroup = this.renderGroup.bind(this)
  }

  showProfileMenu() {
    this.props.showActionSheetWithOptions(
      {
        options: ['Edit Profile', 'Logout', 'Cancel'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      idx => {
        switch(idx) {
        case 1:
          SecureStore.deleteItemAsync('token')
          this.props.logout()
        }
      },
    )
  }

  renderHeaderRight(): JSX.Element {
    return <TouchableOpacity onPress={this.showProfileMenu} style={styles.headerRight}>
      <Image style={styles.headerRightImage} source={Profile} />
    </TouchableOpacity>
  }

  componentDidMount() {
    this.loadData()
    this.props.navigation.setOptions({
      header: () => <NavBar {...this.props} headerRight={this.renderHeaderRight} />,
    })
  }

  loadData() {
    this.setState({ loading: true })

    API.get('groups')
      .then(rsp => {
        this.props.setGroups(rsp.data)
      })
      .catch(err => {
        console.error(`Error loading groups: ${err}`)
      })
      .finally(() => {
        // add a small delay to make the UI look realistic (not needed when running on Netlify)
        setTimeout(() => this.setState({ loading: false }), 500)
      })
  }
  
  render() {
    const groups = this.props.groups?.sort((a,b) => a.name > b.name ? 1 : -1)

    const refreshControl = <RefreshControl onRefresh={this.loadData} refreshing={this.state.loading} size={20} />
    return <ScrollView refreshControl={refreshControl}>
      <Text style={styles.sectionHeader}>Groups</Text>
      { groups?.map(this.renderGroup) }
      
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

  renderGroup(group: Group, index: number): JSX.Element {
    var onlineStatus: string;
    var people: ImageSourcePropType[];
    switch(index) {
    case 0:
      onlineStatus = '12 members online';
      people = [Person1, Person2, Person3, Person4];
      break;
    case 1:
      onlineStatus = '2 members online';
      people = [Person1, Person2];
      break;
    default:
      onlineStatus = 'No members online';
      people = [];
      break;
    }

    const onClick = () => this.props.navigation.navigate('Group', { id: group.id })

    return (
      <TouchableOpacity key={group.id} onPress={onClick} style={[styles.row, { borderTopWidth: index === 0 ? 1 : 0 }]}>
        <View>
          <Text style={styles.rowTitle}>{group.name}</Text>
          <Text style={styles.rowSubtitle}>{onlineStatus}</Text>
        </View>
        <View style={styles.rowImageContainer}>
          { people.map(p => <Image style={styles.rowImage} source={p} />)}
        </View>
      </TouchableOpacity>
    )
  }
}

function mapStateToProps(state: GlobalState): any {
  return {
    groups: state.groups.groups,
  }
}

function mapDispatchToProps(dispatch: Function): any {
  return {
    logout: () => dispatch(Logout()),
    setGroups: (groups: Group[]) => dispatch(SetGroups(groups)),
  }
}

export default connectActionSheet(connect(mapStateToProps, mapDispatchToProps)(HomeScreen))

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
    borderRadius: 15,
    borderColor: Colors.White,
    borderWidth: 1,
  },
})