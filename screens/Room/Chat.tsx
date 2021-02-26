import React from 'react';
import { View, ScrollView, Image, Platform, StyleSheet, TextInput, SafeAreaView, KeyboardAvoidingView, Dimensions, LayoutChangeEvent, Text } from 'react-native';
import { Colors, Fonts } from '../../globalStyles';
import Person1 from '../../assets/person1.png';
import Person2 from '../../assets/person2.png';

interface Props {
  group?: boolean;
}

interface State {
  input: string;
  heightDiff: number;
}

const { height, width } = Dimensions.get('screen');

export default class Chat extends React.Component<Props,State> {
  readonly state: State = { input: '', heightDiff: 64 };

  constructor(props: Props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
  }
  
  onLayout(e: LayoutChangeEvent) {
    this.setState({ heightDiff: height - e.nativeEvent.layout.height })
  }

  render(): JSX.Element {
    return(
      <View style={styles.container} onLayout={this.onLayout}>
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={this.state.heightDiff}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >

          <ScrollView style={styles.scrollView}>
            { this.props.group ? 
              <View style={styles.messageContainer}>
                <Image style={styles.messageIcon} source={Person1} />
                <View>
                  <Text style={styles.messageSender}>Shane Rowe</Text>
                  <View style={[styles.messageTextContainer, styles.messageTextContainerRecipient]}>
                    <Text style={styles.messageText}>Dave oh my God! It's out of ice! Like some outer space!</Text>
                  </View>
                </View>
              </View> :
              <View style={[styles.messageTextContainer, styles.messageTextContainerRecipient]}>
                <Text style={styles.messageText}>Dave oh my God! It's out of ice! Like some outer space!</Text>
              </View>
            }

            <View style={[styles.messageTextContainer, styles.messageTextContainerSender]}>
              <Text style={[styles.messageText, styles.messageTextSender]}>Dave oh my God! It's out of ice! Like some outer space!</Text>
            </View>

            { this.props.group ? 
              <View style={styles.messageContainer}>
                <Image style={styles.messageIcon} source={Person2} />
                <View>
                  <Text style={styles.messageSender}>Milton Aaron</Text>
                  <View style={[styles.messageTextContainer, styles.messageTextContainerRecipient]}>
                    <Text style={styles.messageText}>Dave this could mean the end of the bana daquiri we know</Text>
                  </View>
                </View>
              </View> : 
              <View style={[styles.messageTextContainer, styles.messageTextContainerRecipient]}>
                <Text style={styles.messageText}>Dave this could mean the end of the bana daquiri we know</Text>
              </View>
            }
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <SafeAreaView>
              <TextInput
                autoFocus
                style={styles.input}
                value={this.state.input}
                returnKeyType='send'
                placeholder='Send a message' 
                onChangeText={input => this.setState({ input })} />
              </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: Colors.White,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: Colors.Background,
    display: 'flex',
    flexDirection: 'column-reverse',
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