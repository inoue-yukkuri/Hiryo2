import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BannerAd,
  BannerAdSize, TestIds, AdsConsent, AdsConsentStatus, AdsConsentDebugGeography,
// eslint-disable-next-line import/no-duplicates
} from 'react-native-google-mobile-ads';
// eslint-disable-next-line import/no-duplicates, no-unused-vars
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

import AppBar from './src/components/AppBar';
import InputScreen from './src/screens/InputScreen';
import OutputScreen from './src/screens/OutputScreen';

const Stack = createStackNavigator();

export default function App() {
  const [nonPersonalizedOnly, setNonPersonalizedOnly] = useState(true);

  useEffect(() => {
    const initializeAds = async () => {
      // Initialize the Google Mobile Ads SDK
      const adapterStatuses = await mobileAds().initialize();
      console.log(adapterStatuses);

      // Check for consent for EU users
      const consentInfo = await AdsConsent.requestInfoUpdate({
        debugGeography: AdsConsentDebugGeography.EEA, // EU圏としてテストする設定
        testDeviceIdentifiers: ["TEST-DEVICE-HASHED-ID"],
      });

      let { status } = consentInfo;
      if (consentInfo.isConsentFormAvailable && status === AdsConsentStatus.REQUIRED) {
        // 同意状態が必要な場合はダイアログを表示する
        const result = await AdsConsent.showForm();
        status = result.status;
      }

      if (status === AdsConsentStatus.OBTAINED) {
        // 同意が取得できた場合はNonPersonalizedOnlyをfalseにする(トラッキング取得する)
        setNonPersonalizedOnly(false);
      }
    };

    initializeAds();
  }, []);

  // eslint-disable-next-line no-undef
  const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-4189981999969719/2404908731';

  return (
    <NavigationContainer>
      <AppBar />
      <Stack.Navigator
        initialRouteName="Input"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="Output" component={OutputScreen} />
      </Stack.Navigator>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: nonPersonalizedOnly,
        }}
      />
    </NavigationContainer>
  );
}
