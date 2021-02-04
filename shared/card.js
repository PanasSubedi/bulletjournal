import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Card(props){
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {props.children}
      </View>
    </View>
  )
}

const styles=StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderColor: '#ddd',
    borderBottomWidth: 1
  },
  cardContent: {
    marginHorizontal: 13,
    marginVertical: 10,
  }
})
