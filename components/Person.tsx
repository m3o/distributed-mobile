import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { Colors, Fonts } from "../globalStyles";
import { User } from "../store/user";

export default function Person(props: { user: User, styles?: any }): JSX.Element {
  const { first_name, last_name } = props.user;
  const initials = `${first_name?.slice(0,1)}${last_name?.slice(0,1)}`

  return <View style={[styles.container, props.styles || {}]}>
    <Text style={styles.text}>{initials}</Text>
  </View>
}

const styles= StyleSheet.create({
  container: {
    height: 30,
    width: 30,
    marginLeft: -15,
    borderRadius: 15,
    borderColor: Colors.White,
    borderWidth: 1,  
    backgroundColor: "#e8e0da",
  }, 
  text: {
    color: "#a38b7b",
    fontFamily: Fonts.Bold,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignSelf: 'center',
    fontSize: 11,
  }
})