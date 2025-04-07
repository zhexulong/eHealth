import type { StackScreenProps } from '@react-navigation/stack';
import type { Paths } from '@/navigation/paths';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  [Paths.Example]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Main]: NavigatorScreenParams<MainTabParamList>;
  [Paths.Login]: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type ApplicationStackParamList = {
  Chat: undefined;
};

export type AuthStackScreenProps<T extends keyof ApplicationStackParamList> = StackScreenProps<
  ApplicationStackParamList,
  T
>;

export type MainTabParamList = {
  Chat: undefined;
  Medications: undefined;
  Education: undefined;
  Community: undefined;
  Profile: undefined;
  TreatmentPlan: undefined;
};
