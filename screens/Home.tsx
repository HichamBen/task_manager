import React, {useContext, useEffect} from 'react';
import notifee, {EventType} from '@notifee/react-native';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import {TaskContext} from '../context/TaskContext';
import {useNavigation} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';

function Home(): JSX.Element {
  const navigation = useNavigation<RootTabScreenProps<'Home'>['navigation']>();
  const {state, dispatch} = useContext(TaskContext);

  const overDate = (taskId: string) => {
    console.log('the task id in overDate function', taskId);
    dispatch({
      type: 'OVER_DUEDATE',
      payload: {
        taskId,
        isOver: true,
      },
    });
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({type: typeEvent, detail}) => {
      const {notification, pressAction} = detail;

      let taskID = notification?.data?.taskId;

      switch (typeEvent) {
        case EventType.DISMISSED:
        case EventType.ACTION_PRESS:
          overDate(taskID as string);
          if (pressAction?.id === 'default') {
            navigation.navigate('CreateTask', {
              taskId: taskID as string,
              isEdit: true,
            });
          }
          break;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <Header />
      <Text style={styles.title}>Filter by: All</Text>
      {state.length === 0 ? (
        <TouchableOpacity
          onPress={() => navigation.jumpTo('CreateTask')}
          style={styles.emptyList}>
          <Text style={styles.emptyListTitle}>Add A Task</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.taskList}
          data={state.filter(item => !item.isCompleted)}
          keyExtractor={(item, index) => item.taskId.toString() + index}
          renderItem={({item}) => (
            <TaskCard
              taskId={item.taskId}
              title={item.title}
              description={item.description}
              checkList={item.checkList}
              dueTime={item.dueTime}
              dispatch={dispatch}
              isOver={item.isOver}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  navBtn: {
    width: 100,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  title: {
    margin: 10,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontWeight: 'bold',
    color: 'gray',
  },
  taskList: {
    marginBottom: 100,
    paddingHorizontal: 10,
  },
  emptyList: {
    width: '80%',
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginTop: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: 'lightgray',
  },

  emptyListTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-VariableFont_wght',
    color: 'black',
  },
});

export default Home;
