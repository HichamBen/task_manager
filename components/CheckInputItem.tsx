import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CheklistProps} from '../context/TaskContext';

export type CheckInputItemProps = {
  checkItemId: number;
  title?: string;
  removeItem: (id: number) => void;
  checkList: CheklistProps[];
  setCheckList: React.Dispatch<React.SetStateAction<CheklistProps[]>>;
};

const CheckInputItem = ({
  checkItemId,
  title,
  removeItem,
  setCheckList,
}: CheckInputItemProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    if (taskTitle) {
      setCheckList(prev => {
        let isExist: boolean = false;
        let editItem = prev.map(item => {
          if (item.checkListItemId === checkItemId) {
            item.content = taskTitle;
            isExist = true;
          }
          return item;
        });

        let newList = isExist
          ? editItem
          : [
              ...prev,
              {
                checkListItemId: checkItemId,
                content: taskTitle,
              } as CheklistProps,
            ];

        return newList;
      });
    } else {
      setCheckList(prev =>
        prev?.filter(item => item.checkListItemId !== checkItemId),
      );
    }
  }, [taskTitle, checkItemId, setCheckList]);

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused || taskTitle ? styles.activeInput : null,
      ]}>
      <Icon
        name="square"
        size={25}
        color={isFocused || taskTitle ? '#557cff' : 'lightgray'}
        solid
        style={styles.iconOne}
      />
      <TextInput
        placeholder={`Task ${checkItemId}`}
        placeholderTextColor="lightgray"
        defaultValue={title}
        multiline
        style={styles.input}
        onChangeText={text => setTaskTitle(text)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity
        onPress={() => removeItem(checkItemId)}
        style={[styles.iconOne, styles.extraIcon]}>
        <Icon name="times-circle" size={20} color="orangered" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    position: 'relative',
  },
  input: {
    paddingLeft: 30,
    paddingEnd: 22,
    color: '#2b5dff',
  },
  activeInput: {
    borderBottomColor: '#557cff',
  },
  iconOne: {
    position: 'absolute',
    top: 10,
  },
  extraIcon: {
    right: 0,
  },
});

export default CheckInputItem;
