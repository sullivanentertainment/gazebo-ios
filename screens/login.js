import React, { Component } from 'react';
  
  import {
    StyleSheet,
    Text,
    Alert,
    TouchableNativeFeedback,
    View,
    Dimensions,
    Image,
    TextInput,
    Platform,
    TouchableHighlight,
    Linking,
    AsyncStorage,
    ActivityIndicator,
    NetInfo,
    Keyboard,
    BackHandler,
    StatusBar,
    KeyboardAvoidingView
  } from 'react-native';
  import HomeScreen from './home';
  import { NavigationActions } from 'react-navigation';
  import { onSignIn } from "../auth";
  
  export default class LoginScreen extends Component {
    constructor(props) {
      super(props);
      this.login = this.login.bind(this);
      this.renderSubmitButton = this.renderSubmitButton.bind(this);
      this.state = {
        email: null,
        emailValid: true,
        pass: null,
        passValid: true,
        fetching: null,
        internetConnection: null
      };
    }
    renderSubmitButton(){
      const { navigate } = this.props.navigation;
      const { fetching } = this.state;
      if(fetching)
      return <ActivityIndicator size="large" style={{marginTop: 10}} />
      if(Platform.OS == 'android'){
        return <TouchableNativeFeedback
          onPress={() => {
            this.login()
          }}
            background={TouchableNativeFeedback.SelectableBackground()}>
          <View style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Login</Text>
          </View>
        </TouchableNativeFeedback>
      }
      if(Platform.OS == 'ios'){
        return <TouchableHighlight
            onPress={this.login}>
            <View style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Login</Text>
            </View>
        </TouchableHighlight>
      }
    }
    login(){
      Keyboard.dismiss()
      const { email, pass, emailValid, passValid } = this.state;
      const {navigate} = this.props.navigation;
      if(!email || !pass){
        if(!email){
          this.setState({
            emailValid: false
          })
        }
        if(!pass){
          this.setState({
            passValid: false
          })
        }
      }else if(emailValid && passValid){
        this.setState({
          fetching: true
        })
        var loginDetails = JSON.stringify({
          email: email,
          password: pass,
        })
        AsyncStorage.setItem("user_details", loginDetails)
        fetch('https://www.gazebotv.com/public/api/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: pass,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if(!responseJson.error){
            this.setState({
              fetching: true
            })
            AsyncStorage.setItem("api_token", responseJson.api_token)
            this.props.navigation.dispatch(NavigationActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'SignedIn' })
              ]
            }))
          }else {
            Alert.alert(
              'Error',
              'Please check your credentials',
              [
                {text: 'OK', onPress: () => {
                  this.setState({
                    fetching: false
                  })
                }},
              ]
            )
          }
        })
      }
    }
    validateEmail(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.setState({
        email
      })
      if(re.test(email)){
        this.setState({
          emailValid: true
        })
      }else {
        this.setState({
          emailValid: false
        })
      }
    }
    validatePassword(pass){
      this.setState({
        pass
      })
      if(pass){
        this.setState({
          passValid: true
        })
      }else {
        this.setState({
          passValid: false
        })
      }
    }
    componentDidMount(){
      const { navigation } = this.props;
      console.log(1)
      BackHandler.addEventListener('hardwareBackPress', function() {
        if(navigation.state.routeName == 'Login'){
          BackHandler.exitApp()
        }
      });
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
        if(isConnected){
        }else {
        }
      }); */
    }
    renderInputFields(){
      const { emailValid, passValid, internetConnection } = this.state;
      if(Platform.OS == 'android'){
        return <View style={styles.form}>
          <TextInput
            style={{width: Dimensions.get('window').width*0.9, color: '#fff', marginVertical: 8, borderColor: emailValid == false ? '#fa0000' : '#262c32', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 10, alignSelf: 'center'}}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(email) => this.validateEmail(email)}
            value={this.state.email}
            placeholderTextColor="#efefef"
          />
          <TextInput
            style={{width: Dimensions.get('window').width*0.9, color: '#fff', marginVertical: 8, borderColor: passValid == false ? '#fa0000' : '#262c32', borderBottomWidth: 1, paddingHorizontal: 10, paddingVertical: 10, alignSelf: 'center'}}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(pass) => this.validatePassword(pass)}
            value={this.state.pass}
            placeholderTextColor="#efefef"
          />
          <View style={{paddingHorizontal: 10}}>
            {this.renderSubmitButton()}
            </View>
        </View>
      }
      if(Platform.OS == 'ios'){
        return <View style={[styles.form, {alignSelf: 'center'}]}>
          <TextInput
            style={{width: Dimensions.get('window').width*0.9, color: '#fff', marginVertical: 8, borderBottomColor: emailValid == false ? '#fa0000' : '#1d2126', borderBottomWidth: 1, paddingHorizontal: 10, paddingVertical: 10}}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(email) => this.validateEmail(email)}
            value={this.state.email}
            placeholderTextColor="#efefef"
            autoCapitalize="none"
          />
          <TextInput
            style={{width: Dimensions.get('window').width*0.9, color: '#fff', marginVertical: 8, borderColor: passValid == false ? '#fa0000' : '#1d2126', borderBottomWidth: 1, paddingHorizontal: 10, paddingVertical: 10}}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(pass) => this.validatePassword(pass)}
            value={this.state.pass}
            placeholderTextColor="#efefef"
          />
          {this.renderSubmitButton()}
        </View>
      }
    }
    render() {
      const { emailValid, passValid, internetConnection } = this.state;
      const { navigate } = this.props.navigation;
      const { params } = this.props.navigation.state;
      const {goBack} = this.props.navigation;
      if(internetConnection == false){
        return (
          <View style={{flex: 1,alignItems: 'center',backgroundColor: '#262c32',justifyContent: 'center'}}>
            <View style={{marginHorizontal: 20, alignItems: 'center'}}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 25, textAlign: 'center'}}>No Internet Connection?</Text>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>Please connect to internet and try again.</Text>
            </View>
          </View>
        )
      }
        return <View style={styles.container}>
        <StatusBar
          backgroundColor="#262c32"
          barStyle="light-content"
        />
        {params.landing &&
          <TouchableHighlight onPress={() => goBack()} style={{alignSelf: 'flex-start'}}>
            <View>
            <Image style={{height: 20, width: 20, marginLeft: 10, marginTop: 25, resizeMode: 'contain', alignSelf: 'center'}} source={require('../assets/images/ios-back.png')}/>
            </View>
          </TouchableHighlight>
        }
        <KeyboardAvoidingView behavior="position" contentContainerStyle={{backgroundColor: '#262c32'}}>
          <View style={{marginTop: width*0.4}}>
            <View>
              <Image style={{height: Dimensions.get('window').width*0.08, resizeMode: 'contain', alignSelf: 'center'}} source={require('../assets/images/logo.png')}/>
            </View>
            <View>
              <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 20, marginBottom: 15, marginTop: 20}}>Login</Text>
            </View>
          </View>
            {this.renderInputFields()}
        </KeyboardAvoidingView>
          {/* <View>
            <Text onPress={() => navigate('WBView', {url: 'https://www.gazebotv.com/', login: true})} style={styles.register}>Don't have a account? Register Here</Text>
          </View> */}
        </View>
    }
  }

  const { width, height } = Dimensions.get('window');
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#262c32'
    },
    form: {
      flexDirection: 'column',
      paddingHorizontal: 10
    },
    inputFields: {
      width: Dimensions.get('window').width*0.8,
      color: '#fff',
      marginVertical: 8
    },
    submitButton: {
      backgroundColor: '#72bf44',
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginTop: 20,
      width: width*0.6,
      alignSelf: 'center'
    },
    submitButtonText: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 18
    },
    register: {
      color: '#fff',
      marginTop: 20,
      fontSize: 15,
      alignSelf: 'center'
    }
  });