import React, { createRef } from 'react';
import { View, Image, Platform, StyleSheet, TextInput, SafeAreaView, KeyboardAvoidingView, Dimensions, Text, FlatList, Keyboard, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import Person from '../../components/Person';
import { Colors, Fonts } from '../../globalStyles';
import { Message } from '../../store/groups';

interface Props {
  group?: boolean;
  messages: Message[];
  sendMessage: (msg: string) => void;
}

interface State {
  input: string;
}

const { width } = Dimensions.get('screen');

export default class Chat extends React.Component<Props,State> {
  readonly inputRef: React.RefObject<TextInput>;
  readonly state: State = { input: '' };

  constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.inputRef = createRef<TextInput>();
  }

  onSubmit(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
    e.preventDefault()

    if(this.state.input.length === 0) {
      Keyboard.dismiss();
      return;
    }

    this.props.sendMessage(this.state.input);
    this.setState({ input: '' });
  }

  render(): JSX.Element {
    const unique = Array.from(this.props.messages.reduce((a,c)=>{ a.set(c.id, c); return a; }, new Map()).values())
    
    const messages = unique.sort((a,b) => {
      const asentat = typeof(a.sent_at) === 'string' ? Date.parse(a.sent_at) : a.sent_at!;
      const bsentat = typeof(b.sent_at) === 'string' ? Date.parse(b.sent_at) : b.sent_at!;
      return asentat < bsentat ? 1 : -1
    });

    return(
      <KeyboardAvoidingView 
        style={styles.container}
        keyboardVerticalOffset={160}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>

        <FlatList
          data={messages} 
          inverted={true}
          keyExtractor={m => m.id}
          renderItem={this.renderMessage} />
        
        <View style={styles.inputContainer}>
          <SafeAreaView>
            <TextInput
              ref={this.inputRef}
              style={styles.input}
              value={this.state.input}
              returnKeyType='send'
              blurOnSubmit={false}
              placeholder='Send a message' 
              onSubmitEditing={this.onSubmit}
              onChangeText={input => this.setState({ input })} />
            </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  renderMessage({ item }: { item: Message }): JSX.Element {
    if(item.author?.current_user) {
      return <View key={item.id} style={[styles.messageTextContainer, styles.messageTextContainerSender]}>
        <Text style={[styles.messageText, styles.messageTextSender]}>{item.text}</Text>
      </View>
    }

    if(this.props.group) {
      return <View key={item.id} style={styles.messageContainer}>
        <Person styles={{marginLeft: 10, marginRight: -5, marginTop: 'auto', marginBottom: 10 }} user={item.author!} />
        <View>
          <Text style={styles.messageSender}>{item.author?.first_name} {item.author?.last_name}</Text>
          <View style={[styles.messageTextContainer, styles.messageTextContainerRecipient]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
      </View>
    }

    return <View key={item.id} style={[styles.messageTextContainer, styles.messageTextContainerRecipient]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Background,
    flex: 1,
  },
  inputContainer: {
    backgroundColor: Colors.White,
  },
  input: {
    height: 44,
    margin: 5,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.Border,
    paddingHorizontal: 15,
    fontSize: 15,
    marginHorizontal: 15,
  },
  messageTextContainer: {
    borderRadius: 15,
    maxWidth: width * 0.7,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  messageTextContainerRecipient: {
    backgroundColor: '#e6e6e8',
    borderBottomLeftRadius: 0,
  },
  messageTextContainerSender: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 0,
    alignSelf: 'flex-end',
  },
  messageText: {
    fontFamily: Fonts.Regular,
    fontSize: 16,
  },
  messageTextSender: {
    color: Colors.White,
  },
  messageIcon: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginLeft: 12,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
    flexShrink: 1,
  },
  messageSender: {
    marginLeft: 20,
    marginBottom: 3,
    color: '#86868A',
  }
})