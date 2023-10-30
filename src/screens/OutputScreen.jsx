import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, Alert,

} from 'react-native';
import axios from 'axios';
import PropTypes from 'prop-types';
import FieldSizeInput from '../components/FieldSizeInput';
import FertilizerUnitInput from '../components/FertilizerUnitInput';

function OutputScreen({ navigation, route }) { // propsをデストラクティング
  const selectHiryou = route.params.selectedHiryou;
  const selectYasai = route.params.selectedYasai;
  const [values, setValues] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [, setStatus] = useState('');
  const [imageSource, setimageSource] = useState(require('../../assets/23223480.jpg'));
  const [OptimalText, setOptimalText] = useState('unknown');

  const renderItem = ({ item }) => {
    // fieldSizeのlengthとwidthを掛け合わせた値を計算します
    const getMultiplier = (unit) => {
      switch (unit) {
        case 'm':
          return 1;
        case 'km':
          return 1000 * 1000;
        case 'cm':
          return 0.01 * 0.01;
        default:
          return 1;
      }
    };
    const multiplier = getMultiplier(fieldSize.unit);
    const area = multiplier * parseFloat(fieldSize.length) * parseFloat(fieldSize.width);
    // item.valueを面積で掛け算して新しい値を取得します
    const adjustedValue = parseFloat(item.value) * area;
    const unitConversionValue = fertilizerUnitConversionMap[fertilizerUnit] || 1;
    const finalValue = adjustedValue / unitConversionValue;

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.key]}>{item.key}</Text>
        <Text style={[styles.cell, styles.value]}>
          {finalValue.toFixed(1)}
          {' '}
          {fertilizerUnit}
        </Text>
      </View>
    );
  };
  console.log('selectYasai:', selectYasai);

  const [loading, setLoading] = useState(true);

  // 非同期計算関数
  const performCalculation = async () => {
    try {
      const response = await axios.post(
        'http://52.199.108.162:8000/hiryou_calc',
        {
          c_yasai: selectYasai,
          c_hiryou: selectHiryou,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );

      // レスポンスから必要な量を取得
      const newValues = response.data.result['必要な量'];
      const statusValue = response.data.result.status; // statusを取得
      const totalCostValue = response.data.result['総費用'];

      setValues(newValues);
      setStatus(statusValue); // statusをstateにセット
      setTotalCost(totalCostValue);

      // statusValueがOptimalでない場合、アラートを表示
      if (statusValue === 'Optimal') {
        Alert.alert('良い最適解が得られました！');
        setimageSource(require('../../assets/23167399.jpg'));
        setOptimalText('良い精度の最適解が得られました！');
      } else if (newValues.some((value) => value > 0)) {
        Alert.alert('最適解が得られました！');
        setimageSource(require('../../assets/23223480.jpg'));
        setOptimalText('最適解が得られました。');
      } else {
        Alert.alert('最適解が得られませんでした…');
        setimageSource(require('../../assets/24345980.jpg'));
        setOptimalText('最適解が得られませんでした…肥料の組み合わせを変えて計算し直すことをおすすめします');
      }

      console.log('API response:', response.data);
    } catch (error) {
      console.error('API request error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performCalculation();
  }, []);

  const [fieldSize, setFieldSize] = useState({
    length: '1.0',
    width: '1.0',
    unit: 'm',
  });

  const getAreaUnit = (unit) => {
    switch (unit) {
      case 'm':
        return '㎡';
      case 'cm':
        return '㎠';
      case 'km':
        return '㎢';
      default:
        return '㎡'; // デフォルトは '㎡' とする（必要に応じて変更できます）
    }
  };

  const [fertilizerUnit, setFertilizerUnit] = useState('握り(片手)');

  const fertilizerUnitConversionMap = {
    g: 1,
    kg: 1000,
    t: 1000000,
    '握り(片手)': 30,
  };

  return (
    <ScrollView style={styles.container}>
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
                source={imageSource}
                style={{ width: 100, height: 100 }}
              />
            </View>
            <Text style={styles.NotsectionText}>
              {OptimalText}
            </Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                肥料の最適な配分【
                {selectYasai}
                】
              </Text>

              {/* Table header */}
              <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>肥料名</Text>
                <Text style={[styles.cell, styles.header]}>
                  {(parseFloat(fieldSize.length) * parseFloat(fieldSize.width)).toFixed(1)}
                  {getAreaUnit(fieldSize.unit)}
                  に必要な量
                </Text>
              </View>

              {/* Table content */}
              <FlatList
                data={selectHiryou.map((key, index) => ({ key, value: values[index] }))}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatlist}
                scrollEnabled={false} // ここを追加
                showsVerticalScrollIndicator={false} // ここを追加
              />
              <Text style={styles.totalCostText}>
                計算結果は
                {(parseFloat(fieldSize.length) * parseFloat(fieldSize.width)).toFixed(1)}
                {getAreaUnit(fieldSize.unit)}
                にまく必要がある各肥料の重さです
              </Text>
              <Text style={styles.totalCostText}>
                予想される総費用は約
                {parseFloat(totalCost).toFixed(1)}
                円になります
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={() => { navigation.navigate('Input'); }}
              >
                <Text style={styles.calculateButtonText}>もう一度計算する</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>※こちらで追加条件を上の表に反映させられます</Text>
              <Text>畑の縦と横の長さ</Text>
              <Text style={{ color: '#808080' }}>※面積がわかっている場合(1×面積、例:20㎡の場合、1m×20m)</Text>
              <FieldSizeInput
                length={fieldSize.length}
                width={fieldSize.width}
                unit={fieldSize.unit}
                setLength={(val) => setFieldSize((prev) => ({ ...prev, length: val }))}
                setWidth={(val) => setFieldSize((prev) => ({ ...prev, width: val }))}
                setUnit={(val) => setFieldSize((prev) => ({ ...prev, unit: val }))}
              />
              <Text>出力される肥料の単位</Text>
              <FertilizerUnitInput onUnitSelected={setFertilizerUnit} />
            </View>

          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingBottom: 80,
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
  NotsectionText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
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
    marginTop: 100,
  },
  calculateButton: {
    backgroundColor: '#00BFFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalCostText: {
    fontSize: 14,
    marginTop: 10, // 余白を追加
    color: 'grey',
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
