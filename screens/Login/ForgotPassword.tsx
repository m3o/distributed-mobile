import React, { createRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Layout, { Styles } from './Layout';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
}

interface State {
  email: string;
  loading: boolean;
  error?: string;
}

export default class ForgotPasswordScreen extends React.Component<Props,State> {
  constructor(props: Props) { 
    super(props);
    this.state = { email: props.route.params?.email || '', loading: false };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    if(this.state.loading) return;
    this.setState({ loading: true, error: undefined });

    setTimeout(() => {
      this.setState({ loading: false, error: undefined })
      this.props.navigation.navigate('CodeInput', { email: this.state.email })
    }, 500)
  }

  render(): JSX.Element {
    const { email, loading, error } = this.state;

    return <Layout title='Reset Password'>
      { error ?
        <Text style={Styles.Error}>{error}</Text> : 
        <Text style={Styles.Label}>Enter the email address you used when signing up for your Distributed account</Text>
      }

      <View style={Styles.InputContainer}>
        <TextInput
          autoFocus
          value={email}
          autoCorrect={false} 
          style={Styles.Input} 
          autoCapitalize={'none'}
          placeholder='Email'
          keyboardType='email-address'
          returnKeyType='next'
          onEndEditing={this.onSubmit}
          onChangeText={email => this.setState({ email })} />
      </View>

      <TouchableOpacity style={[Styles.Button, loading ? Styles.ButtonDisabled : {}]} onPress={this.onSubmit}>
        <Text style={Styles.ButtonText}>{loading ? 'Sending code' : 'Submit'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction} onPress={() => this.props.navigation.goBack()}>
        <Text style={Styles.SubActionText}>Go back</Text>
      </TouchableOpacity>
    </Layout>
  }
}