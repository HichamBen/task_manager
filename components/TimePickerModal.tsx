/* eslint-disable curly */
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

type TimePickerModalProps = {
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  dueTime: string[] | undefined;
  setDueTime: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

const {height} = Dimensions.get('window');

function TimePickerModal({
  isModalShown,
  setIsModalShown,
  dueTime,
  setDueTime,
}: TimePickerModalProps) {
  const [hours, setHours] = useState<string>();
  const [minutes, setMinutes] = useState<string>();

  const hoursRef = useRef<TextInput>(null);
  const minRef = useRef<TextInput>(null);

  useEffect(() => {
    if (dueTime) {
      setHours(dueTime[0]);
      setMinutes(dueTime[1]);
    } else {
      setHours('');
      setMinutes('');
    }
  }, [dueTime]);

  const handleHours = (text: string) => {
    if (text.length === 1) {
      if (text.match(/[3-9]/)) {
        minRef.current?.focus();
        return setHours(`0${text[0]}`);
      }
      if (text.match(/[0-2]/)) {
        return setHours(text);
      }
    }

    if (text.length === 2 && text[1].match(/[0-9]/)) {
      setHours(text);
      return minRef.current?.focus();
    }

    setHours(prev => {
      if (text?.length === 2) return prev;
      return '';
    });
  };

  const handleMinuts = (text: string) => {
    if (text.length === 1) {
      if (text.match(/[6-9]/)) {
        minRef.current?.blur();
        return setMinutes(`0${text[0]}`);
      }
      if (text.match(/[0-5]/)) return setMinutes(text);
    }

    if (text.length === 2 && text[1].match(/[0-9]/)) {
      setMinutes(text);
      return minRef.current?.blur();
    }

    setMinutes(prev => {
      if (text?.length === 2) return prev;
      return '';
    });
  };

  const addTheDueTime = (isCancle: boolean) => {
    if (!isCancle) {
      let hr = hours ? hours : '00';
      let min = minutes ? minutes : '00';
      setDueTime([
        hr.length > 1 ? hr : `0${hr}`,
        min.length > 1 ? min : `0${min}`,
      ]);
    } else {
      setHours('');
      setMinutes('');
    }

    setIsModalShown(false);
  };

  return (
    <Modal animationType="slide" transparent visible={isModalShown}>
      <View style={styles.modal}>
        <TouchableOpacity
          onPress={() => setIsModalShown(false)}
          style={styles.closeBtn}>
          <Icon name="times-circle" size={35} color="gray" />
        </TouchableOpacity>
        <View style={styles.timerPicker}>
          <Text style={styles.title}>Due Time</Text>
          <View style={styles.timer}>
            <TextInput
              ref={hoursRef}
              style={styles.timeInput}
              keyboardType="numeric"
              placeholderTextColor="gray"
              placeholder="00"
              maxLength={2}
              selectTextOnFocus={true}
              selectionColor="#557cff50"
              onChangeText={handleHours}
              value={hours}
            />
            <Text style={styles.dots}>:</Text>
            <TextInput
              ref={minRef}
              style={styles.timeInput}
              keyboardType="numeric"
              placeholderTextColor="gray"
              placeholder="00"
              maxLength={2}
              selectTextOnFocus={true}
              selectionColor="#557cff50"
              onChangeText={handleMinuts}
              value={minutes}
            />
          </View>
          <View style={styles.statusBtn}>
            <TouchableOpacity
              onPress={() => addTheDueTime(true)}
              style={styles.addBtn}>
              <Text style={styles.btnTitle}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => addTheDueTime(false)}
              style={styles.addBtn}>
              <Text style={styles.btnTitle}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#557cff50',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  timerPicker: {
    padding: 10,
    height: 180,
    backgroundColor: 'whitesmoke',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: height / 2 - 180 / 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  timer: {
    marginVertical: 28,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timeInput: {
    width: 40,
    height: 45,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    textAlign: 'center',
    color: 'black',
  },
  dots: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  statusBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  addBtn: {
    marginRight: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnTitle: {
    fontSize: 18,
    color: '#557cff',
  },
});

export default TimePickerModal;
