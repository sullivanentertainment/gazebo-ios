import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  AsyncStorage,
  FlatList,
  ActivityIndicator,
  Image,
  Button,
  TouchableHighlight,
  Dimensions,
  Linking,
  NetInfo,
  Platform,
  StatusBar
} from 'react-native';
import Chromecast from 'react-native-google-cast';
import LoginScreen from './login';
import { onSignOut } from "../auth";
import { NavigationActions } from 'react-navigation';


Chromecast.startScan();
// To know if there are chromecasts around
DeviceEventEmitter.addListener(Chromecast.DEVICE_AVAILABLE, (existance) => console.log(1));

// To know if the connection attempt was successful
DeviceEventEmitter.addListener(Chromecast.DEVICE_CONNECTED, () => {  });

// If chromecast started to stream the media succesfully, it will send this event
DeviceEventEmitter.addListener(Chromecast.MEDIA_LOADED, () => {  });

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      products: [],
      devices: [],
      loggedIn: false,
      internetConnection: null,
      response: null
    }
    this.api_token = null;
  }
  static navigationOptions=({navigation})=> {
    const { navigate, dispatch } = navigation;
    if(Platform.OS == 'android'){
      return {
        headerTitle: <View style={{width: '100%', backgroundColor: '#262c32', justifyContent: 'center', marginTop: -40}}><Image style={{width: 80, resizeMode: 'contain', marginLeft: 20, marginTop: 40}} source={require('../assets/images/logo.png')}/></View>,
        headerRight: <View style={{flexDirection: 'row', backgroundColor: '#262c32', paddingLeft: 50}}>
          <TouchableHighlight onPress={() => onSignOut().then(() => {
            AsyncStorage.removeItem("api_token")
            navigate('SignedOut');
          })}>
            <Image style={{width: 25, resizeMode: 'contain', marginRight: 10}} source={require('../assets/images/logout.png')}/>
          </TouchableHighlight>
        </View>,
        headerMode: "none",
      }
    }
    if(Platform.OS == 'ios'){
      return {
        headerTitle: <View style={{width: Dimensions.get('window').width, flex: 1, backgroundColor: '#262c32', height: 84, justifyContent: 'center', marginTop: -40}}><Image style={{width: 80, resizeMode: 'contain', marginLeft: 20, height: 30, marginTop: 40}} source={require('../assets/images/logo.png')}/></View>,
        headerRight: <View style={{flexDirection: 'row', backgroundColor: '#262c32'}}>
          <TouchableHighlight onPress={() => onSignOut().then(() => {
            AsyncStorage.removeItem("api_token")
            navigate('SignedOut');
          })}>
            <Image style={{width: 25, height: 25, resizeMode: 'contain', marginLeft: 10, marginRight: 10}} source={require('../assets/images/logout.png')}/>
          </TouchableHighlight>
        </View>,
        headerMode: "none",
      }
    }
  }
  result(){
    AsyncStorage.getItem('api_token', (err, result) => {
      if(result){
        this.setState({
          response: result,
          loggedIn: true
        })
        fetch('https://www.gazebotv.com/public/api/user_details?api_token='+result)
        .then((response) => response.json())
        .then((responseJsonVHX) => {
          console.log(responseJsonVHX);
          this.setState({
            response: responseJsonVHX.user.vhx_id
          })
          //console.log(responseJsonVHX);
          AsyncStorage.setItem('vhx_id', responseJsonVHX.user.vhx_id)
          fetch('https://www.gazebotv.com/public/api/my_products?api_token='+result+'&vhx_id='+responseJsonVHX.user.vhx_id)
          .then((response) => response.json())
          .then((responseJsonProducts => {
            this.setState({
              response: 'products'
            })
            //console.log(responseJsonProducts.products);
            this.setState({
              products: responseJsonProducts.products
            })
            this.setState({
              loading: false
            })
            //console.log(this.state.products);
          }))
          .catch((errorProducts) => {
            this.setState({
              loading: false
            })
            //console.error(errorProducts);
          })

        })
        .catch((errorVHX) => {
          this.setState({
            loading: false
          })
          //console.error(errorVHX);
        })
      }else{
        this.setState({ loggedIn: false });
      }
    });
  }
  componentDidMount(){
    NetInfo.addEventListener('connectionChange',
    (networkType)=> {
      if(networkType.type != 'none'){
        this.setState({
          internetConnection: true
        })
      }else {
        this.setState({
          internetConnection: false
        })
      }
    }
  )
    /* NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected == true){
        this.setState({
          internetConnection: true
        })
      }else {
        this.setState({
          internetConnection: false
        })
      }
    }); */
    AsyncStorage.getItem('user_details', (err, result) => {
      result = JSON.parse(result);
      fetch('https://www.gazebotv.com/public/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: result.email,
          password: result.password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          fetching: true
        })
        AsyncStorage.setItem("api_token", responseJson.api_token);
        this.result();
      })
    });
  }
  render() {
    const { products, devices, internetConnection, loading } = this.state;
    const { navigate } = this.props.navigation;
    if(internetConnection == false){
      return (
        <View style={styles.container}>
          <View style={{marginHorizontal: 20, alignItems: 'center'}}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 25, textAlign: 'center'}}>No Internet Connection?</Text>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>No worry, You can still watch the downloaded videos.</Text>
            <View style={{backgroundColor: '#1d2126', flexDirection: 'row', marginTop: 20, width: Dimensions.get('window').width}}>
              <Text onPress={() => navigate('WBView', {url: 'https://shopatsullivan.com/'})} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>DOWNLOADS</Text>
              <Text onPress={() => {}} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>GIFT SHOP</Text>
              <Text onPress={() => navigate('WBView', {url: 'http://gazebotv.zendesk.com/'})} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>HELP</Text>
            </View>
          </View>
        </View>
      )
    }
    if(loading){
      return (
        <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#262c32'}}>
          <ActivityIndicator size="large" /></View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#262c32"
          barStyle="light-content"
        />
        <View>
          {loading && <View style={{justifyContent: 'center', flex: 1}}><ActivityIndicator size="large" /></View>}
          {!loading && products.length > 0 && <View>
            <View style={{backgroundColor: '#1d2126', flexDirection: 'row'}}>
              <Text onPress={() => navigate('Downloads')} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>DOWNLOADS</Text>
              <Text onPress={() => navigate('WBView', {url: 'https://shopatsullivan.com/'})} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>GIFT SHOP</Text>
              <Text onPress={() => navigate('WBView', {url: 'http://gazebotv.zendesk.com/'})} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>HELP</Text>
            </View>
            <FlatList
            style={{width: Dimensions.get('window').width}}
            data={products}
            renderItem={({item}) => 
              <View
              style={{marginVertical: 10, width: Dimensions.get('window').width*0.9, alignSelf: 'center'}}>
                <TouchableHighlight
                  onPress={() => {
                    navigate('Products', { productID: item.id })
                  }}>
                  <Image
                  style={styles.listImages}
                  source={{uri: item.thumbnail.medium}}
                  />
                </TouchableHighlight>
                <Text
                style={styles.listNames}
                onPress={() => {
                  navigate('Products', { productID: item.id })
                }}>
                  {item.name}
                </Text>
              </View>
            }
            keyExtractor={item => item.name}
          />
          </View>}
          {!loading && products.length == 0 && <View>
            <View style={{backgroundColor: '#1d2126', flexDirection: 'row', height: 50, width: width}}>
              <Text onPress={() => navigate('Downloads')} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>DOWNLOADS</Text>
              <Text onPress={() => navigate('WBView', {url: 'https://shopatsullivan.com/'})} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>GIFT SHOP</Text>
              <Text onPress={() => navigate('WBView', {url: 'http://gazebotv.zendesk.com/'})} style={{textAlign: 'center', color: '#fff', paddingVertical: 15, flex: 1}}>HELP</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text style={{color: '#fff', alignSelf: 'center', marginHorizontal: 20, fontSize: 16, textAlign: 'center'}}>You have no content. Please visit our website.</Text>
            </View>
          </View>}
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#262c32',
  },
  listImages: {
    width: Dimensions.get('window').width > 767  ? '70%' : '100%',
    height: Dimensions.get('window').width > 767  ? Dimensions.get('window').width*0.35 : Dimensions.get('window').width*0.53,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  listNames: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 20
  }
});