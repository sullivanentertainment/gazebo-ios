import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Dimensions,
    ActivityIndicator,
    FlatList,
    TouchableHighlight,
    Image,
    StatusBar,
    Alert
  } from 'react-native';
  import RNFetchBlob from 'react-native-fetch-blob';

export default class Downloads extends Component {
  static navigationOptions = {
    title: 'Downloads',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#262c32'},
  }
  constructor(props){
    super(props);
    this.state = {
      videos: null,
    }
  }
  componentDidMount(){
    AsyncStorage.getItem('downloads', (err, result) => {
      console.log(result)
        if(result == null || result == '[null]'){
          this.setState({
            videos: false
          })
        }else{
          this.setState({
            videos: JSON.parse(result)
          })
        }
    })
  }
  removeVideo(filePath){
    Alert.alert(
      'Confirmation',
      'Do you really want to remove this video?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Remove', onPress: () => {  
          AsyncStorage.getItem('downloads', (err, result) => {
            result = JSON.parse(result);
            if(result != null){
              for (var i = result.length - 1; i >= 0; i--) {
                  if(filePath == result[i].file){
                    exist = true
                    // remove current element
                    result.splice(i, 1);
                }
              }
              if(result.length == 0){
                AsyncStorage.removeItem('downloads');
                this.setState({
                  videos: false
                })
              }else {
                result = JSON.stringify(result);
                AsyncStorage.setItem('downloads', result);
                this.setState({
                  videos: JSON.parse(result)
                })
              }
              if(exist){
                RNFetchBlob.fs.unlink(filePath)
              }
            }
          })
        }},
      ],
      { cancelable: false }
    )
  }
  render() {
      const { videos } = this.state;
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
        <StatusBar
        backgroundColor="#262c32"
          barStyle="light-content"
        />
            {videos == false && <View style={{justifyContent: 'center', flex: 1}}>
              <Text style={{color: '#fff', fontSize: 16}}>Sorry, You don't have any downloaded videos.</Text></View>}
            {videos == null && <View style={{justifyContent: 'center', flex: 1}}><ActivityIndicator size="large" /></View>}
            <FlatList
                style={{width: Dimensions.get('window').width}}
                data={videos}
                renderItem={({item, index}) => 
                <View
                style={{marginVertical: 10, width: Dimensions.get('window').width*0.9, alignSelf: 'center'}}>
                  <View style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
                    <TouchableHighlight
                    style={{flex: 1}}
                    onPress={() => {
                        navigate('VideoScreen', { file: item.file })
                    }}>
                      <Text
                      style={styles.listNames}>
                      {item.name} - {item.quality}
                      </Text>
                    </TouchableHighlight>
                    <View style={{flex: 0.1, justifyContent: 'center'}}>
                      <TouchableHighlight
                      style={{flex: 1, justifyContent: 'center'}}
                      onPress={() => {
                            this.removeVideo(item.file)
                      }}>
                        <Image
                        style={{width: 25, resizeMode: 'contain', height: 25, alignSelf: 'flex-end'}}
                        source={require('../assets/images/clear.png')} />
                    </TouchableHighlight>
                    </View>
                  </View>
                </View>
                }
                keyExtractor={item => item.file}
            />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262c32'
  },
  listImages: {
    width: '100%', height: 150
  },
  listNames: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 12
  }
});