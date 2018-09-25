import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage
} from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import HomeScreen from './screens/home';
import ProductVideos from './screens/product-videos';
import VideoDetail from './screens/video-detail';
import VideoScreen from './screens/video';
import LoginScreen from './screens/login';
import SplashScreen from 'react-native-splash-screen';

import { createRootNavigator } from "./router";
import { isSignedIn } from "./auth";

SplashScreen.hide();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentWillMount() {
    isSignedIn()
    .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}
AppRegistry.registerComponent('GazeboTV', () => App);