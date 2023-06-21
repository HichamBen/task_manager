import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Home: undefined;
  CreateTask: {taskId: string; isEdit: boolean} | undefined;
  Archive: undefined;
  Drafts: {taskId: string} | undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
