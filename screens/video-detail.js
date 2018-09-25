import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import Chromecast from 'react-native-google-cast';
import RNFetchBlob from 'react-native-fetch-blob';

export default class VideoDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: []
    }
  }
  async componentDidMount(){
    const {state} = this.props.navigation;
    var thisab = this;
    const api_token = await AsyncStorage.getItem('api_token');
    const vhx_id = await AsyncStorage.getItem('vhx_id');
    console.log(api_token);
    console.log(vhx_id);
    AsyncStorage.getItem('api_token', (err, result) => {
        fetch('https://www.gazebotv.com/public/api/video_details?api_token='+api_token+'&video_id='+state.params.videoID+'&vhx_id='+vhx_id)
        .then((response) => response.json())
        .then((responseJson => {
            console.log(responseJson);
        }))
        .catch((error) => {
            console.error(error);
        })

        fetch('https://www.gazebotv.com/public/api/video_download?api_token='+api_token+'&video_id='+state.params.videoID)
        .then((response) => response.json())
        .then((responseJson => {
            console.log(responseJson);
            this.setState({
                products: responseJson.files.filter(product => product.quality!='adaptive')
            })
        }))
        .catch((error) => {
            console.error(error);
        })
    });
  }
  getFilename(url)
  {
     if (url)
     {
        var m = url.toString().match(/.*\/(.+?)\./);
        if (m && m.length > 1)
        {
           return m[1];
        }
     }
     return "";
  }
  approval(file){
    const { navigate } = this.props.navigation;
    Alert.alert(
      'Select',
      'Select a option',
      [
        {text: 'Cancel', onPress: () => console.log('Ask me later pressed'), style: 'cancel'},
        {text: 'Play Online', onPress: () => {navigate('VideoScreen', { file: file })}},
        {text: 'Download', onPress: () => this.download(file)},
      ],
      { cancelable: false }
    )
  }
  download(file){
    let dirs = RNFetchBlob.fs.dirs
    RNFetchBlob
    .config({
        addAndroidDownloads : {
            useDownloadManager : true,
            notification : false,
            mime : 'video/mp4',
            //mime : 'image/jpg',
            description : 'Gazebo'
        }
    })
    .fetch('GET', file)
    .then((resp) => {
      // the path of downloaded file
      resp.path()
      console.warn(resp.path());
      RNFetchBlob.fs.mv(resp.path(), RNFetchBlob.fs.dirs.DocumentDir + '/'+this.getFilename(file)+'.mp4')
      .then(() => {
        //console.warn(RNFetchBlob.fs.dirs.DocumentDir + '/'+this.getFilename(file)+'.mp4')
      })
      .catch(() => {
        //console.warn('err while moving');
      });
      
    })
  }
  render() {
    const { products } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {!products.length && <View style={{justifyContent: 'center', flex: 1}}><ActivityIndicator /></View>}
        {products && <FlatList
          data={products}
          renderItem={({item}) => <Text
          onPress={() => {
           this.approval(item._links.source.href)
          }}>{item.quality} - {item.size.formatted}</Text>}
          keyExtractor={item => item.quality}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});