// CustomSelect.js

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, FlatList,
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
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectBox} onPress={() => setModalVisible(true)}>
        <Text>{selectedValue.label}</Text>
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
              keyExtractor={(item) => item.value.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

CustomSelect.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
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
});
