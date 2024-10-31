import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Filter from './Filter';
import {useNavigation} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';
import {TaskContext} from '../context/TaskContext';

export type FilterPropsForState = {
  sortBy: {
    oldest: boolean;
    withDue: boolean;
    withList: boolean;
    isOver: boolean;
  };
  createdAt?: string;
};

type HeaderProps = {
  isInArchive?: boolean;
};

const Header = ({isInArchive}: HeaderProps) => {
  const navigation = useNavigation<RootTabScreenProps<'Home'>['navigation']>();
  const [isFocus, setIsFocus] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const {searchAndFilter} = useContext(TaskContext);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterObj, setFilterObj] = useState<FilterPropsForState>({
    sortBy: {
      oldest: false,
      withDue: true,
      withList: true,
      isOver: true,
    },
    createdAt: undefined,
  });

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: showFilter ? 'none' : 'flex',
      },
    });
  }, [navigation, showFilter]);

  useEffect(() => {
    if (search === '') {
      setIsSearching(false);
      return filter();
    }
    setIsSearching(true);
    let timeoutId = setTimeout(() => {
      setIsSearching(false);
      filter();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filter = () => {
    searchAndFilter({search: search, ...filterObj});
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
            <TouchableOpacity onPress={() => searchAndFilter(filterObj)}>
              <Icon name="search" size={25} color="white" />
            </TouchableOpacity>
            <TextInput
              style={styles.serachInput}
              placeholder="Search..."
              placeholderTextColor="white"
              onChangeText={text => setSearch(text)}
              value={search}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setShowFilter(true);
            }}
            style={styles.filterIcon}>
            <Icon name="tune" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {showFilter && (
        <Filter
          filter={filter}
          setFilterFields={setFilterObj}
          filterFields={filterObj}
          setShowFilter={setShowFilter}
          isInArchive={isInArchive}
        />
      )}
      <Text style={styles.title}>
        Filter by: {filterObj.sortBy.oldest ? 'Oldest' : 'Newest'}
        {filterObj.sortBy.withDue ? '' : ', no duetime'}
        {filterObj.sortBy.withList ? '' : ', no checklist'}
        {filterObj.sortBy.isOver ? '' : ', no over dated'}
        {filterObj.createdAt ? `, and created on ${filterObj.createdAt}` : ''}
      </Text>

      {isSearching && <Text style={styles.searchIndecator}>Searching...</Text>}
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
  title: {
    margin: 10,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontWeight: 'bold',
    color: 'gray',
  },
  searchIndecator: {
    margin: 10,
    color: 'lightgray',
  },
});
export default Header;
