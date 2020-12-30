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
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 25,
    marginVertical: 12,
    paddingVertical: 10
  },
  cardContent: {
    marginHorizontal: 13,
    marginVertical: 10,
  }
})
