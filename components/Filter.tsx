/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
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
import {FilterContext} from '../context/FilterContext';

const {height} = Dimensions.get('window');
type FilterProps = {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filter: () => void;
};
function Filter({setShowFilter, filter}: FilterProps) {
  const slide = useRef(new Animated.Value(250)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [oldest, setOldest] = useState(false);
  const [withDue, setWithDue] = useState(true);
  const [withList, setWidthList] = useState(true);
  const [isOver, setIsOver] = useState(true);

  const {filter: filterObj, dispatcher} = useContext(FilterContext);

  useEffect(() => {
    setOldest(filterObj.sortBy.oldest);
    setWithDue(filterObj.sortBy.withDue);
    setWidthList(filterObj.sortBy.withList);
    setIsOver(filterObj.sortBy.isOver);

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

  useEffect(() => {
    dispatcher({
      type: 'FILTER',
      payload: {
        oldest,
        withDue,
        withList,
        isOver,
      },
    });
  }, [dispatcher, isOver, oldest, withDue, withList]);

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
            <FilterRow
              title="Oldest"
              setValue={() => setOldest(true)}
              value={oldest}
            />
            <FilterRow
              title="Newest"
              setValue={() => setOldest(false)}
              value={!oldest}
            />
          </View>
          <View>
            <FilterRow
              title="Over Dated"
              setValue={() => setIsOver(!isOver)}
              value={isOver}
            />
            <FilterRow
              title="With a check list"
              setValue={() => setWidthList(!withList)}
              value={withList}
            />
            <FilterRow
              title="With due time"
              setValue={() => setWithDue(!withDue)}
              value={withDue}
            />
          </View>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.completedBtn,
              {width: filterObj.createdAt ? 180 : 120},
            ]}>
            <Icon name="archive" size={20} color="#557cff" />
            <Text style={styles.textCompBtn}>
              {filterObj.createdAt
                ? 'Tasks in ' + filterObj.createdAt
                : 'Pick a Day'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filter()}
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
        onConfirm={date => {
          dispatcher({
            type: 'BY_DATE',
            createdAt: date.toLocaleString('fr', {
              year: 'numeric',
              month: 'numeric',
              day: '2-digit',
            }),
          });
          setShowDatePicker(false);
        }}
        onCancel={() => {
          dispatcher({
            type: 'BY_DATE',
            createdAt: undefined,
          });
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
