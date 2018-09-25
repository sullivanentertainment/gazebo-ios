import { DrawerNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/home';
import ProductVideos from './screens/product-videos';
import Downloads from './screens/download';
import VideoScreen from './screens/video';
import LoginScreen from './screens/login';
import WebViewPage from './screens/webview';
import NewLogin from './screens/newLogin';
import React from 'react';
import {
  Image,
  View,
  Text
} from 'react-native';

export const Signin = StackNavigator({
  Home: { screen: HomeScreen },
  Products: { screen: ProductVideos },
  Downloads: {screen: Downloads },
  VideoScreen: { screen: VideoScreen },
  WBView: { screen: WebViewPage }
});

const webViewAB = StackNavigator({
  WBView: {
    screen: WebViewPage,
    navigationOptions: ({navigation, props}) => ({
      headerTintColor: '#fff',
      headerStyle: { backgroundColor: '#262c32'},
      headerLeft: <View>
        <Text 
          onPress={() => props.navigation.goBack()}
          style={{color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 20}}>Back</Text>
      </View>
    })
  }
});

export const Signout = StackNavigator({
  Landing: { screen: NewLogin },
  Login: { screen: LoginScreen },
  SignedIn: { screen: Signin },
  WBView: { screen: WebViewPage }
},
{
  headerMode: "none"
});

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: Signin,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: Signout,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};