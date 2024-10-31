/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FilterRow from './FilterRow';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FilterPropsForState} from './Header';

const {height} = Dimensions.get('window');
type FilterCompProps = {
  isInArchive?: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filter: () => void;
  filterFields: FilterPropsForState;
  setFilterFields: React.Dispatch<React.SetStateAction<FilterPropsForState>>;
};
function Filter({
  isInArchive,
  setShowFilter,
  filter,
  filterFields,
  setFilterFields,
}: FilterCompProps) {
  const slide = useRef(new Animated.Value(0)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [oldest, setOldest] = useState(filterFields.sortBy.oldest);
  const [withDue, setWithDue] = useState(filterFields.sortBy.withDue);
  const [withList, setWidthList] = useState(filterFields.sortBy.withList);
  const [isOver, setIsOver] = useState(filterFields.sortBy.isOver);

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
    <View style={styles.filterContainer}>
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
        <Text>Sorted By:</Text>
        <View style={styles.firstRow}>
          <View>
            <FilterRow
              title="Oldest"
              setValue={() => {
                setFilterFields(prev => ({
                  sortBy: {
                    oldest: true,
                    withDue: prev.sortBy.withDue,
                    withList: prev.sortBy.withList,
                    isOver: prev.sortBy.isOver,
                  },
                  createdAt: prev.createdAt,
                }));
                setOldest(true);
              }}
              value={oldest}
            />
            <FilterRow
              title="Newest"
              setValue={() => {
                setFilterFields(prev => ({
                  sortBy: {
                    oldest: false,
                    withDue: prev.sortBy.withDue,
                    withList: prev.sortBy.withList,
                    isOver: prev.sortBy.isOver,
                  },
                  createdAt: prev.createdAt,
                }));
                setOldest(false);
              }}
              value={!oldest}
            />
          </View>
          <View>
            {!isInArchive && (
              <FilterRow
                title="Over Dated"
                setValue={() => {
                  setFilterFields(prev => ({
                    sortBy: {
                      oldest: prev.sortBy.oldest,
                      withDue: prev.sortBy.withDue,
                      withList: prev.sortBy.withList,
                      isOver: !isOver,
                    },
                    createdAt: prev.createdAt,
                  }));
                  setIsOver(!isOver);
                }}
                value={isOver}
              />
            )}
            <FilterRow
              title="With a check list"
              setValue={() => {
                setFilterFields(prev => ({
                  sortBy: {
                    oldest: prev.sortBy.oldest,
                    withDue: prev.sortBy.withDue,
                    withList: !withList,
                    isOver: prev.sortBy.isOver,
                  },
                  createdAt: prev.createdAt,
                }));

                setWidthList(!withList);
              }}
              value={withList}
            />
            <FilterRow
              title="With due time"
              setValue={() => {
                setFilterFields(prev => ({
                  sortBy: {
                    oldest: prev.sortBy.oldest,
                    withDue: !withDue,
                    withList: prev.sortBy.withList,
                    isOver: prev.sortBy.isOver,
                  },
                  createdAt: prev.createdAt,
                }));
                setWithDue(!withDue);
              }}
              value={withDue}
            />
          </View>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.completedBtn,
              {width: filterFields.createdAt ? 180 : 120},
            ]}>
            <Icon name="archive" size={20} color="#557cff" />
            <Text style={styles.textCompBtn}>
              {filterFields.createdAt
                ? 'Tasks in ' + filterFields.createdAt
                : 'Pick a Day'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dismissFilter();
              filter();
            }}
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
          setFilterFields(prev => ({
            sortBy: {
              oldest: prev.sortBy.oldest,
              withDue: prev.sortBy.withDue,
              withList: prev.sortBy.withList,
              isOver: prev.sortBy.isOver,
            },
            createdAt: date.toLocaleString('fr', {
              year: 'numeric',
              month: 'numeric',
              day: '2-digit',
            }),
          }));

          setShowDatePicker(false);
        }}
        onCancel={() => {
          setFilterFields(prev => ({
            sortBy: {
              oldest: prev.sortBy.oldest,
              withDue: prev.sortBy.withDue,
              withList: prev.sortBy.withList,
              isOver: prev.sortBy.isOver,
            },
            createdAt: undefined,
          }));
          setShowDatePicker(false);
        }}
      />
    </View>
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

export default React.memo(Filter);
