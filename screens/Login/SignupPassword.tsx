import React, { createRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Layout, { Styles } from './Layout';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
}

interface State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmation: string;
  loading?: boolean;
  error?: string;
}

export default class SignupScreen extends React.Component<Props,State> {
  readonly passwordInput: React.RefObject<TextInput>;
  readonly confirmationInput: React.RefObject<TextInput>;
  
  constructor(props: Props) {
    super(props);
    this.state = { ...props.route.params, password: '', confirmation: '' } as State;
    this.passwordInput = createRef<TextInput>();
    this.confirmationInput = createRef<TextInput>();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    if(this.state.loading) return;
    if(this.state.confirmation !== this.state.password) {
      this.setState({ error: "Passwords do not match" })
      return
    }

    this.setState({ loading: true });
  }

  valid(): boolean {
    if(!this.state.password.length) return false;
    if(!this.state.confirmation.length) return false;
    return true
  }

  render(): JSX.Element {
    const { password, confirmation, error, loading } = this.state;

    return <Layout title='Signup to Distributed'>
      { error ?
        <Text style={Styles.Error}>{error}</Text> : 
        <Text style={Styles.Label}>Enter a password</Text>
      }

      <View style={Styles.InputContainer}>
        <TextInput
          secureTextEntry
          value={password}
          style={[Styles.Input, {borderBottomWidth: 1}]}
          placeholder='Password'
          returnKeyType='done'
          onEndEditing={() => this.confirmationInput.current?.focus}
          onChangeText={password => this.setState({ password })} />

        <TextInput
          secureTextEntry
          value={confirmation}
          style={Styles.Input}
          placeholder='Confirmation'
          returnKeyType='done'
          ref={this.confirmationInput} 
          onEndEditing={this.onSubmit} 
          onChangeText={confirmation => this.setState({ confirmation })} />
      </View>

      <TouchableOpacity disabled={loading || !this.valid()} style={[Styles.Button, loading || !this.valid() ? Styles.ButtonDisabled : {}]} onPress={this.onSubmit}>
        <Text style={Styles.ButtonText}>{loading ? 'Signing up' : 'Signup'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction} onPress={() => this.props.navigation.goBack()}>
        <Text style={Styles.SubActionText}>Go back</Text>
      </TouchableOpacity>
    </Layout>
  }
}