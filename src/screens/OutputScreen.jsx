import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Button, Image, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

function OutputScreen({ navigation, route }) { // propsをデストラクティング
  const items = route.params.selectedItems;
  const [values] = useState(['65.1', '4.7']);
  return (
    <View style={styles.container}>

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
            data={items.map((key, index) => ({ key, value: values[index] }))}
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
          <Button
            title="もう一度計算する"
            onPress={() => { navigation.navigate('Input'); }}
          />
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

OutputScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    // 他のメソッドやプロパティも追加できます
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      selectedItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
};

export default OutputScreen;
