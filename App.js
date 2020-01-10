import React from 'react';
import { AppRegistry, Button, StyleSheet, Text, View, StatusBar } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'; /**yarn add react-navigation */
import { Appbar } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'; /**yarn add react-navigation-material-bottom-tabs */
import { DefaultTheme, withTheme, Provider as PaperProvider } from 'react-native-paper';

import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import DownloadScreen from './screens/DownloadScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import SignInScreen from './screens/AuthScreens';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AgreeScreen from './screens/AgreeScreen'


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary:'white',
    accent: '#39B239'
  },
};
/**
 * The bottom-navigation is automatically themed using the above specified theme constant
 */
const TabStack = createMaterialBottomTabNavigator(
  {
    Attendance: AttendanceScreen,
    Download: DownloadScreen,
    Home: HomeScreen,
    Checklist: ChecklistScreen,
    Leaderboard: LeaderboardScreen,
  },
  {
    initialRouteName: 'Home',
    shifting: true,
    activeTintColor: theme.colors.accent,
    barStyle: { backgroundColor: theme.colors.primary, elevation: 4 }
  }
);
const AppStack = createStackNavigator(
  { 
    Main: TabStack,
    Profile: ProfileScreen,
    Settings: SettingsScreen
  },
  {
    initialRouteName: 'Main',
    navigationOptions: {
      header: (headerProps) => {
        if (headerProps.scene.route.routeName == "Main" || headerProps.scene.route.routeName == "Profile") {
          return null;
        } else {
          return (
            <Appbar.Header>
              <Appbar.BackAction
                onPress={ () => {
                    headerProps.navigation.goBack(null);
                  }
                }
              />
              <Appbar.Content
                title={ headerProps.scene.descriptor.options.title }
                subtitle={ headerProps.scene.descriptor.options.subtitle }
              />
            </Appbar.Header>
          );
        }
        
      }
    }
  }
);
/**
 * The sub-navigation unit usually has a `header` object that overrides the default header to provide Material themed header
 * This also means that any icons should be added on this renderer instead of the default way (when using react-navigation)
 * StackScreen.js has the most suitable and optimized representation of a sub-navigation
 */
const AuthStack = createStackNavigator(
  { 
    Welcome: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPass : ForgotPasswordScreen,
    Agree : AgreeScreen
  },
  {
    initialRouteName:'Welcome',
    navigationOptions: {
      header: (headerProps) => {
        if (headerProps.scene.route.routeName == "Welcome") {
          return null;
        } else if (headerProps.scene.route.routeName == "SignIn") {
          return null;
        }else if (headerProps.scene.route.routeName == "Agree") {
          return null;
        } else{
          return (
            <Appbar.Header style={{backgroundColor:"#ffffff"}}>
              <Appbar.BackAction
                onPress={ () => {
                    headerProps.navigation.goBack(null);
                  }
                }
              />
              <Appbar.Content
                title={ headerProps.scene.descriptor.options.title }
                subtitle={ headerProps.scene.descriptor.options.subtitle }
              />
            </Appbar.Header>
          );
        }
        
      }
    }
  }
);
const MainStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
export default function Main () {
  return (
    <PaperProvider theme={theme}>
		<StatusBar barStyle="dark-content" />
      <MainStack />
    </PaperProvider>
  );
};