import React, {useContext, useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {TaskContext, TaskProps} from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import {styles} from '../screens/Home';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getDBConnection, updateTask} from '../db/db-service';

const {height, width} = Dimensions.get('window');

function Archive(): JSX.Element {
  const slideFromRight = useRef(new Animated.Value(width)).current;
  const timeoutId = useRef<number | null>(null);
  const {state, dispatch} = useContext(TaskContext);
  const [nbrTasksUndo, setNbrTasksUndo] = useState(0);

  const undoTask = (payload: TaskProps) => {
    if (timeoutId.current != null) {
      clearTimeout(timeoutId.current);
    }
    // initial db
    let database = getDBConnection();

    dispatch({
      type: 'EDIT_TASK',
      payload,
    });

    // Update the task in the db
    updateTask(database, payload, true);
    setNbrTasksUndo(prev => prev + 1);

    if (nbrTasksUndo >= 0) {
      Animated.timing(slideFromRight, {
        toValue: -150,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    timeoutId.current = setTimeout(() => {
      Animated.timing(slideFromRight, {
        toValue: width,
        duration: 500,
        useNativeDriver: true,
      }).start();
      timeoutId.current && clearTimeout(timeoutId.current);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header isInArchive />
      {state.length === 0 ? (
        <Text style={extraStyles.emptyList}>Empty</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.taskList}
          data={state.filter(item => item.isCompleted)}
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
              isInArchive={true}
              createdAt={item.createdAt}
              undoTask={undoTask}
            />
          )}
        />
      )}

      {Boolean(nbrTasksUndo) && (
        <Animated.View
          style={[
            extraStyles.toastContainer,
            {
              transform: [
                {
                  translateX: slideFromRight,
                },
              ],
            },
          ]}>
          <Text style={extraStyles.toast}>
            Undo {nbrTasksUndo} tasks archived
          </Text>
          <Icon name="archive" size={20} color="gray" />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const extraStyles = StyleSheet.create({
  emptyList: {
    fontSize: 32,
    fontFamily: 'Montserrat-VariableFont_wght',
    textAlign: 'center',
    marginTop: '30%',
  },
  toastContainer: {
    width: 250,
    backgroundColor: 'whitesmoke',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height - 90,
    left: '50%',
  },
  toast: {
    marginRight: 10,
    fontWeight: 'bold',
  },
});
export default Archive;
