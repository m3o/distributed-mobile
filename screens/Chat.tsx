import React from 'react';
import { connect } from 'react-redux';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Colors } from '../globalStyles';
import NavBar from '../components/NavBar';
import Chat from './Room/Chat';
import { GlobalState } from '../store';
import { User } from '../store/user';
import { v4 as uuid } from 'uuid';
import API from '../api';
import { Group, SetGroup } from '../store/groups';
import Person from '../components/Person';

interface Props {
  route: RouteProp<any,any>
  navigation: NavigationProp<{}>
  user: User
  group: Group
  updateGroup: (group: Group) => void
}

interface State {
  refreshing: boolean;
}

class ChatScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.sendMessage = this.sendMessage.bind(this)
    this.renderHeaderRight = this.renderHeaderRight.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      header: () => <NavBar {...this.props} title={this.props.user.first_name} headerRight={this.renderHeaderRight} />,
    })
  }

  onRefresh() {
    this.setState({ refreshing: true })
    setTimeout(() => this.setState({ refreshing: false }), 700)
  }

  renderHeaderRight(): JSX.Element {
    return <View style={styles.headerRight}>
      <Person user={this.props.user} />
    </View>
  }

  async sendMessage(text: string) {
    const id = uuid()
    
    API.post(`chats/${this.props.user.id}/messages`, { id, text }).catch(err => {
      var msg: string;
      switch(err.response?.status) {
      case undefined:
        msg = `Unexpected error: ${err}`;
        break
      case 400:
        msg = `${err.response.data?.error}`;
        break
      default:
        msg = `Unexpected error, status: ${err.response.status}`;
      }
          
      Alert.alert("Error sending message", msg)
      
      const { group, user, updateGroup } = this.props;
      updateGroup({ ...group, members: [
        ...group.members!.filter(t => t.id !== user.id),
        {
          ...user,
          chat: {
            ...user.chat,
            messages: user.chat.messages?.filter(m => m.id !== id),
          },
        },
      ]})
    })

    const { group, user, updateGroup } = this.props;
    updateGroup({ ...group, members: [
      ...group.members!.filter(t => t.id !== user.id),
      {
        ...user,
        chat: {
          ...user.chat,
          messages: [
            ...(user.chat.messages || []),
            {
              id,
              text,
              author: group.members!.find(m => m.current_user),
              sent_at: Date.now(),
            },
          ],
        },
      },
    ]})
  }

  render() {
    console.log(this.props.user)
    return <Chat messages={this.props.user.chat.messages || []} sendMessage={this.sendMessage} />
  }
}

function mapStateToProps(state: GlobalState, ownProps: Props): any {
  const { group_id, user_id } = ownProps.route.params!;
  const group = state.groups.groups!.find(g => g.id === group_id);
  const user = group!.members!.find(t => t.id === user_id);
  return { group, user }
}

function mapDispatchToProps(dispatch: Function): any {
  return {
    updateGroup: (group: Group) => dispatch(SetGroup(group)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

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