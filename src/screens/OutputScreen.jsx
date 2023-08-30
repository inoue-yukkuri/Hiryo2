/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator,

} from 'react-native';
import PropTypes from 'prop-types';
import LPsolver from '../components/LpSolver';

function OutputScreen({ navigation, route }) { // propsをデストラクティング
  const selectHiryou = route.params.selectedHiryou;
  const selectYasai = route.params.selectedYasai;
  const [values, setValues] = useState([]);
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.key]}>{item.key}</Text>
      <Text style={[styles.cell, styles.value]}>{item.value}</Text>
    </View>
  );
  console.log('selectYasai:', selectYasai);
  const [loading, setLoading] = useState(true);

  // 仮の非同期計算関数
  const performCalculation = async () => {
    // 例として1秒後に計算が完了したとする。
    LPsolver();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setValues(['65.1', '4.7']);
    setLoading(false);
  };

  useEffect(() => {
    performCalculation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>計算しています...</Text>
        </View>
      ) : (
        // データが読み込まれたら、以前のコンポーネントの内容を表示します
        <View style={styles.incontainer}>

          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/23223480.jpg')}
              style={{ width: 100, height: 100 }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              肥料の最適な配分(
              {selectYasai}
              )
            </Text>

            {/* Table header */}
            <View style={styles.row}>
              <Text style={[styles.cell, styles.header]}>肥料名</Text>
              <Text style={[styles.cell, styles.header]}>1.0㎡に必要な量</Text>
            </View>

            {/* Table content */}
            <FlatList
              data={selectHiryou.map((key, index) => ({ key, value: values[index] }))}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatlist} // このスタイルを追加
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="もう一度計算する"
              onPress={() => { navigation.navigate('Input'); }}
            />
          </View>
        </View>
      )}
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
  flatlist: {
    maxHeight: 500, // 8項目分の高さ。1項目が17 (8+8+1(border)) であると仮定
  },
  scrollIndicator: {
    textAlign: 'center',
    padding: 5,
    color: '#888',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

OutputScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    // 他のメソッドやプロパティも追加できます
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      selectedHiryou: PropTypes.arrayOf(PropTypes.string).isRequired,
      selectedYasai: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default OutputScreen;
