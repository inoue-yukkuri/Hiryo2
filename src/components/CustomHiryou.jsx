import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet, FlatList, Modal, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_HIRYOU_KEY = 'customHiryou';

function CustomHiryou({ navigation }) {
  const [customHiryou, setCustomHiryou] = useState({
    hiryou: [],
    Price: [],
    N: [],
    P: [],
    K: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [newHiryou, setNewHiryou] = useState({
    hiryou: '', Price: '', N: '', P: '', K: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    loadHiryouData();
  }, []);

  const loadHiryouData = async () => {
    try {
      const hiryouData = await AsyncStorage.getItem(CUSTOM_HIRYOU_KEY);
      if (hiryouData) setCustomHiryou(JSON.parse(hiryouData));
    } catch (error) {
      console.error(error);
    }
  };

  const addHiryouData = async () => {
    let updatedHiryou = { ...customHiryou };

    if (editingIndex !== null) {
      updatedHiryou.N[editingIndex] = parseFloat(newHiryou.N);
      updatedHiryou.P[editingIndex] = parseFloat(newHiryou.P);
      updatedHiryou.K[editingIndex] = parseFloat(newHiryou.K);
      updatedHiryou.Price[editingIndex] = parseFloat(newHiryou.Price);
    } else {
      updatedHiryou = {
        hiryou: [...customHiryou.hiryou, newHiryou.hiryou],
        Price: [...customHiryou.Price, parseFloat(newHiryou.Price)],
        N: [...customHiryou.N, parseFloat(newHiryou.N)],
        P: [...customHiryou.P, parseFloat(newHiryou.P)],
        K: [...customHiryou.K, parseFloat(newHiryou.K)],
      };
    }

    try {
      const jsonData = JSON.stringify(updatedHiryou);
      await AsyncStorage.setItem(CUSTOM_HIRYOU_KEY, jsonData);
      setCustomHiryou(updatedHiryou);
      setModalVisible(false);
      setEditingIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteItem = async () => {
    if (editingIndex !== null) {
      customHiryou.hiryou.splice(editingIndex, 1);
      customHiryou.N.splice(editingIndex, 1);
      customHiryou.P.splice(editingIndex, 1);
      customHiryou.K.splice(editingIndex, 1);
      customHiryou.Price.splice(editingIndex, 1);

      try {
        const jsonData = JSON.stringify(customHiryou);
        await AsyncStorage.setItem(CUSTOM_HIRYOU_KEY, jsonData);
        setCustomHiryou({ ...customHiryou });
        setModalVisible(false);
        setEditingIndex(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onEditItem = (index) => {
    setNewHiryou({
      hiryou: customHiryou.hiryou[index],
      N: customHiryou.N[index] ? customHiryou.N[index].toString() : '0',
      P: customHiryou.P[index] ? customHiryou.P[index].toString() : '0',
      K: customHiryou.K[index] ? customHiryou.K[index].toString() : '0',
      Price: customHiryou.Price[index] ? customHiryou.Price[index].toString() : '0',
    });
    setEditingIndex(index);
    setModalVisible(true);
  };

  const renderHiryouItem = ({ item, index }) => (
    <TouchableOpacity style={styles.row} onPress={() => onEditItem(index)}>
      <Text style={[styles.cell, styles.key]}>{item}</Text>
      <Text style={[styles.cell, styles.value]}>
        {customHiryou.Price[index]}
        {' '}
        円/g
      </Text>
      <Text style={[styles.cell, styles.value]}>
        {customHiryou.N[index]}
        {' '}
        %
      </Text>
      <Text style={[styles.cell, styles.value]}>
        {customHiryou.P[index]}
        {' '}
        %
      </Text>
      <Text style={[styles.cell, styles.value]}>
        {customHiryou.K[index]}
        {' '}
        %
      </Text>
    </TouchableOpacity>
  );

  const renderHiryouHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.keyHeader]}>名前</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>価格</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>N (%)</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>P (%)</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>K (%)</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>カスタム肥料データ</Text>
      {renderHiryouHeader()}
      <FlatList
        data={customHiryou.hiryou}
        renderItem={renderHiryouItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title="新しい肥料を登録する"
        onPress={() => {
          setEditingIndex(null);
          setNewHiryou({
            hiryou: '', Price: '', N: '', P: '', K: '',
          });
          setModalVisible(true);
        }}
      />
      <Button
        title="計算画面に戻る"
        onPress={() => { navigation.navigate('Input'); }}
      />

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text>肥料の名前</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewHiryou({ ...newHiryou, hiryou: text })}
            value={newHiryou.hiryou}
            placeholder="肥料の名前"
          />
          <Text>価格(円/g)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewHiryou({ ...newHiryou, Price: text })}
            value={newHiryou.Price}
            placeholder="単位は(円/g)で入力してください"
          />
          <Text>窒素N(%)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewHiryou({ ...newHiryou, N: text })}
            value={newHiryou.N}
            placeholder="窒素N"
          />
          <Text>リンP(%)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewHiryou({ ...newHiryou, P: text })}
            value={newHiryou.P}
            placeholder="リンP"
          />
          <Text>カリウムK(%)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setNewHiryou({ ...newHiryou, K: text })}
            value={newHiryou.K}
            placeholder="カリウムK"
          />
          <Button title="登録" onPress={addHiryouData} />
          {editingIndex !== null && (
            <Button title="削除" onPress={onDeleteItem} color="red" />
          )}
          <Button title="キャンセル" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    margin: 5,
    minWidth: 50,
    textAlign: 'center',
  },
  modalView: {
    marginTop: 200,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    margin: 5,
    minWidth: 50,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  keyHeader: {
    flex: 2, // 名前カラムを他のカラムより広くする
  },
  valueHeader: {
    flex: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    width: '95%',
  },
});

export default CustomHiryou;
