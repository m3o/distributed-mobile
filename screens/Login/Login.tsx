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
  password: string;
  loading: boolean;
  error?: string;
}

export default class LoginScreen extends React.Component<Props,State> {
  readonly passwordInput: React.RefObject<TextInput>;
  
  constructor(props: Props) {
    super(props);
    this.state = { email: '', password: '', loading: false };
    this.passwordInput = createRef<TextInput>();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    if(this.state.loading) return;
    this.setState({ loading: true });

    setTimeout(() => {
      this.setState({ error: "Incorrect email", loading: false })
    }, 500)
  }

  render(): JSX.Element {
    const { email, password, loading, error } = this.state;

    return <Layout title='Login to Distributed'>
      { error ? <Text style={Styles.Error}>{error}</Text> : null }

      <View style={Styles.InputContainer}>
        <TextInput
          value={email}
          autoCorrect={false} 
          autoCapitalize={'none'}
          placeholder='Email'
          keyboardType='email-address'
          returnKeyType='next'
          style={[Styles.Input, {borderBottomWidth: 1}]} 
          onChangeText={email => this.setState({ email })}
          onEndEditing={() => this.passwordInput.current?.focus()} />
          
        <TextInput
          secureTextEntry
          value={password}
          style={Styles.Input}
          placeholder='Password'
          returnKeyType='done'
          ref={this.passwordInput} 
          onEndEditing={this.onSubmit}
          onChangeText={password => this.setState({ password })} />
      </View>

      <TouchableOpacity style={[Styles.Button, loading ? Styles.ButtonDisabled : {}]} onPress={this.onSubmit}>
        <Text style={Styles.ButtonText}>{loading ? 'Logging in' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction}>
        <Text style={Styles.SubActionText}>Don’t have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction} onPress={() => this.props.navigation.navigate('ForgotPassword', { email })}>
        <Text style={Styles.SubActionText}>Forgot your password?</Text>
      </TouchableOpacity>
    </Layout>
  }
}