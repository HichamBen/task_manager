import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

type CheckItemProps = {
  id: string;
  description: string;
  isChecked: boolean;
  editCheckList: (itemId: string, isChecked: boolean) => void;
  isInArchive: boolean;
};

function CheckItem({
  id,
  description,
  isChecked,
  editCheckList,
  isInArchive,
}: CheckItemProps): JSX.Element {
  const edit = () => {
    let checked = isChecked ? false : true;
    editCheckList(id, checked);
  };

  return (
    <TouchableOpacity
      disabled={isInArchive}
      onPress={() => edit()}
      style={styles.item}>
      {isChecked ? (
        <Icon name="check-square" size={20} color="#557cff80" />
      ) : (
        <Icon name="square" size={20} color="lightgray" solid={isInArchive} />
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
