import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

function MultiSelectBox({ options }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    setSelectedItems((prevItems) => (prevItems.includes(item)
      ? prevItems.filter((i) => i !== item)
      : [...prevItems, item]));
  };

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => toggleItem(option.value)}
          style={{
            padding: 10,
            backgroundColor: selectedItems.includes(option.value)
              ? 'gray'
              : 'white',
          }}
        >
          <Text>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

MultiSelectBox.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default MultiSelectBox;
