import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Fonts } from '../../globalStyles';

interface Props {
  navigation: NavigationProp<{}>
}

interface State {
  refreshing: boolean;
}

export default class People extends React.Component<Props, State> {
  render() {
    const onPress = (title: string) => this.props.navigation.navigate('Chat', { title })

    return <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => onPress('Asim Aslam')} style={[styles.row, { borderTopWidth: 1 }]}>
        <Text style={styles.rowTitle}>Asim Aslam</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress('Dom Wong')} style={styles.row}>
        <Text style={styles.rowTitle}>Dom Wong</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress('János Dobronszki')} style={styles.row}>
        <Text style={styles.rowTitle}>János Dobronszki</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onPress('Chris H')} style={styles.row}>
        <Text style={styles.rowTitle}>Chris H</Text>
      </TouchableOpacity>
    </ScrollView>
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    backgroundColor: Colors.White,
    borderColor: Colors.Border,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    minHeight: 44,
    flexDirection: 'column',
  },
  rowTitle: {
    fontFamily: Fonts.Medium,
    color: Colors.Black,
    fontSize: 17,
  },
})