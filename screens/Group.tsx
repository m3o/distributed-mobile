import React from 'react';
import { connect } from 'react-redux';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Colors, Fonts } from '../globalStyles';
import Person1 from '../assets/person1.png';
import Person2 from '../assets/person2.png';
import Person3 from '../assets/person3.png';
import Person4 from '../assets/person4.png';
import NavBar from '../components/NavBar';
import { Group, SetGroup } from '../store/groups';
import { GlobalState } from '../store';
import API from '../api';

interface Props {
  route: RouteProp<any,any>
  navigation: NavigationProp<{}>
  group: Group;
  setGroup: (group: Group) => void
}

interface State {
  loading: boolean;
}

class GroupScreen extends React.Component<Props, State> {
  readonly state: State = { loading: false }

  constructor(props: Props) {
    super(props)
    this.loadData = this.loadData.bind(this)
    this.renderHeaderRight = this.renderHeaderRight.bind(this)
  }

  componentDidMount() {
    this.loadData()
    this.props.navigation.setOptions({
      header: () => <NavBar title={this.props.group.name} {...this.props} headerRight={this.renderHeaderRight} />,
    })
  }

  loadData() {
    this.setState({ loading: true })

    API.get('groups/'+ this.props.route.params!.id)
      .then(rsp => {
        this.props.setGroup(rsp.data)
      })
      .catch(err => {
        console.error(`Error loading group: ${err}`)
      })
      .finally(() => {
        this.setState({ loading: false })
      })

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
    const { id, threads, members } = this.props.group;
    
    const refreshControl = <RefreshControl onRefresh={this.loadData} refreshing={this.state.loading} size={20} />
    return <ScrollView refreshControl={refreshControl}>
      <Text style={styles.sectionHeader}>🛋️ Rooms</Text>

      { threads?.map((t,i) => {
        const onClick = () => this.props.navigation.navigate('Room', { group_id: id, thread_id: t.id })

        return(
          <TouchableOpacity key={t.id} onPress={onClick} style={[styles.row, { borderTopWidth: i === 0 ? 1 : 0 }]}>
            <Text style={styles.rowTitle}>{t.topic}</Text>
            <Text style={styles.rowSubtitle}>12 members online</Text>
          </TouchableOpacity>
        )
      }) }
      
      <Text style={styles.sectionHeader}>👨‍👩‍👦 People</Text>

      { members?.filter(u => !u.current_user)?.map((m,i) => {
        const onClick = () => this.props.navigation.navigate('Chat', { group_id: id, user_id: m.id })
        
        return(
          <TouchableOpacity key={m.id} onPress={onClick} style={[styles.row, { borderTopWidth: i === 0 ? 1 : 0 }]}>
            <Text style={styles.rowTitle}>{m.first_name} {m.last_name}</Text>
          </TouchableOpacity>
        )
      }) }
    </ScrollView>
  }
}

function mapStateToProps(state: GlobalState, ownProps: Props): any {
  const id = ownProps.route.params!.id
  return {
    group: state.groups.groups!.find(g => g.id === id),
  }
}

function mapDispatchToProps(dispatch: Function): any {
  return {
    setGroup: (group: Group) => dispatch(SetGroup(group)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupScreen)

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