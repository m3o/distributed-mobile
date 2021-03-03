import React from 'react';
import { View, Image, Platform, StyleSheet, TextInput, SafeAreaView, KeyboardAvoidingView, Dimensions, Text, FlatList } from 'react-native';
import { Colors, Fonts } from '../../globalStyles';
import Person1 from '../../assets/person1.png';
import Person2 from '../../assets/person2.png';
import { Message } from '../../store/groups';

interface Props {
  group?: boolean;
  messages: Message[];
}

interface State {
  input: string;
  heightDiff: number;
}

const { width } = Dimensions.get('screen');

export default class Chat extends React.Component<Props,State> {
  readonly state: State = { input: '', heightDiff: 64 };

  constructor(props: Props) {
    super(props);
    this.renderMessage = this.renderMessage.bind(this);
  }

  render(): JSX.Element {
    const messages = this.props.messages?.sort((a,b) => a.sent_at! < b.sent_at! ? 1 : -1);

    return(
      <KeyboardAvoidingView 
        style={styles.container}
        keyboardVerticalOffset={160}
        behavior={Platform.OS === "ios" ? "padding" : null} >

        <FlatList
          data={messages} 
          inverted={true}
          keyExtractor={m => m.id}
          renderItem={this.renderMessage} />
        
        <View style={styles.inputContainer}>
          <SafeAreaView>
            <TextInput
              style={styles.input}
              value={this.state.input}
              returnKeyType='send'
              placeholder='Send a message' 
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
        <Image style={styles.messageIcon} source={Person1} />
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
  },
  messageSender: {
    marginLeft: 20,
    marginBottom: 3,
    color: '#86868A',
  }
})