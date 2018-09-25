import React, {
    Component
  } from 'react';
  
  import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  
  //import Video from 'react-native-video';
  import VideoPlayer from 'react-native-video-controls';
  
  export default class VideoScreen extends Component {
    static navigationOptions = {
      header: null
    }
    render() {
      const {goBack} = this.props.navigation;
      const {state} = this.props.navigation;
      return (
        <View style={styles.container}>
          {/* <Video source={{uri: 'http://v.yoai.com/femme_tampon_tutorial.mp4', mainVer: 1, patchVer: 0}}
          rate={1.0}                   // 0 is paused, 1 is normal.
          volume={1.0}                 // 0 is muted, 1 is normal.
          muted={false}                // Mutes the audio entirely.
          paused={false}               // Pauses playback entirely.
          resizeMode="cover"           // Fill the whole screen at aspect ratio.
          repeat={true}                // Repeat forever.
          style={{width: 250, height: 250}} /> */}
          <VideoPlayer
            source={{ uri: state.params.file }}
            navigator={ this.props.navigator }
            onBack={ () => {goBack()} }
          />
        </View>
      );
    }
  }
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    fullScreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    controls: {
      backgroundColor: 'transparent',
      borderRadius: 5,
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
    },
    progress: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 3,
      overflow: 'hidden',
    },
    innerProgressCompleted: {
      height: 20,
      backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
      height: 20,
      backgroundColor: '#2C2C2C',
    },
    generalControls: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 4,
      overflow: 'hidden',
      paddingBottom: 10,
    },
    rateControl: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    volumeControl: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    resizeModeControl: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlOption: {
      alignSelf: 'center',
      fontSize: 11,
      color: 'white',
      paddingLeft: 2,
      paddingRight: 2,
      lineHeight: 12,
    },
  });
  
  {/*
  
  
  import React, { Component } from 'react';
  import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    FlatList,
    ActivityIndicator
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
                  products: responseJson.files
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
    download(file){
      file = 'https://cdn.pixabay.com/photo/2017/01/19/09/11/logo-google-1991840_960_720.png';
      let dirs = RNFetchBlob.fs.dirs
      RNFetchBlob
      .config({
          addAndroidDownloads : {
              useDownloadManager : true,
              notification : false,
              //mime : 'video/mp4',
              mime : 'image/jpg',
              description : 'Gazebo'
          }
      })
      .fetch('GET', file)
      .then((resp) => {
        // the path of downloaded file
        resp.path()
        console.warn(resp.path());
        RNFetchBlob.fs.mv(resp.path(), RNFetchBlob.fs.dirs.DocumentDir + '/'+this.getFilename(file)+'.png')
        .then(() => {
          console.warn('file moved');
          console.warn(RNFetchBlob.fs.dirs.DocumentDir + '/'+this.getFilename(file)+'.png')
        })
        .catch(() => {
          console.warn('err while moving');
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
             this.download(item._links.source.href)
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
  
  */}