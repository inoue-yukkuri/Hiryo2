import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  const handlePress = () => {
    // ここで何らかの処理を行い、setOutputValueを使用して出力値を設定できます。
    setOutputValue(inputValue); // 今回は入力値をそのまま出力として使用します。
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <View style={styles.appbarInnner}>
          <Text style={styles.appbarTitle}>肥料の最適くん</Text>
          <Text style={styles.appbarRight}>ログアウト</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="数値を入力"
          keyboardType="numeric"
        />
        <Button title="送信" onPress={handlePress} />
      </View>

      <View style={styles.outputContainer}>
        <Text>出力: {outputValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  appbar: {
    width: '100%',
    height: 104,
    backgroundColor: '#467FD3',
    justifyContent: 'flex-end',
  },
  appbarInnner: {
    alignItems: 'center',
  },
  appbarRight: {
    position: 'absolute',
    right: 19,
    bottom: 8,
    color: 'rgba(255,255,255,0.8)',
  },
  appbarTitle: {
    marginBottom: 8,
    fontSize: 24,
    lineHeight: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
  },
  outputContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});
