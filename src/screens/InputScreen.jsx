import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Button, Image,
} from 'react-native';
import CustomSelect from '../components/CustomSelect';
import MultiSelectBox from '../components/MultiSelectBox';
import { hiryou, vegetables } from '../components/data';

export default function InputScreen(props) {
  const { navigation } = props;
  const [, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const handleSelectionChange = (items) => {
    setSelectedItems(items);
  };

  return (
    <View style={styles.container}>

      {/* <InputSample>出力</InputSample> */}

      <View style={styles.incontainer}>

        <View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1.植えたい野菜を選んでください</Text>
            <CustomSelect
              data={vegetables}
              onSelect={(item) => setSelectedItem(item)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2.使用できる肥料を選んでください</Text>
            <MultiSelectBox
              options={hiryou}
              onSelectionChange={handleSelectionChange}
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
          <Button
            title="計算"
            onPress={() => { navigation.navigate('Output', { selectedItems }); }}
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
});
