import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Button, StyleSheet, FlatList, Modal, ScrollView,
  TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_YASAI_KEY = 'customYasai';

function CustomYasai({ navigation }) {
  const scrollViewRef = useRef();
  const [customYasai, setCustomYasai] = useState({
    yasai: [],
    N: [],
    P: [],
    K: [],
    W: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [newYasai, setNewYasai] = useState({
    yasai: '', N: '', P: '', K: '', W: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    loadYasaiData();
  }, []);

  const loadYasaiData = async () => {
    try {
      const yasaiData = await AsyncStorage.getItem(CUSTOM_YASAI_KEY);
      if (yasaiData) setCustomYasai(JSON.parse(yasaiData));
    } catch (error) {
      console.error(error);
    }
  };

  const addYasaiData = async () => {
    // 入力検証
    if (!newYasai.yasai.trim()) {
      Alert.alert('野菜の名前を入力してください。');
      return;
    }

    const n = parseFloat(newYasai.N);
    const p = parseFloat(newYasai.P);
    const k = parseFloat(newYasai.K);
    const w = parseFloat(newYasai.W);

    // eslint-disable-next-line max-len
    if (Number.isNaN(n) || n < 0 || Number.isNaN(p) || p < 0 || Number.isNaN(k) || k < 0 || Number.isNaN(w) || w < 0) {
      Alert.alert('N, P, K, Wの値は正の数でなければなりません。');
      return;
    }

    // 既存のデータを更新または新しいデータを追加
    if (editingIndex !== null) {
      customYasai.N[editingIndex] = n;
      customYasai.P[editingIndex] = p;
      customYasai.K[editingIndex] = k;
      customYasai.W[editingIndex] = w;
    } else {
      customYasai.yasai.push(newYasai.yasai);
      customYasai.N.push(n);
      customYasai.P.push(p);
      customYasai.K.push(k);
      customYasai.W.push(w);
    }

    try {
      const jsonData = JSON.stringify(customYasai);
      await AsyncStorage.setItem(CUSTOM_YASAI_KEY, jsonData);
      setCustomYasai({ ...customYasai });
      setModalVisible(false);
      setEditingIndex(null);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteItem = async () => {
    if (editingIndex !== null) {
      customYasai.yasai.splice(editingIndex, 1);
      customYasai.N.splice(editingIndex, 1);
      customYasai.P.splice(editingIndex, 1);
      customYasai.K.splice(editingIndex, 1);
      customYasai.W.splice(editingIndex, 1);

      try {
        const jsonData = JSON.stringify(customYasai);
        await AsyncStorage.setItem(CUSTOM_YASAI_KEY, jsonData);
        setCustomYasai({ ...customYasai });
        setModalVisible(false);
        setEditingIndex(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onEditItem = (index) => {
    setNewYasai({
      yasai: customYasai.yasai[index],
      N: customYasai.N[index] ? customYasai.N[index].toString() : '0',
      P: customYasai.P[index] ? customYasai.P[index].toString() : '0',
      K: customYasai.K[index] ? customYasai.K[index].toString() : '0',
      W: customYasai.W[index] ? customYasai.W[index].toString() : '0',
    });
    setEditingIndex(index);
    setModalVisible(true);
  };

  const renderYasaiItem = ({ item, index }) => (
    <TouchableOpacity style={styles.row} onPress={() => onEditItem(index)}>
      <Text style={[styles.cell, styles.key]}>{item}</Text>
      <Text style={[styles.cell, styles.value]}>
        {customYasai.N[index]}
        {' '}
        g/㎡
      </Text>
      <Text style={[styles.cell, styles.value]}>
        {customYasai.P[index]}
        {' '}
        g/㎡
      </Text>
      <Text style={[styles.cell, styles.value]}>
        {customYasai.K[index]}
        {' '}
        g/㎡
      </Text>
      <Text style={[styles.cell, styles.value]}>
        {customYasai.W[index]}
        {' '}
        g/㎡
      </Text>
    </TouchableOpacity>
  );

  const renderYasaiHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.keyHeader]}>名前</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>N (g/㎡)</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>P (g/㎡)</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>K (g/㎡)</Text>
      <Text style={[styles.headerCell, styles.valueHeader]}>W (g/㎡)</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>カスタム野菜データ</Text>
      {renderYasaiHeader()}
      <FlatList
        data={customYasai.yasai}
        renderItem={renderYasaiItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title="新しい野菜を登録する"
        onPress={() => {
          setEditingIndex(null);
          setNewYasai({
            yasai: '', N: '', P: '', K: '', W: '',
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalView}>
            <ScrollView
              ref={scrollViewRef}
              keyboardShouldPersistTaps="handled"
            >
              <Text>野菜の名前</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewYasai({ ...newYasai, yasai: text })}
                value={newYasai.yasai}
                placeholder="野菜の名前"
                onFocus={() => {
                  // TextInputの位置にスクロールする
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }}
              />
              <Text>窒素N(g/㎡)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewYasai({ ...newYasai, N: text })}
                value={newYasai.N}
                placeholder="窒素N"
                onFocus={() => {
                  // TextInputの位置にスクロールする
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }}
                keyboardType="numeric"
              />
              <Text>リンP(g/㎡)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewYasai({ ...newYasai, P: text })}
                value={newYasai.P}
                placeholder="リンP"
                onFocus={() => {
                  // TextInputの位置にスクロールする
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }}
                keyboardType="numeric"
              />
              <Text>カリウムK(g/㎡)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewYasai({ ...newYasai, K: text })}
                value={newYasai.K}
                placeholder="カリウムK"
                onFocus={() => {
                  // TextInputの位置にスクロールする
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }}
                keyboardType="numeric"
              />
              <Text>有機質量(g/㎡)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewYasai({ ...newYasai, W: text })}
                value={newYasai.W}
                placeholder="2000が標準です"
                onFocus={() => {
                  // TextInputの位置にスクロールする
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }}
                keyboardType="numeric"
              />
              <Button title="登録" onPress={addYasaiData} />
              {editingIndex !== null && (
                <Button title="削除" onPress={onDeleteItem} color="red" />
              )}
              <Button title="キャンセル" onPress={() => setModalVisible(false)} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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

export default CustomYasai;
