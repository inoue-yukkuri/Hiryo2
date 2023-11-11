import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
} from 'react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomSelect from '../components/CustomSelect';
import MultiSelectBox from '../components/MultiSelectBox';
import { hiryou, vegetables } from '../components/data';
// import FieldSizeInput from '../components/FieldSizeInput';
// import FertilizerUnitInput from '../components/FertilizerUnitInput';

// eslint-disable-next-line no-undef
const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-4189981999969719/6208422377';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const MAX_FREE_CALCULATIONS_PER_DAY = 5;
const LAST_USED_DATE_KEY = 'lastUsedDate';
const CALCULATION_COUNTER_KEY = 'calculationCounter';

export default function InputScreen(props) {
  const { navigation } = props;
  const [selectedYasai, setSelectedYasai] = useState('きゅうり');
  const [selectedHiryou, setSelectedHiryou] = useState([]);
  const handleSelectionChange = (items) => {
    setSelectedHiryou(items);
  };
  const [calculationCounter, setCalculationCounter] = useState(0);

  useEffect(() => {
    // アプリ起動時に最後に使用した日付と計算回数を取得
    const initializeCounter = async () => {
      const lastUsedDate = await AsyncStorage.getItem(LAST_USED_DATE_KEY);
      const today = new Date().toISOString().split('T')[0];
      if (lastUsedDate === today) {
        // 同じ日付であれば、計算回数を取得
        const counterString = await AsyncStorage.getItem(CALCULATION_COUNTER_KEY);
        setCalculationCounter(parseInt(counterString, 10) || 0);
      } else {
        // 新しい日付であれば、カウンタをリセット
        await AsyncStorage.setItem(LAST_USED_DATE_KEY, today);
        setCalculationCounter(0);
        await AsyncStorage.setItem(CALCULATION_COUNTER_KEY, '0');
      }
    };
    initializeCounter();
  }, []);

  const navigateToOutputScreen = async () => {
    // 移動回数を増やす
    const newCounter = calculationCounter + 1;
    setCalculationCounter(newCounter);
    await AsyncStorage.setItem(CALCULATION_COUNTER_KEY, newCounter.toString());

    if (newCounter > MAX_FREE_CALCULATIONS_PER_DAY) {
      // リワード広告を表示
      rewarded.show();
      setCalculationCounter(0);
      navigation.navigate('Output', { selectedHiryou, selectedYasai });
    } else {
      // 通常の画面遷移
      navigation.navigate('Output', { selectedHiryou, selectedYasai });
    }
  };

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
      // rewarded.show();
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('User earned reward of ', reward);
        // rewarded.load();
        setLoaded(false);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // 広告をロードする関数
  const loadAd = () => {
    if (!loaded) {
      rewarded.load();
    }
  };

  // 画面がフォーカスされた時に広告を再ロード
  useFocusEffect(
    React.useCallback(() => {
      loadAd();
      // ここに依存配列として 'loaded' ステートを指定します
    }, [loaded]),
  );

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>

        <View style={styles.incontainer}>

          <View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1.植えたい野菜を選んでください</Text>
              <CustomSelect
                data={vegetables}
                onSelect={(item) => setSelectedYasai(item)}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2.使用できる肥料を複数選んでください</Text>
              <MultiSelectBox
                options={hiryou}
                onSelectionChange={handleSelectionChange}
              />

            </View>

            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>3.畑の縦と横の長さを教えてください</Text>
              <FieldSizeInput />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4.出力される肥料の単位を選んでください</Text>
              <FertilizerUnitInput />
            </View> */}

          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3.計算ボタンを押してください</Text>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/23223480.jpg')}
                style={{ width: 100, height: 100 }}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={() => {
                  navigateToOutputScreen();
                }}
              >
                <Text style={styles.calculateButtonText}>計算</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
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
});
