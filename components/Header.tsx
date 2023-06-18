import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = () => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/presse-papiers.png')}
        style={styles.brand}
      />

      <View style={styles.headerLeftSide}>
        <View style={[styles.searchContainer, isFocus && styles.inputFocus]}>
          <TouchableOpacity>
            <Icon name="search" size={25} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.serachInput}
            placeholder="Search..."
            placeholderTextColor="white"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
        </View>

        <TouchableOpacity style={styles.filterIcon}>
          <Icon name="tune" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
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
