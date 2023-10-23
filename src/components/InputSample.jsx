import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, Button,
} from 'react-native';

export default function InputSample(props) {
  const { children } = props;
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  const handlePress = () => {
    // ここで何らかの処理を行い、setOutputValueを使用して出力値を設定できます。
    setOutputValue(inputValue); // 今回は入力値をそのまま出力として使用します。
  };
  return (
    <View>
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
        <Text>
          {children}
          :
          {outputValue}
        </Text>
      </View>
    </View>
  );
}

InputSample.propTypes = {
  children: String.isRequired,
};

const styles = StyleSheet.create({
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
