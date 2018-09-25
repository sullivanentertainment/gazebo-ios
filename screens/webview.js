import React, { Component } from 'react';
import { WebView, StatusBar, View, Text, Image, TouchableHighlight } from 'react-native';

export default class WebViewPage extends Component {
    static navigationOptions = {
      headerTintColor: '#fff',
      headerStyle: { backgroundColor: '#262c32'},
    }
  render() {
    const { state, goBack } = this.props.navigation;
    if(state.params.login){
        return <View style={{flex: 1}}>
        <View style={{height: 60, backgroundColor: '#262c32', paddingTop: 20}}>
            <TouchableHighlight
            style={{width: 50, height: 40}}
            onPress={() => goBack()}
            >
                <Image
                style={{resizeMode: 'contain', width: 25, height: 25, marginLeft: 10, marginTop: 5}}
                source={require('../assets/images/ios-back.png')}
                />
            </TouchableHighlight>
        </View>
       <StatusBar
          backgroundColor="#262c32"
          barStyle="light-content"
        />
      <WebView
        startInLoadingState={true}
        source={{uri: state.params.url}}
      >
      </WebView>
      </View>
    }else {
        return (
            <WebView
                startInLoadingState={true}
                source={{uri: state.params.url}}
            />
        );
    }
  }
}