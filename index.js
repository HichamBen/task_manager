/**
 * @format
 */

import {AppRegistry} from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';
import {getDBConnection, taskOver} from './db/db-service';

notifee.onBackgroundEvent(async ({detail}) => {
  const {notification} = detail;
  let taskID = notification?.data?.taskId;

  // Update the task to be over in database
  let database = getDBConnection();
  taskOver(database, taskID);
});

// Register main application
AppRegistry.registerComponent(appName, () => App);
