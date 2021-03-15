import React from 'react';
import { connect } from 'react-redux';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../globalStyles';
import PeopleIcon from '../../assets/people.png';
import VideoIcon from '../../assets/video.png';
import ChatIcon from '../../assets/chat.png';
import ChatHighlighted from '../../assets/chat-highlighted.png';
import PeopleHighlighted from '../../assets/people-highlighted.png';
import VideoHighlighted from '../../assets/video-highlighted.png';
import NavBar from '../../components/NavBar';
import Chat from './Chat';
import Video from './Video';
import People from './People';
import { GlobalState } from '../../store';
import { Group, SetGroup, Thread } from '../../store/groups';
import API from '../../api';
import { v4 as uuid } from 'uuid';
import Person from '../../components/Person';

interface Props {
  route: RouteProp<any,any>
  navigation: NavigationProp<{}>
  updateGroup: (group: Group) => void
  group: Group
  thread: Thread
}

interface State {
  screen: 'chat' | 'video' | 'people';
}

class RoomScreen extends React.Component<Props, State> {
  readonly state: State = { screen: 'chat' }

  constructor(props: Props) {
    super(props)
    this.sendMessage = this.sendMessage.bind(this)
    this.renderHeaderRight = this.renderHeaderRight.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      header: () => <NavBar {...this.props} noShadow title={this.props.thread.topic} headerRight={this.renderHeaderRight} />,
    })
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.thread.topic !== this.props.thread.topic) {
      this.props.navigation.setOptions({
        header: () => <NavBar title={this.props.thread.topic} {...this.props} headerRight={this.renderHeaderRight} />,
      })  
    }
  }

  async sendMessage(text: string) {
    const id = uuid()
    
    API.post(`threads/${this.props.thread.id}/messages`, { id, text }).catch(err => {
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
      
      const { group, thread, updateGroup } = this.props;
      updateGroup({ ...group, threads: [
        ...group.threads!.filter(t => t.id !== thread.id),
        {
          ...thread,
          messages: thread.messages?.filter(m => m.id !== id),
        },
      ]})
    })

    const { group, thread, updateGroup } = this.props;
    updateGroup({ ...group, threads: [
      ...group.threads!.filter(t => t.id !== thread.id),
      {
        ...thread,
        messages: [
          ...(thread.messages || []),
          {
            id,
            text,
            author: group.members!.find(m => m.current_user),
            sent_at: Date.now(),
          },
        ],
      },
    ]})
  }

  renderHeaderRight(): JSX.Element {
    return <View style={styles.headerRight}>
      { this.props.group.members?.slice(0, 3)?.map(p => <Person user={p} />)}
    </View>
  }

  renderSubheader(): JSX.Element {
    const { screen } = this.state;

    return <View style={styles.subheaderContainer}>
      <TouchableOpacity
        style={[styles.subheaderColumn, screen === 'chat' ? null : { borderBottomColor: 'transparent' }]}
        onPress={() => this.setState({ screen: 'chat' })} >
        <Image style={styles.subheaderImage} source={screen === 'chat' ? ChatHighlighted : ChatIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.subheaderColumn, screen === 'video' ? null : { borderBottomColor: 'transparent' }]}
        onPress={() => this.setState({ screen: 'video' })} >
        <Image style={styles.subheaderImage} source={screen === 'video' ? VideoHighlighted : VideoIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.subheaderColumn, screen === 'people' ? null : { borderBottomColor: 'transparent' }]}
        onPress={() => this.setState({ screen: 'people' })} >
        <Image style={styles.subheaderImage} source={screen === 'people' ? PeopleHighlighted : PeopleIcon} />
      </TouchableOpacity>
    </View>
  }
  
  render() {
    let inner = <View />
    switch(this.state.screen) {
    case 'chat':
      inner = <Chat group messages={this.props.thread.messages || []} sendMessage={this.sendMessage} />;
      break;
    case 'video':
      inner = <Video thread={this.props.thread} group={this.props.group} navigation={this.props.navigation} />;
      break;
    case 'people':
      inner = <People group={this.props.group} navigation={this.props.navigation} />;
      break;
    }

    return <View style={styles.container}>
      { this.renderSubheader() }
      { inner }
    </View>
  }
}

function mapStateToProps(state: GlobalState, ownProps: Props): any {
  const { group_id, thread_id } = ownProps.route.params!;
  const group = state.groups.groups!.find(g => g.id === group_id)
  const thread = group!.threads!.find(t => t.id === thread_id);
  return { group, thread }
}

function mapDispatchToProps(dispatch: Function): any {
  return {
    updateGroup: (group: Group) => dispatch(SetGroup(group)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen)

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
  subheaderContainer: {
    backgroundColor: Colors.White,
    borderColor: Colors.Border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 55,
    display: 'flex',
    flexDirection: 'row',
  },
  subheaderColumn: {
    flex: 1,
    borderTopColor: 'transparent',
    borderBottomColor: Colors.Brown,
    borderTopWidth: 3,
    borderBottomWidth: 3,
  },
  subheaderImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container: {
    flexGrow: 1,
  },
})