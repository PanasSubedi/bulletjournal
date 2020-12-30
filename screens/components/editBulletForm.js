import React, { useState } from 'react';

import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function editBulletForm({ bulletObject, handleButtonPress, addEditText }){

  const [bullet, setBullet] = useState(bulletObject.bullet);

  const handleSubmit = () => {
    handleButtonPress({
      id: bulletObject.id,
      bullet: bullet
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>{addEditText} Form</Text>
      <TextInput
        multiline
        style={styles.input}
        placeholder="Bullet"
        onChangeText={value => setBullet(value)}
        value={bullet}
      />

      <Button
        style={styles.button}
        onPress={handleSubmit}
        title={addEditText}
      />
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  formTitle: {
    fontSize: 25
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 15,
    fontSize: 16,
    borderRadius: 6,
  }
});
