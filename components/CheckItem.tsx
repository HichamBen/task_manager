import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

type CheckItemProps = {
  id: number;
  description: string;
  isChecked: boolean;
  editCheckList: (itemId: number, isChecked: boolean) => void;
};

function CheckItem({
  id,
  description,
  isChecked,
  editCheckList,
}: CheckItemProps): JSX.Element {
  const edit = () => {
    let checked = isChecked ? false : true;
    editCheckList(id, checked);
  };

  return (
    <TouchableOpacity onPress={() => edit()} style={styles.item}>
      {isChecked ? (
        <Icon name="check-square" size={20} color="#557cff80" />
      ) : (
        <Icon name="square" size={20} color="lightgray" />
      )}
      <Text style={[styles.description, isChecked && styles.chekedItem]}>
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