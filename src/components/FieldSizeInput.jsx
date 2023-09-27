import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Modal,
} from 'react-native';
import PropTypes from 'prop-types';

function FieldSizeInput({
  length, width, unit, setLength, setWidth, setUnit,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const units = ['cm', 'm', 'km'];

  const selectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    setModalVisible(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldInputContainer}>
        <TextInput
          style={styles.fieldInput}
          value={length}
          onChangeText={setLength}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.unitInput}>{unit}</Text>
        </TouchableOpacity>
        <Text style={{ marginHorizontal: 10 }}>×</Text>
        <TextInput
          style={styles.fieldInput}
          value={width}
          onChangeText={setWidth}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.unitInput}>{unit}</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
        >
          <View style={styles.modalView}>
            {units.map((u) => (
              <TouchableOpacity key={u} onPress={() => selectUnit(u)}>
                <Text style={styles.modalText}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  fieldLabel: {
    width: 120,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldInput: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
  },
  unitInput: {
    marginHorizontal: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
});

FieldSizeInput.propTypes = {
  length: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  setLength: PropTypes.func.isRequired,
  setWidth: PropTypes.func.isRequired,
  setUnit: PropTypes.func.isRequired,
};

export default FieldSizeInput;
