import React, { useState, alert } from 'react';
import {
  View, Text, StyleSheet, Button, Image,
} from 'react-native';
import AppBar from '../components/AppBar';
import CustomSelect from '../components/CustomSelect';
import MultiSelectBox from '../components/MultiSelectBox';

export default function InputScreen() {
  const [, setSelectedItem] = useState(null);
  return (
    <View style={styles.container}>

      <AppBar />
      {/* <InputSample>出力</InputSample> */}

      <View style={styles.incontainer}>

        <View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1.植えたい野菜を選んでください</Text>
            <CustomSelect
              data={[
                { label: 'Java', value: 'java' },
                { label: 'JavaScript', value: 'js' },
                { label: 'TypeScript', value: 'ts' },
              ]}
              onSelect={(item) => setSelectedItem(item)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2.使用できる肥料を選んでください</Text>
            {/* kon */}
            <MultiSelectBox
              options={[
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
                // 他のオプションを追加する場合はこちらに
              ]}
            />
          </View>

        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/23223480.jpg')}
            style={{ width: 100, height: 100 }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="計算" onPress={alert} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  incontainer: {
    paddingHorizontal: 15,
  },
  section: {
    marginVertical: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 3, // for Android
    shadowOffset: { width: 1, height: 1 }, // for iOS
    shadowRadius: 2, // for iOS
    shadowOpacity: 0.3, // for iOS
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
