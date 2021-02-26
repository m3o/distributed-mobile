import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet, Image, ImageSourcePropType, TouchableOpacity, Dimensions } from 'react-native';
import Person1 from '../../assets/person1.png';
import Person2 from '../../assets/person2.png';
import Person3 from '../../assets/person3.png';
import Person4 from '../../assets/person4.png';
import { Fonts } from '../../globalStyles';

interface Props {
  navigation: NavigationProp<{}>
}

const { width } = Dimensions.get('screen');

export default class Video extends React.Component<Props> {
  render(): JSX.Element {
    return <ScrollView>
      <View style={styles.container}>
        { this.renderPerson('John', Person1)}
        { this.renderPerson('Amy', Person2)}
        { this.renderPerson('Louise', Person3)}
        { this.renderPerson('Jeanette', Person4)}
      </View>
    </ScrollView>
  }

  renderPerson(name: string, imgSrc: ImageSourcePropType): JSX.Element {
    const onPress = () => this.props.navigation.navigate('Chat', { title: name })

    return <TouchableOpacity onPress={onPress} style={styles.person}>
      <Image style={styles.image} source={imgSrc} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  person: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  image: {
    width: width / 3.8,
    height: width / 3.8,
  },
  name: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  }
})