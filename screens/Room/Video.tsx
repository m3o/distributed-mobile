import React, { createRef } from 'react'
import { NavigationProp } from '@react-navigation/native'
import { View, Text, ScrollView, StyleSheet, Dimensions, Alert, Image } from 'react-native'
import {
  TwilioVideoLocalView,
  TwilioVideo,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc'
import Person1 from '../../assets/person1.png'
// import Person2 from '../../assets/person2.png'
// import Person3 from '../../assets/person3.png'
// import Person4 from '../../assets/person4.png'
import { Fonts } from '../../globalStyles'
import { Group, Thread } from '../../store/groups'
import API from '../../api'

interface Props {
  group: Group
  thread: Thread
  navigation: NavigationProp<{}>
}

const { width } = Dimensions.get('screen')

interface State {
  token?: string
  identity?: string
  participants?: Participant[]
}

interface Participant {
  identity: string
  sid: string
  videoTrackSid?: string;
}

export default class Video extends React.Component<Props, State> {
  readonly twilioRef: React.RefObject<TwilioVideo>
  readonly state: State = {}

  constructor(props: Props) {
    super(props)
    this.twilioRef = createRef()
    this.renderParticipant = this.renderParticipant.bind(this)
    this.onRoomDidConnect = this.onRoomDidConnect.bind(this)
    this.onRoomDidDisconnect = this.onRoomDidDisconnect.bind(this)
    this.onParticipantConnected = this.onParticipantConnected.bind(this)
    this.onParticipantDisconnected = this.onParticipantDisconnected.bind(this)
    this.onParticipantAddedVideoTrack = this.onParticipantAddedVideoTrack.bind(this)
    this.onParticipantRemovedVideoTrack = this.onParticipantRemovedVideoTrack.bind(this)
  }

  componentDidMount() {
    this.fetchToken()
  }

  async componentWillUnmount() { 
    await this.twilioRef.current?.unpublishLocalAudio();
    await this.twilioRef.current?.unpublishLocalVideo();
    this.twilioRef.current?.disconnect()
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevState?.token !== this.state.token && this.state.token) {
      this.twilioRef.current?.connect({ 
        enableAudio: true,
        enableVideo: true,
        accessToken: this.state.token,
        roomName: this.props.thread.id,
      })
    }
  }
  
  fetchToken() {
    API.get('video')
      .then(rsp => this.setState({ ...rsp.data }))
      .catch(err => {
        var msg: string
        switch(err.response?.status) {
        case undefined:
          msg = `Unexpected error: ${err}`
          break
        case 400:
          msg = `${err.response.data?.error}`
          break
        default:
          msg = `Unexpected error, status: ${err.response.status}`
        }

        Alert.alert("Error connecting to room", msg)  
      })
  }

  async onRoomDidConnect(e: { participants: Participant[] }) {
    console.log(`Room connected as ${this.state.identity}`, e)
    this.setState({ participants: e.participants })
    await this.twilioRef.current?.publishLocalAudio()
    await this.twilioRef.current?.publishLocalVideo()
    await this.twilioRef.current?.setLocalAudioEnabled(true)
  }
 
  onRoomDidDisconnect(e: { error: any }): void {
    console.log(`Room disconnected`, e.error)
    this.setState({ participants: undefined })
  }

  onParticipantConnected(e: { participant: Participant }) {
    console.log(`Participant connected`, e.participant)
    this.setState({ participants: [...this.state.participants || [], e.participant ]})
  }

  onParticipantDisconnected(e: { participant: Participant }) {
    console.log(`Participant disconnected`, e.participant)
    this.setState({ participants: this.state.participants?.filter(p => p.identity !== e.participant.identity ) })
  }

  onParticipantAddedVideoTrack(e: { participant: Participant, track: { trackSid: string }}) {
    const p = this.state.participants?.find(p => p.identity === e.participant.identity) || e.participant;

    this.setState({
      participants: [
        ...(this.state.participants || []).filter(p => p.identity !== e.participant.identity),
        { ...p, videoTrackSid: e.track.trackSid },
      ],
    })
  }

  onParticipantRemovedVideoTrack(e: { participant: Participant, track: { trackSid: string }}) {
    const p = this.state.participants?.find(p => p.identity === e.participant.identity) || e.participant;

    this.setState({
      participants: [
        ...(this.state.participants || []).filter(p => p.identity !== e.participant.identity),
        { ...p, videoTrackSid: undefined },
      ],
    })
  }

  render(): JSX.Element {
    const participants = this.state.participants?.sort((a,b) => {
      const userA = this.props.group.members?.find(m => m.id === a.identity);
      const userB = this.props.group.members?.find(m => m.id === b.identity);
      return (userA?.id || '') > (userB?.id || '') ? 1 : -1;
    })
    return <ScrollView>
      <View style={styles.container}>
        { participants?.map(this.renderParticipant) }
        
        <TwilioVideo
          ref={this.twilioRef}
          onRoomDidConnect={this.onRoomDidConnect}
          onRoomDidDisconnect={this.onRoomDidDisconnect}
          onRoomDidFailToConnect= {e => console.log("onRoomDidFailToConnect", e)}
          onRoomParticipantDidConnect={this.onParticipantConnected}
          onRoomParticipantDidDisconnect={this.onParticipantDisconnected} 
          onParticipantAddedVideoTrack={this.onParticipantAddedVideoTrack} 
          onParticipantDisabledVideoTrack={this.onParticipantRemovedVideoTrack} />
      </View>
    </ScrollView>
  }

  renderParticipant(p: Participant) {
    const user = this.props.group.members?.find(m => m.id === p.identity);
    console.log(`Render`, p)

    var inner: JSX.Element;
    if(p.identity === this.state.identity) {
      inner = <TwilioVideoLocalView enabled={true} style={styles.video} />;
    } else if (p.videoTrackSid?.length) {
      inner = <TwilioVideoParticipantView trackIdentifier={{ participantSid: p.sid, videoTrackSid: p.videoTrackSid }} style={[styles.video, styles.videoRemote} />
    } else {
      inner = <Image source={Person1} style={styles.video} />
    }

    return <View key={p.identity} style={styles.person}>
      <View style={styles.videoContainer}>{ inner }</View>
      <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  person: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  videoContainer: {
    width: width / 3.8,
    height: width / 3.8,
    borderRadius: width / 7.6,
    overflow: 'hidden',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  video: {
    width: width / 3.8,
    height: width / 3.8,
  },
  videoRemote: {
    transform: [{
      scaleX: -1,
    }],
  },
  name: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  }
})