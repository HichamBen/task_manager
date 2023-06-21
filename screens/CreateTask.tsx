import React, {useContext, useEffect, useRef, useState} from 'react';
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
import notifee from '@notifee/react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TimePickerModal from '../components/TimePickerModal';
import {CheklistProps, TaskContext} from '../context/TaskContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootTabScreenProps} from '../navigation/types';
import CheckInputItem, {
  CheckInputItemProps,
} from '../components/CheckInputItem';

function CreateTask(): JSX.Element {
  const navigation =
    useNavigation<RootTabScreenProps<'CreateTask'>['navigation']>();
  const route = useRoute<RootTabScreenProps<'CreateTask'>['route']>();

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [dueTime, setDueTime] = useState<string[]>();
  const [titleIsFocused, setTitleIsFocused] = useState(false);
  const [descIsFocused, setDescIsFocused] = useState(false);
  const [checkList, setCheckList] = useState<CheklistProps[]>([]);
  const [checkListItems, setCheckListItems] = useState<
    React.FC<CheckInputItemProps>[]
  >([]);

  const scrollView = useRef<ScrollView>({} as ScrollView);
  const [isModalShown, setisModalShown] = useState(false);

  const {state, dispatch} = useContext(TaskContext);

  // fill task form to edited;
  useEffect(() => {
    if (route.params?.isEdit) {
      let task = state.tasks.find(item => item.taskId === route.params?.taskId);
      setTitle(task?.title);
      setDescription(task?.description);
      setDueTime(task?.dueTime);
      if (task?.checkList) {
        let list = [];
        for (let i = 0; i < task.checkList.length; i++) {
          list.push(CheckInputItem);
        }
        setCheckListItems(list);
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
    if (checkListItems) {
      scrollView.current.scrollToEnd({animated: true});
    }
  }, [checkListItems]);

  const addCheckListItem = () => {
    setCheckListItems(prev => {
      if (prev) {
        return [...prev, CheckInputItem];
      }
      return [CheckInputItem];
    });
  };

  const removeCheckListItem = (itemId: number) => {
    setCheckListItems(prev => prev?.filter((item, id) => id + 1 !== itemId));
    setCheckList(prev => prev?.filter(item => item.checkListItemId !== itemId));
  };

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

    dispatch({
      type: 'CREATE_TASK',
      payload: {
        taskId: title.slice(0, 2) + Date.now(),
        title,
        description,
        dueTime,
        checkList,
      },
    });
    setTitle('');
    setDescription('');
    setDueTime(undefined);
    setCheckListItems([]);
    setCheckList([]);

    // create notification;
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });

    navigation.jumpTo('Home');
  };

  const editTask = () => {
    if (route.params?.taskId) {
      dispatch({
        type: 'EDIT_TASK',
        payload: {
          taskId: route.params.taskId,
          title,
          description,
          dueTime,
          checkList,
        },
      });
    }
    setTitle('');
    setDescription('');
    setDueTime(undefined);
    setCheckListItems([]);
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

        {checkListItems?.map((Item, id) => (
          <Item
            key={id}
            checkItemId={id + 1}
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
          checkListItems.length > 0 && {transform: [{translateY: -30}]},
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
            dueTime && styles.activeDueDate,
          ]}>
          <Icon name="clock" size={30} color="white" />
        </Pressable>
      </View>

      {/* Timer picker modal */}
      <TimePickerModal
        isModalShown={isModalShown}
        setIsModalShown={setisModalShown}
        setDueTime={setDueTime}
        dueTime={dueTime}
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
