import React, { createRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Layout, { Styles } from './Layout';
import API from '../../api';
import { Login, User } from '../../store/user';
import * as SecureStore from 'expo-secure-store';
import { connect } from 'react-redux';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
  login: (user: User) => void
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

class SignupScreen extends React.Component<Props,State> {
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

    const payload = {
      first_name: this.state.firstName, 
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    }

    API.post('signup', payload)
      .then(rsp => {
        this.props.login(rsp.data.user)
        SecureStore.setItemAsync('token', rsp.data.token);
      })
      .catch(err => {
        switch(err.response?.status) {
          case undefined:
            this.setState({ error: `Unexpected error: ${err}`, loading: false })
            break
          case 400:
            this.setState({ error: `${err.response.data?.error}`, loading: false })
            break
          default:
            this.setState({ error: `Unexpected error, status: ${err.response.status}`, loading: false })
          }
        })
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

function mapStateToDispatch(dispatch: Function): any {
  return {
    login: (user: any) => dispatch(Login(user)),
  }
}

export default connect(null, mapStateToDispatch)(SignupScreen);