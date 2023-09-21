/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FilterRow from './FilterRow';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {height} = Dimensions.get('window');
type FilterProps = {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
};
function Filter({setShowFilter}: FilterProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date>();
  const slide = useRef(new Animated.Value(250)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissFilter = () => {
    Animated.timing(slide, {
      toValue: 250,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      clearTimeout(timer);
      setShowFilter(false);
    }, 500);
  };
  return (
    <Pressable style={styles.filterContainer} onPress={dismissFilter}>
      <Animated.View
        style={[
          styles.filter,
          {
            transform: [
              {
                translateY: slide,
              },
            ],
          },
        ]}>
        <TouchableOpacity onPress={dismissFilter} style={styles.closeBtn}>
          <Icon name="times-circle" size={30} color="gray" />
        </TouchableOpacity>
        <Text>Sorted By:</Text>
        <View style={styles.firstRow}>
          <View>
            <FilterRow title="Old" />
            <FilterRow title="New" value />
          </View>
          <View>
            <FilterRow title="Over Dated" value />
            <FilterRow title="With a check list" value />
            <FilterRow title="With due time" value />
          </View>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.completedBtn, {width: date ? 180 : 120}]}>
            <Icon name="archive" size={20} color="#557cff" />
            <Text style={styles.textCompBtn}>
              {date
                ? 'Tasks in ' +
                  date.toLocaleString('fr', {
                    year: 'numeric',
                    month: 'numeric',
                    day: '2-digit',
                  })
                : 'Pick a Day'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.completedBtn,
              {borderWidth: 0, backgroundColor: '#557cff'},
            ]}>
            <Text style={{color: 'white'}}>Filter</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* Timer picker modal */}
      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        date={new Date()}
        onConfirm={d => {
          setDate(d);
          setShowDatePicker(false);
        }}
        onCancel={() => {
          setDate(undefined);
          setShowDatePicker(false);
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: '#557cff30',
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height,
    justifyContent: 'flex-end',
  },
  filter: {
    paddingVertical: 35,
    paddingHorizontal: 25,
    backgroundColor: 'whitesmoke',
    height: 250,
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
  },
  firstRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedBtn: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#557cff50',
    borderRadius: 10,
  },

  textCompBtn: {
    color: '#557cff',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
});

export default Filter;
