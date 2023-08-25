import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Image,
} from 'react-native';
import PropTypes from 'prop-types';

export default function CustomSelect({ data, onSelect }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(data[0]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedValue(item);
        setModalVisible(false);
        onSelect(item);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectBox} onPress={() => setModalVisible(true)}>
        <View style={styles.selectedItemContainer}>
          <Text>{selectedValue}</Text>
          <Image
            source={require('../../assets/down-arrow_icon-icons.com_73047.png')}
            style={styles.dropdownIcon}
          />
        </View>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.listContainer}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

CustomSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listContainer: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedItemContainer: {
    flexDirection: 'row', // 横方向にアイテムを並べます
    alignItems: 'center', // アイテムを中央に配置します
    justifyContent: 'space-between', // アイテムと画像の間にスペースを作ります
  },
  dropdownIcon: {
    width: 15, // 画像の幅（必要に応じて調整してください）
    height: 15, // 画像の高さ（必要に応じて調整してください）
    marginLeft: 10, // 画像とテキストの間のスペース
  },
});
