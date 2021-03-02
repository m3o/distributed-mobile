import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Layout, { Styles } from './Layout';
import * as SecureStore from 'expo-secure-store';
import { Login, User } from '../../store/user';
import API from '../../api';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
  login: (user: User) => void
}

interface State {
  email: string;
  code: string;
  confirmation: string;
  password: string;
  loading: boolean;
  error?: string;
}

class NewPasswordScreen extends React.Component<Props,State> {
  readonly confirmationInput: React.RefObject<TextInput>;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      email: props.route.params!.email,
      code: props.route.params!.code,
      confirmation: '',
      password: '',
      loading: false,
    };
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
    API.post('verifyPasswordReset', { email: this.state.email, password: this.state.password, code: this.state.code })
    .then(rsp => {
      this.props.login(rsp.data.user)
      SecureStore.setItemAsync('token', rsp.data.token);
      this.setState({ loading: false, error: undefined })
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

  render(): JSX.Element {
    const { confirmation, password, loading, error } = this.state;

    return <Layout title='Reset Password'>
      { error ?
        <Text style={Styles.Error}>{error}</Text> : 
        <Text style={Styles.Label}>Enter a new password</Text>
      }

      <View style={Styles.InputContainer}>
        <TextInput
          secureTextEntry
          value={password}
          style={Styles.Input}
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

      <TouchableOpacity style={[Styles.Button, loading ? Styles.ButtonDisabled : {}]} onPress={this.onSubmit}>
        <Text style={Styles.ButtonText}>{loading ? 'Updating Password' : 'Update Password'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction} onPress={() => this.props.navigation.goBack()}>
        <Text style={Styles.SubActionText}>Go back</Text>
      </TouchableOpacity>
    </Layout>
  }
}

function mapDispatchToProps(dispatch: Function): any {
  return {
    login: (user: User) => dispatch(Login(user)),
  }
}

export default connect(null, mapDispatchToProps)(NewPasswordScreen);