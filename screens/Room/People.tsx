import React from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Fonts } from '../../globalStyles';
import { Group } from '../../store/groups';

interface Props {
  group: Group;
  navigation: NavigationProp<{}>
}

interface State {
  refreshing: boolean;
}

export default class People extends React.Component<Props, State> {
  render() {
    console.log("XXX",this.props.group.members)
    const onPress = (user_id: string) => this.props.navigation.navigate('Chat', { group_id: this.props.group.id, user_id })

    return <ScrollView style={styles.container}>
      { this.props.group.members?.map((m,i) => {
        return <TouchableOpacity onPress={() => onPress(m.id)} style={[styles.row, { borderTopWidth: i === 0 ? 1 : 0 }]}>
          <Text style={styles.rowTitle}>{m.first_name} {m.last_name}</Text>
        </TouchableOpacity>
      })}
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