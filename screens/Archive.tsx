import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {TaskContext} from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import {styles} from '../screens/Home';
import {FilterContextProvider} from '../context/FilterContext';

function Archive(): JSX.Element {
  const {state, dispatch} = useContext(TaskContext);
  return (
    <SafeAreaView>
      <FilterContextProvider>
        <Header />
      </FilterContextProvider>
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
            />
          )}
        />
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
});
export default Archive;
