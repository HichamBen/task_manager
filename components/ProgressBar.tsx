import {View, NativeModules, LayoutAnimation, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CheklistProps} from '../context/TaskContext';

type ProgressBarProps = {
  checkList: CheklistProps[];
};

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

function ProgressBar({checkList}: ProgressBarProps): JSX.Element {
  const [width, setwidth] = useState('0%');
  useEffect(() => {
    LayoutAnimation.spring();
  }, [width]);

  useEffect(() => {
    let percentage = (1 / checkList.length) * 100;
    let itemsChecked = 0;
    for (let i = 0; i < checkList.length; i++) {
      if (checkList[i].isChecked) {
        itemsChecked++;
      }
    }

    setwidth(
      `${Math.ceil(
        percentage * itemsChecked
          ? percentage * itemsChecked + 6
          : percentage * itemsChecked,
      )}%`,
    );
  }, [checkList]);

  return (
    <View
      style={[styles.progress, {width}, width === '106%' && styles.complete]}
    />
  );
}

const styles = StyleSheet.create({
  progress: {
    backgroundColor: '#557cff',
    height: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderBottomStartRadius: 10,
  },
  complete: {
    borderBottomEndRadius: 10,
  },
});

export default ProgressBar;
