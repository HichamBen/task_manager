import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CheklistProps} from '../context/TaskContext';

export type CheckInputItemProps = {
  checkItemId: number;
  removeItem: (id: number) => void;
  checkList: CheklistProps[];
  setCheckList: React.Dispatch<React.SetStateAction<CheklistProps[]>>;
};

const CheckInputItem = ({
  checkItemId,
  removeItem,
  checkList,
  setCheckList,
}: CheckInputItemProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const firtFill = useRef(false);

  useEffect(() => {
    let item = checkList.find(
      listItem => listItem.checkListItemId === checkItemId,
    );
    if (item) {
      setTaskTitle(item.content);
      firtFill.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkItemId]);

  useEffect(() => {
    if (isFocused && taskTitle) {
      firtFill.current = false;
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
    }

    return () => {
      if (!firtFill.current && !taskTitle) {
        setCheckList(prev =>
          prev?.filter(item => item.checkListItemId !== checkItemId),
        );
      }
    };
  }, [taskTitle, checkItemId, setCheckList, isFocused]);

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
        multiline
        style={styles.input}
        onChangeText={text => setTaskTitle(text)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={taskTitle}
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
