import React from 'react';
import { connect } from 'react-redux';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Colors, Fonts } from '../globalStyles';
import NavBar from '../components/NavBar';
import { Group, SetGroup } from '../store/groups';
import { GlobalState } from '../store';
import API from '../api';
import Person from '../components/Person';

interface Props {
  route: RouteProp<any,any>
  navigation: NavigationProp<{}>
  group: Group;
  setGroup: (group: Group) => void
}

interface State {
  loading: boolean;
  websocket?: WebSocket;
}

class GroupScreen extends React.Component<Props, State> {
  readonly state: State = { loading: false }

  constructor(props: Props) {
    super(props)
    this.loadData = this.loadData.bind(this)
    this.setupWebsockets = this.setupWebsockets.bind(this)
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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevProps.group.name !== this.props.group.name) {
      this.props.navigation.setOptions({
        header: () => <NavBar title={this.props.group.name} {...this.props} headerRight={this.renderHeaderRight} />,
      })  
    }

    if(prevProps.group.websocket === this.props.group.websocket) return
    if(!this.props.group.websocket) return
    this.setupWebsockets()
  }

  setupWebsockets() {
    if(this.state.websocket) this.state.websocket.close()

    const { websocket } = this.props.group;
    var ws = new WebSocket(websocket!.url)

    ws.onopen = event => {
      console.log("Websocket opened")
      ws.send(JSON.stringify({ token: websocket!.token, topic: websocket!.topic }))
    }

    ws.onmessage = (({ data }: any) => {
      const { group, setGroup } = this.props

      // todo: fix duplicate encoding?!
      const event = JSON.parse(data)
      const message = JSON.parse(JSON.parse(event.message))
      if(message.group_id && message.group_id !== group.id) {
        console.log("Ignoring message: ", message)
        return
      }
      
      switch(message.type) {
      case 'group.updated':
        console.log("Group updated:", message)
        setGroup({ ...group, ...message })
        break
      case 'group.user.left':
        console.log("User left group:", message)
        if(message.payload.current_user) {
          alert("You have been removed from the group")
          window.location.href = '/'
          return
        }
        setGroup({ ...group, members: group.members?.filter(m => m.id !== message.payload.id) })
        break
      case 'group.user.joined':
        console.log("User joined group:", message)
        setGroup({ ...group, members: [...group.members!, message.payload] })
        break
      case 'tread.created':
        console.log("Thread created: ", message)
        setGroup({ ...group, threads: [...group.threads!, message.payload] })
        break
      case 'thread.updated':
        console.log("Thread updated: ", message)
        setGroup({
          ...group, threads: [
            ...(group.threads || []).filter(t => t.id !== message.payload.id),
            { ...(group.threads || []).find(t => t.id === message.payload.id), ...message.payload },
          ],
        })
        break
      case 'thread.deleted':
        console.log("Thread deleted: ", message)
        setGroup({ ...group, threads: group.threads?.filter(t => t.id !== message.payload.id) })
        break
      case 'message.created':
        console.log("New message: ", message)
        if(message.payload.chat.type === 'chat') {
          const member = group.members!.find(t => t.id === message.payload.chat.id)!
          setGroup({
            ...group, members: [
              ...group.members!.filter(t => t.id !== message.payload.chat.id),
              {
                ...member, chat: {
                  ...member.chat,
                  messages: [
                    ...(member.chat.messages || []),
                    message.payload.message,
                  ],
                }
              }
            ],
          })  
        } else if(message.payload.chat.type === 'thread') {
          const thread = group.threads!.find(t => t.id === message.payload.chat.id)!
          setGroup({
            ...group, threads: [
              ...group.threads!.filter(t => t.id !== message.payload.chat.id),
              {
                ...thread, messages: [
                  ...(thread.messages || []),
                  message.payload.message,
                ],
              },
            ],
          })  
        }
        break
      }
    }).bind(this)

    ws.onclose = () => {
      console.log("Websocket closed")
    }
    
    ws.onerror = () => {
      console.log("Websocket errored")
      this.setupWebsockets()
    }

    this.setState({ websocket: ws })
  }

  componentWillUnmount() {
    if(this.state.websocket) this.state.websocket.close()
  }

  renderHeaderRight(): JSX.Element {
    return <View style={styles.headerRight}>
      { this.props.group.members?.slice(0, 3)?.map(p => <Person user={p} />)}
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