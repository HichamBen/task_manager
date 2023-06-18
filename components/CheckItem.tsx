import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

type CheckItemProps = {
  id: number;
  description: string;
  isChecked: boolean;
  setCheckedItems: React.Dispatch<React.SetStateAction<Number[]>>;
};

function CheckItem({
  id,
  description,
  isChecked,
  setCheckedItems,
}: CheckItemProps): JSX.Element {
  const [checked, setCheked] = useState(false);

  useEffect(() => {
    if (checked) {
      setCheckedItems(perv => [...perv, id]);
    } else {
      setCheckedItems(prev => prev.filter(item => item !== id));
    }
  }, [checked, id, setCheckedItems]);

  return (
    <TouchableOpacity onPress={() => setCheked(!checked)} style={styles.item}>
      {checked || isChecked ? (
        <Icon name="check-square" size={20} color="#557cff80" />
      ) : (
        <Icon name="square" size={20} color="lightgray" />
      )}
      <Text style={[styles.description, checked && styles.chekedItem]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 8,
    color: 'gray',
  },
  chekedItem: {
    textDecorationLine: 'line-through',
    color: '#557cff80',
  },
});
export default CheckItem;
