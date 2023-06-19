import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckItem from './CheckItem';
import {CheklistProps, TaskContext} from '../context/TaskContext';
import ProgressBar from './ProgressBar';
import {useNavigation} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';

type TaskCardProps = {
  taskId: string;
  title: string | undefined;
  description: string | undefined;
  checkList?: CheklistProps[];
  dueTime?: string[];
};

function TaskCard({
  taskId,
  title,
  dueTime,
  description,
  checkList,
}: TaskCardProps): JSX.Element {
  const navigation =
    useNavigation<RootTabScreenProps<'CreateTask'>['navigation']>();
  const {dispatch} = useContext(TaskContext);
  const [checkedItems, setCheckedItems] = useState<Number[]>([]);

  const deleteATask = (id: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: {
        title,
        description,
        taskId: id,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        taskId,
        checkList: checkList?.map(item => {
          if (checkedItems.includes(item.checkListItemId)) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
          return item;
        }),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems, dispatch, taskId]);

  return (
    <View style={styles.card}>
      {/* title */}
      <Text style={styles.title}>{title}</Text>

      {/* description */}
      <Text style={styles.description}>{description}</Text>

      {/* cheklist */}
      {checkList &&
        checkList.map(item => (
          <CheckItem
            key={item.checkListItemId}
            id={item.checkListItemId}
            description={item.content}
            isChecked={item.isChecked}
            setCheckedItems={setCheckedItems}
          />
        ))}

      {/* edit & delete icons */}
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() =>
            navigation.jumpTo('CreateTask', {taskId, isEdit: true})
          }>
          <Icon name="edit" size={20} color="#557cff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteATask(taskId)}>
          <Icon name="trash-alt" size={20} color="#ff6c6c" />
        </TouchableOpacity>
      </View>

      {/* Due date badge */}
      {dueTime && <Text style={styles.duedate}>Due Date</Text>}

      {/* progress bar */}
      {checkList && <ProgressBar key={taskId} checkList={checkList} />}

      {/* creation date */}
      <Text style={styles.creationDate}>
        {new Date().toLocaleString('fr', {
          year: 'numeric',
          month: 'numeric',
          day: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 30,
    padding: 10,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#557cff20',
    borderRadius: 10,
    position: 'relative',
  },
  title: {
    fontFamily: 'Montserrat-VariableFont_wght',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    width: '90%',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
    marginBottom: 10,
    width: '90%',
  },
  icons: {
    height: 60,
    position: 'absolute',
    right: 10,
    top: 0,
    justifyContent: 'space-around',
  },
  duedate: {
    backgroundColor: '#ff7441',
    color: 'white',
    fontSize: 6,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontStyle: 'italic',
    position: 'absolute',
    paddingHorizontal: 1,
    borderRadius: 2,
  },

  creationDate: {
    fontSize: 12,
    position: 'absolute',
    bottom: -16,
    right: 10,
  },
});

export default TaskCard;
