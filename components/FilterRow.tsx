import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, {useState} from 'react';

type FilterRowProps = {
  title: string;
  value?: boolean;
};

const FilterRow = ({title, value}: FilterRowProps) => {
  const [checked, setIsChecked] = useState(value);
  return (
    <TouchableOpacity
      style={styles.filterRow}
      onPress={() => setIsChecked(!checked)}>
      {checked ? (
        <Icon name="check-square" size={20} color="#557cff" />
      ) : (
        <Icon name="square" size={20} color="#557cff80" />
      )}
      <Text style={[styles.title, checked && styles.titleChecked]}>
        {title}
      </Text>
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
