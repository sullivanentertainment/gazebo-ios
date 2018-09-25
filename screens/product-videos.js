import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  TouchableHighlight,
  StatusBar,
  Platform
} from 'react-native';
import Chromecast from 'react-native-google-cast';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast, {DURATION} from 'react-native-easy-toast'

this.abcd = '';

export default class ProductVideos extends Component {
  static navigationOptions=({navigation})=> {
    if(Platform.OS == 'android'){
      return {
        headerTitle: <View style={{width: '100%', backgroundColor: '#262c32', justifyContent: 'center', marginTop: -40}}><Image style={{width: 80, resizeMode: 'contain', marginLeft: 15, marginTop: 40}} source={require('../assets/images/logo.png')}/></View>,
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#262c32'},
      }
    }
    if(Platform.OS == 'ios'){
      return {
        headerTitle: <View style={{width: Dimensions.get('window').width, backgroundColor: '#262c32', height: 84, justifyContent: 'center', marginTop: -40}}><Image style={{width: 80, resizeMode: 'contain', marginLeft: 30, height: 30, marginTop: 40}} source={require('../assets/images/logo.png')}/></View>,
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#262c32'},
      }
    }
  }
  constructor(props){
    super(props);
    this.state = {
      products: [],
      popUp: false,
      files: [],
      type: null,
      devices: [],
      selectFileCast: null,
      selectFileCastName: null,
      selectFileCastImage: null,
      downloading: false,
      downloadProgress: null,
      downloadTotal: null,
      downloadedFiles: null,
      productType: null,
      parent_productID_AB: null
    }
  }

  componentDidMount(){
    //Chromecast.startScan();
    const {state} = this.props.navigation;
    var thisab = this;
    if(state.params.parent_productID){
      this.abcd = state.params.parent_productID
    }else {
      this.abcd = state.params.productID
    }
    console.log(this.abcd);
    if(state.params.parentID){
      thisab.setState({
        productType: 'single_video',
      })
      var parent_id_ab = thisab.abcd;
      AsyncStorage.getItem('api_token', (err, result) => {
        AsyncStorage.getItem('vhx_id', (err2, result2) => {
          fetch('https://www.gazebotv.com/public/api/video_details?api_token='+result+'&video_id='+state.params.productID+'&vhx_id='+result2+'&vhx_product_id='+parent_id_ab)
          .then((response) => response.json())
          .then((responseJson => {
            console.log(responseJson);
            this.state.products.push(responseJson);
            thisab.setState({
              products: this.state.products
            })
          }))
          .catch((error) => {
              console.error(error);
          })
        })
      })
    }else {
      AsyncStorage.getItem('api_token', (err, result) => {
        fetch('https://www.gazebotv.com/public/api/product_videos?api_token='+result+'&product_id='+state.params.productID)
        .then((response) => response.json())
        .then((responseJson => {
            console.log(responseJson);
            var videoType;
            for(videos of responseJson.videos){
              if(videos.video_id){
                thisab.setState({
                  productType: 'episode'
                })
              }
              if(videos.parent_id){
                thisab.setState({
                  productType: 'season'
                })
              }
              if(videos.type == 'video'){
                thisab.setState({
                  productType: 'video'
                })
              }
              break;
            }
            if(responseJson.videos.length == 0){
              this.setState({
                products: false
              })
            }else {
              this.setState({
                products: responseJson.videos
              })
            }
        }))
        .catch((error) => {
            console.error(error);
        })
      });
    }
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
  bytesToSize(bytes) {
    var sizeInMB = (bytes / (1024*1024)).toFixed(2);
    return sizeInMB + 'MB'
  };
  storeDownload(fileImage, fileName, file, type, size, storedData){
    var exist = false;
    if(storedData.length > 0){
      storedData.map(function(item){
        if(item.file == file){
          exist = true;
        }
        if(exist == false){
          storedData.push({
            image: fileImage,
            name: fileName,
            file: file,
            quality: type,
            size: size
          })
        }
      })
      storedData = JSON.stringify(storedData);
      this.setState({
        downloadedFiles: storedData
      })
      AsyncStorage.setItem('downloads', storedData);
    }else {
      AsyncStorage.setItem('downloads', JSON.stringify([{
        image: fileImage,
        name: fileName,
        file: file,
        quality: type,
        size: size
      }]));
    }
  }
  downloadComplete(file){
    var downloadedSize;
    RNFetchBlob.fs.readFile(file, 'base64')
    .then((data) => {
      var decodedData = base64.decode(data);
      var bytes=decodedData.length;
      if(bytes < 1024) downloadedSize = bytes + " Bytes";
      else if(bytes < 1048576) downloadedSize = (bytes / 1024).toFixed(3) + " KB";
      else if(bytes < 1073741824) downloadedSize = (bytes / 1048576).toFixed(2) + " MB";
      else downloadedSize = (bytes / 1073741824).toFixed(3) + " GB";

      console.warn(downloadedSize);
    });
  }
  downloadFiles(fileImage, fileName, file, type, size, storedData){
    let dirs = RNFetchBlob.fs.dirs;
    var base64 = require('base-64');
    this.setState({
      downloading: dirs.DocumentDir + '/'+this.getFilename(file)+'-'+type+'.mp4'
    })
    // ................
    console.warn(dirs.DocumentDir + '/'+this.getFilename(file)+'-'+type+'.mp4')
    this.downloadFile = RNFetchBlob
    .config({
      path : dirs.DocumentDir + '/'+this.getFilename(file)+'-'+type+'.mp4'
    })
    .fetch('GET', file)
    this.downloadFile.progress((received, total) => {
      this.setState({
        downloadProgress: received,
        downloadTotal: total
      })
    })
    this.downloadFile.then((resp) => {
      console.log(resp);
      this.setState({
        downloading: false,
        downloadProgress: null,
        downloadTotal: null
      })
      this.storeDownload(fileImage, fileName, resp.data, type, size, storedData)
    })
    // ................
    this.downloadFile.catch((err) => {
      console.log(err);
    })
    // ................
  }
  download(file, type, size){
    const { downloadedFiles, selectFileCastImage, selectFileCastName } = this.state;
    var fileImage = selectFileCastImage;
    var fileName = selectFileCastName;
    var thiAB = this;
    var path = RNFetchBlob.fs.dirs.DocumentDir + '/'+this.getFilename(file)+'-'+type+'.mp4'
    var exist = false;
    this.setState({
      popUp: false
    })
    AsyncStorage.getItem('downloads', (err, result) => {
      console.warn(result);
      if(result == null || result == '[null]'){
        thiAB.downloadFiles(fileImage, fileName, file, type, size, false);
      }else {
        result = JSON.parse(result);
        result.map(function(video){
          if(path == video.file){
            exist = true
          }
        })
        if(exist == false){
          thiAB.downloadFiles(fileImage, fileName, file, type, size, result);
        }else {
          Alert.alert(
            'Alert',
            'You have already downloaded this video in same format. Please check your downloads.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }
      }
    })
  }
  cancelDownload(){
    const { downloading } = this.state;
    this.downloadFile.cancel();
    setTimeout(function(){
      var exist;
      AsyncStorage.getItem('downloads', (err, result) => {
          result = JSON.parse(result);
          if(result != null){
            for (var i = result.length - 1; i >= 0; i--) {
                if(downloading == result[i].file){
                  exist = true
                  // remove current element
                  result.splice(i, 1);
              }
            }
            if(result.length == 0){
              AsyncStorage.removeItem('downloads')
            }else {
              result = JSON.stringify(result);
              AsyncStorage.setItem('downloads', result);
            }
            if(exist){
              RNFetchBlob.fs.unlink(downloading)
            }
          }
      })
      //AsyncStorage.removeItem('downloads')
  }, 1000);
    this.setState({
      downloading: false,
      downloadProgress: null,
      downloadTotal: null
    })
  }
  playVideo(file){
    this.setState({
      popUp: false,
      files: []
    })
    const { navigate } = this.props.navigation;
    navigate('VideoScreen', { file: file })
    //VideoPlayer.showVideoPlayer(file)
  }
  async selectDevice(file, name){
    let devices = await Chromecast.getDevices();
    console.log(devices)
    if(devices.length == 0){
      this.refs.toast.show('No Device Found');
    }
    if(devices){
      this.setState({
        devices: devices,
        selectFileCast: file,
        selectFileCastName: name
      })
    }
  }
  async castVideo(id){
    const { selectFileCast, selectFileCastName } = this.state;
    let connect = await Chromecast.connectToDevice(id);
    setTimeout(function(){ 
      Chromecast.castMedia(selectFileCast, selectFileCastName, '', 0);
    }, 2000);
  }
  closeDownloadBox(){
    this.setState({
      popUp: false
    })
  }
  async videoFiles(video, type){
    const {state} = this.props.navigation;
    this.setState({
      popUp: true,
      files: [],
      type: type,
      devices: [],
      selectFileCast: null,
      selectFileCastName: null,
      selectFileCastImage: null
    })
    var parent_pdo = state.params.parent_productID !== undefined ? state.params.parent_productID : state.params.productID;
    var thisab = this;
    const api_token = await AsyncStorage.getItem('api_token');
    const vhx_id = await AsyncStorage.getItem('vhx_id');
    AsyncStorage.getItem('api_token', (err, result) => {
        this.setState({
          selectFileCastName: video.name,
          selectFileCastImage: video.thumbnail.medium
        })
        AsyncStorage.getItem('vhx_id', (err2, result2) => {
          console.log('https://www.gazebotv.com/public/api/video_details?api_token='+result+'&video_id='+video.id+'&vhx_id='+result2+'&vhx_product_id='+parent_pdo);
          fetch('https://www.gazebotv.com/public/api/video_details?api_token='+result+'&video_id='+video.id+'&vhx_id='+result2+'&vhx_product_id='+parent_pdo)
          .then((response) => response.json())
          .then((responseJson => {
            console.log(responseJson);
            if(responseJson.purchase_type == 1){
              fetch('https://www.gazebotv.com/public/api/video_download?api_token='+api_token+'&video_id='+video.id)
              .then((response) => response.json())
              .then((responseJson => {
                console.log(responseJson);
                this.setState({
                    files: responseJson.files.filter(product => product.quality!='adaptive')
                })
              }))
              .catch((error) => {
                  console.error(error);
              })
            }else if(responseJson.purchase_type == 0 && type != 'Download'){
              fetch('https://www.gazebotv.com/public/api/video_download?api_token='+api_token+'&video_id='+video.id)
              .then((response) => response.json())
              .then((responseJson => {
                console.log(responseJson);
                this.setState({
                    files: responseJson.files.filter(product => product.quality!='adaptive')
                })
              }))
              .catch((error) => {
                  console.error(error);
              })
            }else {
              Alert.alert(
                'Alert',
                'Download is not allowed on rental products',
                [
                  {text: 'OK', onPress: () => {
                    this.setState({
                      popUp: false,
                    })
                  }},
                ],
                { cancelable: false }
              )
            }
          }))
          .catch((error) => {
              console.error(error);
          })
        })
    });
  }
  render() {
    const { products, files, popUp, type, devices, downloading, downloadProgress, downloadTotal, productType } = this.state;
    const { navigate, state } = this.props.navigation;
    if(products === false){
      return (
        <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#262c32'}}><Text style={{color: '#fff', textAlign: 'center', fontSize: 14}}>Rental has expired</Text></View>
      )
    }
    if(!products.length){
      return (
        <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#262c32'}}><ActivityIndicator size="large" /></View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar
        backgroundColor="#262c32"
          barStyle="light-content"
        />
        <Toast ref="toast"/>
        <View>
          {productType == 'video' && <FlatList
          data={products}
          renderItem={({item}) => 
            <View
            style={{marginVertical: 10, width: Dimensions.get('window').width*0.9, alignSelf: 'center'}}>
              <TouchableHighlight>
                <Image
                style={styles.listImages}
                source={{uri: item.thumbnail.medium}}
                />
              </TouchableHighlight>
              <Text
              style={styles.listNames}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row', flex: 1, borderBottomColor: 'rgba(255, 255, 255, 0.6)', borderBottomWidth: 1, marginTop: 10}}>
                <TouchableHighlight
                style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                onPress={() => this.videoFiles(item, 'Play')}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      <Image style={{width: 30, resizeMode: 'contain', height: 30}} source={require('../assets/images/play.png')} />
                    <Text style={styles.iconText}>Play Online</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                onPress={() => {
                  this.videoFiles(item, 'Download')
                }}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      <Image style={{width: 30, resizeMode: 'contain', height: 30}} source={require('../assets/images/download.png')}/>
                    <Text style={styles.iconText}>Download</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                onPress={() => {
                  this.videoFiles(item, 'Cast')
                }}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      <Image style={{width: 30, resizeMode: 'contain', height: 30}} source={require('../assets/images/cast.png')}/>
                    <Text style={styles.iconText}>Cast</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          }
          keyExtractor={item => item.name}
          />}

          
          {productType == 'single_video' && <FlatList
          data={products}
          renderItem={({item}) => 
            <View
            style={{marginVertical: 10, width: Dimensions.get('window').width*0.9, alignSelf: 'center'}}>
              <TouchableHighlight>
                <Image
                style={styles.listImages}
                source={{uri: item.video._embedded.video.thumbnail.medium}}
                />
              </TouchableHighlight>
              <Text
              style={styles.listNames}>
                {item.video._embedded.video.name}
              </Text>
              <View style={{flexDirection: 'row', flex: 1, borderBottomColor: 'rgba(255, 255, 255, 0.6)', borderBottomWidth: 1, marginTop: 10}}>
                <TouchableHighlight
                style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                onPress={() => this.videoFiles(item.video._embedded.video, 'Play')}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      <Image style={{width: 30, resizeMode: 'contain', height: 30}} source={require('../assets/images/play.png')} />
                    <Text style={styles.iconText}>Play Online</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                onPress={() => {
                  this.videoFiles(item.video._embedded.video, 'Download')
                }}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      <Image style={{width: 30, resizeMode: 'contain', height: 30}} source={require('../assets/images/download.png')}/>
                    <Text style={styles.iconText}>Download</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
                onPress={() => {
                  this.videoFiles(item.video._embedded.video, 'Cast')
                }}>
                  <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                      <Image style={{width: 30, resizeMode: 'contain', height: 30}} source={require('../assets/images/cast.png')}/>
                    <Text style={styles.iconText}>Cast</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          }
          keyExtractor={item => item.video._embedded.video.name}
          />}


          {productType == 'episode' && <View>
            <FlatList
            style={{width: Dimensions.get('window').width}}
            data={products}
            renderItem={({item}) => 
              <View
              style={{marginVertical: 10, width: Dimensions.get('window').width*0.9, alignSelf: 'center'}}>
                <TouchableHighlight
                  onPress={() => {
                    navigate('Products', { productID: item.video_id, parentID: item.product_id, parent_productID: state.params.parent_productID !== undefined ? state.params.parent_productID : state.params.productID })
                  }}>
                  <Image
                  style={styles.listImages}
                  source={{uri: item.thumb}}
                  />
                </TouchableHighlight>
                <Text
                style={styles.listNames}
                onPress={() => {
                  navigate('Products', { productID: item.video_id, parentID: item.product_id, parent_productID: state.params.parent_productID !== undefined ? state.params.parent_productID : state.params.productID })
                }}>
                  {item.title}
                </Text>
              </View>
            }
            keyExtractor={item => item.title}
          />
          </View>}


          {productType == 'season' && <View>
            <FlatList
            style={{width: Dimensions.get('window').width}}
            data={products}
            renderItem={({item}) => 
              <View
              style={{marginVertical: 10, width: Dimensions.get('window').width*0.9, alignSelf: 'center'}}>
                <TouchableHighlight
                  onPress={() => {
                    navigate('Products', { productID: item.product_id, vhxParentID: item.parent_id, parent_productID: state.params.parent_productID !== undefined ? state.params.parent_productID : state.params.productID })
                  }}>
                  <Image
                  style={styles.listImages}
                  source={{uri: item.thumb}}
                  />
                </TouchableHighlight>
                <Text
                style={styles.listNames}
                onPress={() => {
                  navigate('Products', { productID: item.product_id, vhxParentID: item.parent_id, parent_productID: state.params.parent_productID !== undefined ? state.params.parent_productID : state.params.productID })
                }}>
                  {item.title}
                </Text>
              </View>
            }
            keyExtractor={item => item.title}
          />
          </View>}


        </View>
        {popUp && <View style={{position: 'absolute', top: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
          {files.length == 0 && <ActivityIndicator style={{marginTop: '40%'}} size="large" />}
          {files.length > 0 &&
          <View style={{backgroundColor: '#efefef', width: Dimensions.get('window').width*0.8, height: 310, alignSelf: 'center', marginTop: Dimensions.get('window').height*0.17}}>
            {devices.length == 0 && <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, paddingTop: 10, paddingBottom: 10}}>{type} Video</Text>}
            {devices.length > 0 && <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, paddingTop: 10, paddingBottom: 10}}>Select Device to Cast</Text>}
            {devices.length == 0 && <FlatList
            data={files}
            renderItem={({item}) => 
              <Text
              style={{paddingVertical: 10, paddingHorizontal: 10, alignSelf: 'center', borderTopWidth: 1, borderColor: '#d3d3d3'}}
              onPress={() => {
              type == 'Download' ? this.download(item._links.source.href, item.quality, item.size.formatted) : type == 'Cast' ? this.selectDevice(item._links.source.href) : this.playVideo(item._links.source.href)
              }}>{item.quality} - {item.size.formatted}</Text>
            }
            keyExtractor={item => item.quality}
            />}
            {devices.length > 0 && <FlatList
            data={devices}
            renderItem={({item}) => <Text
            style={{paddingBottom: 10, paddingHorizontal: 10, alignSelf: 'center'}}
            onPress={() => {
             this.castVideo(item.id)
            }}>{item.name}</Text>}
            keyExtractor={item => item.id}
            />}
            <TouchableHighlight onPress={() => this.closeDownloadBox()}>
              <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#262c32'}}>
                <Text style={{color: '#fff'}}>Cancel</Text>
              </View>
            </TouchableHighlight>
          </View>}
        </View>}
        {downloading && <View style={{position: 'absolute', top: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
          <View style={{backgroundColor: '#efefef', width: Dimensions.get('window').width*0.8, alignSelf: 'center', marginTop: Dimensions.get('window').height*0.17, position: 'relative'}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, paddingTop: 10, paddingBottom: 10}}>Downloading...</Text>
            {downloadTotal && <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, paddingTop: 10, paddingBottom: 10}}>{this.bytesToSize(downloadProgress)} - {this.bytesToSize(downloadTotal)}</Text>}
            {!downloadTotal && <ActivityIndicator style={{marginBottom: 20}} />}
            <TouchableHighlight onPress={() => this.cancelDownload()}>
                <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: 40, backgroundColor: '#262c32'}}>
                  <Text style={{color: '#fff'}}>Cancel Downloading</Text>
                </View>
              </TouchableHighlight>
            </View>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262c32',
    position: 'relative'
  },
  listImages: {
    width: '100%', height: Dimensions.get('window').width*0.53, resizeMode: 'contain'
  },
  listNames: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10
  },
  iconText: {
    color: '#fff',
    marginVertical: 8
  },
  listImages: {
    width: '100%', height: Dimensions.get('window').width*0.53, resizeMode: 'contain'
  },
  listNames: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10
  }
});