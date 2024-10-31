import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CheklistProps, TaskContext} from '../context/TaskContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';
import CheckInputItem from '../components/CheckInputItem';
import {
  createTask,
  deleteFromCheckList,
  getDBConnection,
  insertToCheckList,
  updateTask,
} from '../db/db-service';
import DatePicker from 'react-native-date-picker';

function CreateTask(): JSX.Element {
  const navigation =
    useNavigation<RootTabScreenProps<'CreateTask'>['navigation']>();
  const route = useRoute<RootTabScreenProps<'CreateTask'>['route']>();

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [titleIsFocused, setTitleIsFocused] = useState(false);
  const [descIsFocused, setDescIsFocused] = useState(false);
  const [checkList, setCheckList] = useState<CheklistProps[]>([]);
  const [dueTime, setDueTime] = useState<number | undefined>();

  const scrollView = useRef<ScrollView>({} as ScrollView);
  const [isModalShown, setisModalShown] = useState(false);

  const {state, dispatch} = useContext(TaskContext);

  // fill task form to edited;
  useEffect(() => {
    if (route.params?.isEdit) {
      let task = state.find(item => item.taskId === route.params?.taskId);
      setTitle(task?.title);
      setDescription(task?.description);
      setDueTime(task?.dueTime);
      if (task?.checkList) {
        setCheckList(task.checkList);
      }
    }

    return () => {
      navigation.setParams({taskId: '', isEdit: false});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll to the end
  useEffect(() => {
    if (checkList) {
      scrollView.current.scrollToEnd({animated: true});
    }
  }, [checkList]);

  const addCheckListItem = () => {
    let key = 'L' + Date.now();
    setCheckList(prev => {
      if (prev) {
        return [
          ...prev,
          {
            checkListItemId: key,
            content: '',
            isChecked: false,
          },
        ];
      }
      return [{checkListItemId: key, content: '', isChecked: false}];
    });

    //Update the ChekList in db
    if (route.params?.isEdit) {
      let database = getDBConnection();
      insertToCheckList(database, key, route.params?.taskId);
    }
  };

  const removeCheckListItem = useCallback(
    async (itemId: string) => {
      // setCheckListItems(prev => prev?.filter(item => item.key !== itemId));
      setCheckList(prev =>
        prev?.filter(item => item.checkListItemId !== itemId),
      );

      if (route.params?.isEdit) {
        // Update the ChekList in db
        let database = getDBConnection();
        deleteFromCheckList(database, itemId);
      }
    },
    [route.params?.isEdit],
  );

  const saveATask = async () => {
    if (!title || !description) {
      return Alert.alert(
        'Requirement!',
        'The title and the description are requirement',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }

    let removeCheckListEmptyItem: CheklistProps[] | undefined;
    if (checkList) {
      removeCheckListEmptyItem = checkList.filter(item =>
        Boolean(item.content),
      );
    }

    if (dueTime) {
      let date = new Date().getTime();
      if (dueTime <= date) {
        return Alert.alert(
          'Date Over!',
          'The Due Date is over add a future new duedate',
          [
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
    }

    let taskID = title.slice(0, 2) + Date.now();
    const payload = {
      taskId: taskID,
      title,
      description,
      dueTime,
      checkList: removeCheckListEmptyItem,
      isOver: false,
      isCompleted: false,
      createdAt: new Date().toLocaleString('fr', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
    };

    dispatch({
      type: 'CREATE_TASK',
      payload,
    });

    // Insert a task to database
    let database = getDBConnection();
    createTask(database, payload);

    setTitle('');
    setDescription('');
    setDueTime(undefined);
    setCheckList([]);

    if (dueTime) {
      pushNotification(dueTime, taskID);
    }

    navigation.jumpTo('Home');
  };

  const pushNotification = async (time: number, taskId: string) => {
    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: time, // fire at 11:10am (10 minutes before meeting)
    };

    // create notification;
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'alarm',
      name: 'Firing alarms & timers',
      lights: false,
      vibration: false,
      sound: 'default',
    });

    // Display a notification
    await notifee.createTriggerNotification(
      {
        title: title,
        body:
          description && description.length >= 50
            ? description?.slice(0, 50) + '...'
            : description,

        data: {taskId},
        android: {
          channelId,
          actions: [
            {
              title: '<p style="color: #557cff;">Open</p>',
              pressAction: {
                id: 'default',
              },
            },
            {
              title: '<p style="color: red;">Dismiss</p>',
              pressAction: {
                id: 'dismiss',
              },
            },
          ],
        },
      },
      trigger,
    );

    navigation.jumpTo('Home');
  };

  const editTask = async () => {
    // initial db
    let database = getDBConnection();

    if (route.params?.taskId) {
      let isOver = false;
      if (dueTime) {
        let date = new Date().getTime();
        if (dueTime <= date) {
          isOver = true;
          return Alert.alert(
            'Date Over!',
            'The Due Date is over add a future new duedate',
            [
              {
                text: 'OK',
                style: 'cancel',
              },
            ],
            {cancelable: true},
          );
        } else {
          /* To do clear the previous notification*/
          let allNotification = await notifee.getTriggerNotifications();

          allNotification.forEach(async ({notification}) => {
            if (notification.data?.taskId === route.params?.taskId) {
              await notifee.cancelTriggerNotification(
                notification.id as string,
              );
            }
          });

          pushNotification(dueTime, route.params?.taskId);
        }
      } else {
        notifee.getTriggerNotifications().then(allNotification => {
          allNotification.forEach(async ({notification}) => {
            if (notification.data?.taskId === route.params?.taskId) {
              await notifee.cancelTriggerNotification(
                notification.id as string,
              );
            }
          });
        });
      }

      let removeCheckListEmptyItem: CheklistProps[] | undefined;
      if (checkList) {
        removeCheckListEmptyItem = checkList.filter(item => {
          if (!item.content) {
            deleteFromCheckList(database, item.checkListItemId);
          }
          return Boolean(item.content);
        });
      }

      let payload = {
        taskId: route.params.taskId,
        title,
        description,
        dueTime,
        checkList: removeCheckListEmptyItem,
        isOver,
        isCompleted: false,
      };

      dispatch({
        type: 'EDIT_TASK',
        payload,
      });

      // Update the task in the db
      updateTask(database, payload);
    }
    setTitle('');
    setDescription('');
    setDueTime(undefined);
    setCheckList([]);

    navigation.jumpTo('Home');
  };

  return (
    <ScrollView
      ref={scrollView}
      scrollToOverflowEnabled
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <View style={styles.brandContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/images/presse-papiers.png')}
        />
        <Text style={styles.title}>Task Manager</Text>
      </View>

      {/* The form to create a task */}
      <View style={styles.form}>
        <TextInput
          style={[styles.inputs, titleIsFocused && styles.activeInput]}
          placeholder="The title..."
          placeholderTextColor="gray"
          value={title}
          onChangeText={text => setTitle(text)}
          onFocus={() => setTitleIsFocused(true)}
          onBlur={() => setTitleIsFocused(false)}
        />
        <TextInput
          style={[
            styles.inputs,
            styles.inputsExtra,
            descIsFocused && styles.activeInput,
          ]}
          multiline={true}
          placeholder="The description..."
          placeholderTextColor="gray"
          value={description}
          onChangeText={text => setDescription(text)}
          onFocus={() => setDescIsFocused(true)}
          onBlur={() => setDescIsFocused(false)}
        />

        {checkList?.map((item, id) => (
          <CheckInputItem
            key={item.checkListItemId}
            index={id + 1}
            checkItemId={item.checkListItemId}
            removeItem={removeCheckListItem}
            setCheckList={setCheckList}
            checkList={checkList}
          />
        ))}

        <TouchableOpacity
          onPress={addCheckListItem}
          style={styles.checkListBtn}>
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.checkListBtnTitle}>Cheklist Item</Text>
        </TouchableOpacity>
      </View>
      {/* Buttons for save & add due time */}
      <View
        style={[
          styles.saveDueBtns,
          checkList.length > 0 && {transform: [{translateY: -30}]},
        ]}>
        {route.params?.isEdit ? (
          <Pressable
            onPress={editTask}
            style={({pressed}) => [styles.btns, pressed && styles.activeBtn]}>
            <Icon name="edit" size={20} color="white" />
          </Pressable>
        ) : (
          <Pressable
            onPress={saveATask}
            style={({pressed}) => [styles.btns, pressed && styles.activeBtn]}>
            <Text style={styles.save}>Save</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => setisModalShown(true)}
          style={({pressed}) => [
            styles.btns,
            pressed && styles.activeBtn,
            Boolean(dueTime) && styles.activeDueDate,
          ]}>
          <Icon name="clock" size={30} color="white" />
        </Pressable>
      </View>

      {/* Timer picker modal */}
      <DatePicker
        modal
        open={isModalShown}
        date={dueTime ? new Date(dueTime) : new Date()}
        onConfirm={date => {
          date.setSeconds(0);
          setDueTime(date.getTime());
          setisModalShown(false);
        }}
        onCancel={() => {
          setDueTime(undefined);
          setisModalShown(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brandContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    padding: 20,
    borderRadius: 250,
    backgroundColor: '#557cff10',
  },
  logo: {
    width: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    marginTop: 10,
    fontFamily: 'Montserrat-VariableFont_wght',
    fontStyle: 'italic',
    color: '#557cff',
  },
  form: {
    width: '80%',
    alignSelf: 'center',
  },
  inputs: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: 'lightgray',
    fontSize: 16,
    color: '#2b5dff',
  },
  inputsExtra: {
    height: 100,
    textAlignVertical: 'top',
  },
  activeInput: {
    borderColor: '#557cff',
  },
  checkListBtn: {
    width: 120,
    padding: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#557cff',
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  checkListBtnTitle: {
    fontSize: 12,
    color: 'white',
  },
  saveDueBtns: {
    height: 125,
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    marginTop: 50,
    marginRight: 10,
  },
  btns: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#557cff',
  },
  save: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeBtn: {
    opacity: 0.5,
    borderWidth: 2,
    borderColor: 'blue',
  },
  activeDueDate: {
    backgroundColor: 'orangered',
  },
});
export default CreateTask;
