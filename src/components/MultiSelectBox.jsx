import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

function MultiSelectBox({ options, onSelectionChange }) { // ここでonSelectionChangeをデストラクティング
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    setSelectedItems((prevItems) => {
      const newItems = prevItems.includes(item)
        ? prevItems.filter((i) => i !== item)
        : [...prevItems, item];

      // callbackを呼び出す
      if (onSelectionChange) { // ここで直接onSelectionChangeを使用
        onSelectionChange(newItems);
      }

      return newItems;
    });
  };

  return (
    <View>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index.toString()}
          onPress={() => toggleItem(option)}
          style={{
            padding: 10,
            backgroundColor: selectedItems.includes(option) ? 'gray' : 'white',
          }}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

MultiSelectBox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectionChange: PropTypes.func, // onSelectionChangeもPropTypesに追加
};

export default MultiSelectBox;
