/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import Carousel from 'react-native-carousel-view';

export default class NewLogin extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        {/* <View style={styles.topBar}>
          <Text style={styles.topBarText} onPress={() => navigate('Login', {landing: true})}>My Account</Text>
        </View> */}
        <View style={styles.topScreenBlock}>
          <Image style={styles.logo} source={require('../assets/images/logo.png')}/>
          <Text style={styles.logoText}>Stream your favorite period shows</Text>
          <Text style={styles.logoText}>anytime, anywhere, commercial free.</Text>
          <TouchableHighlight style={[styles.buttonBlock, {marginTop: 60}]} onPress={() => navigate('Login', {landing: true})}>
            <Text style={styles.buttonText}>My Account</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.buttonBlock, {marginBottom: 60}]} onPress={() => navigate('WBView', {url: 'https://gazebotv.com/browse/all', login: true})}>
            <Text style={styles.buttonText}>Browse Titles</Text>
          </TouchableHighlight>
          {Platform.OS == 'android' && <TouchableHighlight style={[styles.buttonBlock, {marginBottom: 60}]} onPress={() => navigate('WBView', {url: 'https://gazebotv.com/register-page', login: true})}>
            <Text style={styles.buttonText}>Create An Account</Text>
          </TouchableHighlight>}
        </View>
        <View>
          <Carousel
            width={width}
            height={width/1}
            delay={10000}
            indicatorAtBottom={true}
            indicatorSize={20}
            indicatorColor="#72bf44"
          >
            <View style={styles.sliderContainer}>
              <TouchableHighlight onPress={() => navigate('WBView', {url: 'https://gazebotv.com/product-detail/23430', login: true})}>
                <View>
                  <Image
                    style={styles.sliderImage}
                    source={require('../assets/images/CoverArt_WAMB.png')}
                  />
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.sliderContainer}>
              <TouchableHighlight onPress={() => navigate('WBView', {url: 'https://gazebotv.com/product-detail/23439', login: true})}>
                <View>
                  <Image
                    style={styles.sliderImage}
                    source={require('../assets/images/CoverArt_RTA.png')}
                  />
                </View>
              </TouchableHighlight>
            </View>
            <View style={styles.sliderContainer}>
              <TouchableHighlight onPress={() => navigate('WBView', {url: 'https://gazebotv.com/product-detail/24394', login: true})}>
                <View>
                  <Image
                    style={styles.sliderImage}
                    source={require('../assets/images/CoverArt_Anne.png')}
                  />
                </View>
              </TouchableHighlight>
            </View>
          </Carousel>
        </View>
        <View style={styles.sliderBottomView}>
          <Text style={[styles.sliderBottomViewText, {fontSize: 22}]}>Only Pay For What You Watch!</Text>
          <Text style={[styles.sliderBottomViewText, {fontSize: 22}]}>No Monthly Fee</Text>
          {/* <Text style={styles.sliderBottomViewText}>No Monthly Fee</Text> */}
        </View>
        <View style={styles.iconBlocksView}>
          <View style={styles.iconBlock}>
            <Image style={styles.iconBlockImage} source={require('../assets/images/Whole-Family.png')}/>
            <Text style={styles.iconBlockHeading}>Entertainment for the Whole Family</Text>
            <Text style={styles.iconBlockContent}>Gazebo TV provides compelling original</Text>
            <Text style={styles.iconBlockContent}>content, as well as programming everyone</Text>
            <Text style={styles.iconBlockContent}>can enjoy together!</Text>
          </View>
          <View style={styles.iconBlock}>
            <Image style={styles.iconBlockImage} source={require('../assets/images/Watch-Anywhere.png')}/>
            <Text style={styles.iconBlockHeading}>Watch Anywhere 24/7</Text>
            <Text style={styles.iconBlockContent}>Available on Roku, Apple TV, iOS,</Text>
            <Text style={styles.iconBlockContent}>Android, iPhone, iPad, web</Text>
            <Text style={styles.iconBlockContent}>and more.</Text>
          </View>
          <View style={[styles.iconBlock, {borderBottomWidth: 0}]}>
            <Image style={styles.iconBlockImage} source={require('../assets/images/Unique-Programming.png')}/>
            <Text style={styles.iconBlockHeading}>Unique Programming</Text>
            <Text style={styles.iconBlockContent}>Stream movies and</Text>
            <Text style={styles.iconBlockContent}>series you can't find anywhere</Text>
            <Text style={styles.iconBlockContent}>else online.</Text>
          </View>
          <TouchableHighlight style={[styles.buttonBlock, {alignSelf: 'center', marginBottom: 40}]} onPress={() => navigate('WBView', {url: 'https://gazebotv.com/browse/all', login: true})}>
            <Text style={styles.buttonText}>Browse Titles</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>&copy; 2017 Sullivan Entertainment. All Rights Reserved.</Text>
        </View>
        <View style={styles.help}>
          <Text style={styles.helpText}>
            HELP&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;FAQ
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262c32'
  },
  topBar: {
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingLeft: 10,
    //marginTop: 20
  },
  topBarText: {
    color: '#ffffff',
    backgroundColor: '#72bf44',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: 'bold'
  },
  topScreenBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  logo: {
    resizeMode: 'contain',
    width: '80%',
    marginBottom: 30
  },
  logoText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
  },
  buttonBlock: {
    backgroundColor: '#72bf44',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '70%',
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  bannerImage: {
    resizeMode: 'contain',
    width: width,
    height: width*1.12
  },
  sliderBottomView: {
    backgroundColor: '#72bf44',
    paddingVertical: 20
  },
  sliderBottomViewText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26
  },
  iconBlocksView: {
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  iconBlock: {
    paddingVertical: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0'
  },
  iconBlockImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 0,
    alignSelf: 'center'
  },
  iconBlockHeading: {
    textAlign: 'center',
    fontSize: 20,
    color: '#262c32',
    fontWeight: 'bold',
    marginVertical: 5
  },
  iconBlockContent: {
    textAlign: 'center',
    color: '#262c32',
    fontSize: 16
  },
  copyright: {
    backgroundColor: '#fff'
  },
  copyrightText: {
    textAlign: 'center'
  },
  help: {
    paddingVertical: 20,
    backgroundColor: '#fff'
  },
  helpText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#262c32'
  },
  sliderImage: {
    resizeMode: 'contain',
    width: width,
    height: width/0.9
  }
});