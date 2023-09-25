import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Filter from './Filter';
import {useNavigation} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';
import {FilterContext} from '../context/FilterContext';
import {TaskContext} from '../context/TaskContext';

const Header = () => {
  const navigation = useNavigation<RootTabScreenProps<'Home'>['navigation']>();
  const [isFocus, setIsFocus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const {filter: filterObj, dispatcher} = useContext(FilterContext);
  const {searchAndFilter} = useContext(TaskContext);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: showFilter ? 'none' : 'flex',
      },
    });
  }, [navigation, showFilter]);

  const filter = () => {
    searchAndFilter(filterObj);
  };

  return (
    <>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/presse-papiers.png')}
          style={styles.brand}
        />

        <View style={styles.headerLeftSide}>
          <View style={[styles.searchContainer, isFocus && styles.inputFocus]}>
            <TouchableOpacity onPress={filter}>
              <Icon name="search" size={25} color="white" />
            </TouchableOpacity>
            <TextInput
              style={styles.serachInput}
              placeholder="Search..."
              placeholderTextColor="white"
              onChangeText={text => {
                dispatcher({type: 'SEARCH', search: text});
                filter();
              }}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            style={styles.filterIcon}>
            <Icon name="tune" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {showFilter && <Filter filter={filter} setShowFilter={setShowFilter} />}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#557cff',
  },
  brand: {
    width: 50,
    height: 50,
  },
  headerLeftSide: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  searchContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  serachInput: {
    width: '70%',
    height: '100%',
    marginLeft: 8,
    color: 'white',
  },
  inputFocus: {
    borderColor: 'lightblue',
  },
  filterIcon: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Header;
