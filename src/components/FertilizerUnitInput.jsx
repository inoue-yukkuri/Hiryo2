// FertilizerUnitInput.jsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
} from 'react-native';
import PropTypes from 'prop-types';

function FertilizerUnitInput({ onUnitSelected }) {
  const [unit, setUnit] = useState('握り(片手)');
  const [modalVisible, setModalVisible] = useState(false);

  const units = ['握り(片手)', 'g', 'kg', 't'];

  const selectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    onUnitSelected(selectedUnit);
    setModalVisible(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <TouchableOpacity style={styles.fieldInput} onPress={() => setModalVisible(true)}>
        <Text>{unit}</Text>
      </TouchableOpacity>
      <Text style={{ color: '#808080' }}>
        例：牛ふん20.5
        {unit}
      </Text>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            {units.map((u) => (
              <TouchableOpacity key={u} onPress={() => selectUnit(u)}>
                <Text style={styles.modalText}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  fieldInput: {
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

FertilizerUnitInput.propTypes = {
  onUnitSelected: PropTypes.func.isRequired,
};

export default FertilizerUnitInput;
