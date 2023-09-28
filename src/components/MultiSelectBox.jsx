import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Button, ScrollView, Image,
} from 'react-native';
import PropTypes from 'prop-types';

function MultiSelectBox({ options, onSelectionChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([
    '牛ふん堆肥',
    '発酵鶏ふん',
    '骨粉',
    '化成肥料(8-8-8)',
    'もみ殻',
    '魚粉',
  ]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems]);

  const toggleItem = (item) => {
    setSelectedItems((prevItems) => {
      const newItems = prevItems.includes(item)
        ? prevItems.filter((i) => i !== item)
        : [...prevItems, item];

      if (onSelectionChange) {
        onSelectionChange(newItems);
      }

      return newItems;
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, selectedItems.includes(item) ? styles.selectedItem : {}]}
      onPress={() => toggleItem(item)}
    >
      <Text style={selectedItems.includes(item) ? styles.selectedItemText : {}}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectBox} onPress={() => setModalVisible(true)}>
        <Text>タップして選択できます→</Text>
        <Image source={require('../../assets/down-arrow_icon-icons.com_73047.png')} style={{ width: 15, height: 15 }} />
      </TouchableOpacity>
      <Text style={{ color: '#808080' }}>※現在、下記の肥料が選択されています</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectedItemsContainer}
      >
        {selectedItems.map((item) => (
          <View style={styles.selectedTag} key={item}>
            <Text style={styles.selectedTagText}>{item}</Text>
          </View>
        ))}
      </ScrollView>

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
              data={options}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              nestedScrollEnabled
            />
            <Button title="OK" onPress={() => setModalVisible(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

MultiSelectBox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func,
};

MultiSelectBox.defaultProps = {
  onSelectionChange: () => {},
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 4,
  },
  selectedItemsContainer: {
    maxHeight: 150,
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listContainer: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedItem: {
    backgroundColor: '#6fad73',
  },
  selectedItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedTag: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#6fad73',
    borderRadius: 5,
    marginRight: 5, // 間隔を追加
  },
  selectedTagText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MultiSelectBox;
