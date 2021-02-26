import React, { createRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import Layout, { Styles } from './Layout';

interface Props {
  route: RouteProp<any, any>
  navigation: NavigationProp<{}>
}

interface State {
  confirmation: string;
  password: string;
  loading: boolean;
  error?: string;
}

export default class NewPasswordScreen extends React.Component<Props,State> {
  readonly confirmationInput: React.RefObject<TextInput>;
  
  constructor(props: Props) {
    super(props);
    this.state = { confirmation: '', password: '', loading: false };
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