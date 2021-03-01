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
}

export default class SignupScreen extends React.Component<Props,State> {
  readonly lastNameInput: React.RefObject<TextInput>;
  readonly emailInput: React.RefObject<TextInput>;
  
  constructor(props: Props) {
    super(props);
    this.state = { email: props.route.params?.email || '', firstName: '', lastName: '' };
    this.lastNameInput = createRef<TextInput>();
    this.emailInput = createRef<TextInput>();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    if(!this.valid()) return;
    this.props.navigation.navigate('SignupPassword', this.state)
  }

  valid(): boolean {
    if(!this.state.email.length) return false;
    if(!this.state.firstName.length) return false;
    if(!this.state.lastName.length) return false;
    return true
  }

  render(): JSX.Element {
    const { email, firstName, lastName } = this.state;

    return <Layout title='Signup to Distributed'>
      <View style={Styles.InputContainer}>
        <TextInput
          value={firstName}
          autoCorrect={false}
          autoCapitalize={'words'}
          placeholder='First name'
          returnKeyType='next'
          style={[Styles.Input, {borderBottomWidth: 1}]} 
          onChangeText={firstName => this.setState({ firstName })}
          onEndEditing={() => this.lastNameInput.current?.focus()} />

        <TextInput
          value={lastName}
          autoCorrect={false}
          autoCapitalize={'words'}
          placeholder='Last name'
          returnKeyType='next'
          style={[Styles.Input, {borderBottomWidth: 1}]} 
          onChangeText={lastName => this.setState({ lastName })}
          onEndEditing={() => this.emailInput.current?.focus()} />

        <TextInput
          value={email}
          autoCorrect={false} 
          autoCapitalize={'none'}
          placeholder='Email'
          keyboardType='email-address'
          returnKeyType='next'
          ref={this.emailInput}
          style={[Styles.Input, {borderBottomWidth: 1}]} 
          onChangeText={email => this.setState({ email })}
          onEndEditing={this.onSubmit} />
      </View>

      <TouchableOpacity disabled={!this.valid()} style={[Styles.Button, this.valid() ? {} : Styles.ButtonDisabled]} onPress={this.onSubmit}>
        <Text style={Styles.ButtonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.SubAction} onPress={() => this.props.navigation.goBack()}>
        <Text style={Styles.SubActionText}>Already have an account?</Text>
      </TouchableOpacity>
    </Layout>
  }
}