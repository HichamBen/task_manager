import React, {useLayoutEffect} from 'react';
import {StatusBar, StyleSheet, Text} from 'react-native';
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
import {createTables, getDBConnection} from './db/db-service';

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

// 0: "DISMISSED"
// 1: "PRESS"
// 2: "ACTION_PRESS"
// 3: "DELIVERED"
// 4: "APP_BLOCKED"
// 5: "CHANNEL_BLOCKED"
// 6: "CHANNEL_GROUP_BLOCKED"
// 7: "TRIGGER_NOTIFICATION_CREATED"
// 8 : "FG_ALREADY_EXIST"
// -1 : "UNKNOWN"

function App(): JSX.Element {
  useLayoutEffect(() => {
    SplashScreen.hide();

    let database = getDBConnection();
    createTables(database);
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
          <TabStack.Screen
            options={{
              unmountOnBlur: true,
            }}
            name="Archive"
            component={Archive}
          />
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
