import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React from 'react';

type FilterRowProps = {
  title: string;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterRow = ({title, value, setValue}: FilterRowProps) => {
  return (
    <TouchableOpacity style={styles.filterRow} onPress={() => setValue(!value)}>
      {value ? (
        <Icon name="check-square" size={20} color="#557cff" />
      ) : (
        <Icon name="square" size={20} color="#557cff80" />
      )}
      <Text style={[styles.title, value && styles.titleChecked]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: '#557cff80',
  },
  titleChecked: {
    color: '#557cff',
  },
});

export default FilterRow;
