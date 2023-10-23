import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
} from 'react-native';
import CustomSelect from '../components/CustomSelect';
import MultiSelectBox from '../components/MultiSelectBox';
import { hiryou, vegetables } from '../components/data';
// import FieldSizeInput from '../components/FieldSizeInput';
// import FertilizerUnitInput from '../components/FertilizerUnitInput';

export default function InputScreen(props) {
  const { navigation } = props;
  const [selectedYasai, setSelectedYasai] = useState('きゅうり');
  const [selectedHiryou, setSelectedHiryou] = useState([]);
  const handleSelectionChange = (items) => {
    setSelectedHiryou(items);
  };

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
                  navigation.navigate('Output', { selectedHiryou, selectedYasai });
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
