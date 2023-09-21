import notifee from '@notifee/react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckItem from './CheckItem';
import type {TaskProps, TaskActionProps} from '../context/TaskContext';
import ProgressBar from './ProgressBar';
import {useNavigation} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';
import {
  completedTask,
  deleteTask,
  getDBConnection,
  updateCheckList,
} from '../db/db-service';

type TaskCardProps = TaskProps & {
  dispatch: React.Dispatch<TaskActionProps>;
  isInArchive?: boolean;
};

const {height} = Dimensions.get('window');

function TaskCard({
  taskId,
  title,
  dueTime,
  description,
  checkList,
  dispatch,
  isOver,
  isInArchive,
}: TaskCardProps): JSX.Element {
  const navigation =
    useNavigation<RootTabScreenProps<'CreateTask'>['navigation']>();

  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (checkList) {
      let isUncompleted = checkList.findIndex(item => !item.isChecked);
      if (isUncompleted > -1) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [checkList]);

  const removeNotification = async () => {
    let allNotification = await notifee.getTriggerNotifications();
    allNotification.forEach(async ({notification}) => {
      if (notification.data?.taskId === taskId) {
        await notifee.cancelTriggerNotification(notification.id as string);
      }
    });
  };

  const completeTask = async (id: string) => {
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        taskId: id,
        isCompleted: true,
        checkList: checkList?.map(item => {
          item.isChecked = false;
          return item;
        }),
      },
    });
    setShowModal(false);
    removeNotification();
    // Update the Task in db to be completed
    let database = getDBConnection();
    completedTask(database, id);
  };

  const deleteATask = async (id: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: {
        title,
        description,
        taskId: id,
      },
    });

    removeNotification();
    // Delete the Task from db
    let database = getDBConnection();
    deleteTask(database, id);
  };

  const editCheckList = async (itemId: string, isChecked: boolean) => {
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        taskId,
        checkList: checkList?.map(item => {
          if (item.checkListItemId === itemId) {
            item.isChecked = isChecked;
          }
          return item;
        }),
      },
    });

    // Update the ChekList in db
    let database = getDBConnection();
    updateCheckList(database, {
      itemId,
      isChecked,
    });
  };

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
            editCheckList={editCheckList}
            isInArchive={Boolean(isInArchive)}
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
      {dueTime && (
        <Text style={[styles.duedate, isOver && styles.duedateOver]}>
          {isOver ? 'Over' : 'Due Date'}
        </Text>
      )}

      {/* progress bar */}
      {checkList && !isInArchive && (
        <ProgressBar key={taskId} checkList={checkList} />
      )}

      {/* creation date */}
      <Text style={styles.creationDate}>
        {new Date().toLocaleString('fr', {
          year: 'numeric',
          month: 'numeric',
          day: '2-digit',
        })}
      </Text>

      {!isInArchive && (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          disabled={disabled}
          style={[styles.completedBtn, disabled && styles.completedBtnDis]}>
          <Text style={styles.textCompBtn}>Completed</Text>
        </TouchableOpacity>
      )}

      <Modal animationType="fade" visible={showModal} transparent={true}>
        <View style={styles.modal}>
          <View style={styles.modalChild}>
            <Icon
              style={styles.successIcon}
              name="check"
              size={50}
              color="green"
            />

            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successDesc}>
              You finished the task {String.fromCodePoint(0x1f44f)}
            </Text>

            <View style={styles.actionBtn}>
              <Icon.Button
                onPress={() => completeTask(taskId)}
                backgroundColor="#557cff"
                name="archive"
                size={20}
                color="white">
                Archive
              </Icon.Button>
              <Icon.Button
                onPress={() => {
                  deleteATask(taskId);
                  setShowModal(false);
                }}
                backgroundColor="#ff7441"
                name="trash"
                size={20}
                color="white">
                Delete
              </Icon.Button>
            </View>
          </View>
        </View>
      </Modal>
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
  duedateOver: {
    backgroundColor: 'red',
    paddingHorizontal: 2,
  },
  creationDate: {
    fontSize: 12,
    position: 'absolute',
    bottom: -16,
    right: 10,
  },
  completedBtn: {
    backgroundColor: '#557cff',
    marginTop: 10,
    width: 100,
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderRadius: 10,
    elevation: 5,
  },
  completedBtnDis: {
    backgroundColor: 'lightgray',
  },
  textCompBtn: {
    color: 'white',
    paddingVertical: 10,
  },
  modal: {
    backgroundColor: '#557cff50',
    width: '100%',
    height: '100%',
  },
  modalChild: {
    padding: 10,
    height: 210,
    backgroundColor: 'white',
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: height / 2 - 210 / 2,
    borderRadius: 10,
    position: 'relative',
  },
  successIcon: {
    backgroundColor: 'lightgreen',
    padding: 20,
    borderRadius: 50,
    position: 'absolute',
    top: -50,
  },
  successTitle: {
    marginTop: 30,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontSize: 32,
    fontWeight: '700',
    color: 'lightgreen',
  },
  successDesc: {
    marginTop: 10,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontSize: 18,
    color: 'black',
  },
  actionBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 35,
  },
});

export default memo(TaskCard);
