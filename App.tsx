import React, {useEffect} from 'react';
import {Keyboard, StatusBar, StyleSheet, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import Home from './screens/Home';
import CreateTask from './screens/CreateTask';
import Archive from './screens/Archive';
import Drafts from './screens/Drafts';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabParamList, RootTabScreenProps} from './navigation/types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TaskContextProvider} from './context/TaskContext';

const TabStack = createBottomTabNavigator<RootTabParamList>();
const optionsScreen = <T extends keyof RootTabParamList>({
  route,
}: RootTabScreenProps<T>) => ({
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarIcon: (props: {focused: boolean; color: string; size: number}) => {
    if (route.name === 'Home') {
      return <Icon name="home" color={props.color} size={props.size} />;
    } else if (route.name === 'CreateTask') {
      return <Icon name="plus" color={props.color} size={props.size} />;
    } else if (route.name === 'Archive') {
      return <Icon name="archive" color={props.color} size={props.size} />;
    }

    return (
      <Icon name="sticky-note" color={props.color} size={props.size} solid />
    );
  },
  tabBarActiveTintColor: '#557cff',
});

function App(): JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
    // unfocused the inputs whend keyboard dismissed
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss();
    });
  }, []);

  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <StatusBar backgroundColor="#557cff" barStyle="light-content" />
      <TaskContextProvider>
        <TabStack.Navigator
          sceneContainerStyle={styles.sceneContainerStyle}
          screenOptions={optionsScreen}
          initialRouteName="Home">
          <TabStack.Screen name="Home" component={Home} />
          <TabStack.Screen
            options={{
              title: 'Add Task',
              unmountOnBlur: true,
            }}
            name="CreateTask"
            component={CreateTask}
          />
          <TabStack.Screen name="Archive" component={Archive} />
          <TabStack.Screen name="Drafts" component={Drafts} />
        </TabStack.Navigator>
      </TaskContextProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sceneContainerStyle: {
    backgroundColor: 'white',
  },
});

export default App;
