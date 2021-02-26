import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Layout, { Styles } from './Layout';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
}

interface State {
  code: string;
  email: string;
  loading: boolean;
  error?: string;
}

export default class CodeInputScreen extends React.Component<Props,State> {
  constructor(props: Props) { 
    super(props);
    this.state = { code: '', email: props.route.params?.email, loading: false };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { email, code, loading } = this.state;
    if(loading) return;
    this.setState({ loading: true, error: undefined });

    setTimeout(() => {
      if(code.length === 8) {
        this.setState({ loading: false, error: undefined })
        this.props.navigation.navigate('NewPassword', { email, code })
      } else {
        this.setState({ error: "Incorrect code", loading: false })
      }
    }, 500)
  }

  render(): JSX.Element {
    const { code, loading, error } = this.state;

    return <Layout title='Reset Password'>
      { error ?
        <Text style={Styles.Error}>{error}</Text> : 
        <Text style={Styles.Label}>We sent an 8 digit code to {this.state.email}, please enter it below</Text>
      }

      <View style={Styles.InputContainer}>
        <TextInput
          autoFocus
          value={code}
          maxLength={8}
          autoCorrect={false} 
          style={Styles.Input} 
          autoCapitalize={'none'}
          placeholder='12345678'
          keyboardType='number-pad'
          returnKeyType='done'
          onEndEditing={this.onSubmit}
          onChangeText={code => this.setState({ code })} />
      </View>

      <TouchableOpacity style={[Styles.Button, loading ? Styles.ButtonDisabled : {}]} onPress={this.onSubmit}>
        <Text style={Styles.ButtonText}>{loading ? 'Verifying Code' : 'Submit'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction} onPress={() => this.props.navigation.goBack()}>
        <Text style={Styles.SubActionText}>Go back</Text>
      </TouchableOpacity>
    </Layout>
  }
}