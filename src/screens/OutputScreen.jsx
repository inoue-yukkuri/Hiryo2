import React, { useState, alert } from 'react';
import {
  View, Text, StyleSheet, Button, Image, FlatList,
} from 'react-native';
import AppBar from '../components/AppBar';

export default function OutputScreen() {
  const [data, setData] = useState([
    { key: '牛ふん', value: '65.1' },
    { key: '化学肥料(8-8-8)', value: '4.7' },
    // ... 他のデータ
  ]);

  return (
    <View style={styles.container}>

      <AppBar />
      {/* <InputSample>出力</InputSample> */}

      <View style={styles.incontainer}>

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/23223480.jpg')}
            style={{ width: 100, height: 100 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>肥料の最適な配分</Text>
          {/* Table header */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>肥料名</Text>
            <Text style={[styles.cell, styles.header]}>1.0㎡に必要な量</Text>
          </View>

          {/* Table content */}
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={[styles.cell, styles.key]}>{item.key}</Text>
                <Text style={[styles.cell, styles.value]}>{item.value}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="もう一度計算する" onPress={alert} />
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
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  key: {
    // スタイルを追加できます
  },
  value: {
    // スタイルを追加できます
  },
});
