import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar';
import InputSample from '../components/InputSample';

export default function InputScreen() {
  return (
    <View style={styles.container}>

      <AppBar />
      <InputSample>出力</InputSample>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
});
