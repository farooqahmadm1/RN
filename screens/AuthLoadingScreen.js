import React from 'react';
import { View, StyleSheet, ActivityIndicator, AsyncStorage, Platform, Image, KeyboardAvoidingView, InputAccessoryView, Alert, Animated, Easing, Picker, Linking, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Button } from 'react-native-paper';
import Api from '../utils/Api';
import { Utils } from '../utils/Util';

const styles = StyleSheet.create({
    spanContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default class AuthLoadingScreen extends React.Component {
    constructor (props) {
        super(props); 

        this.state = {
            anim: {
                springImage: new Animated.Value(0.3),
                opacity: new Animated.Value(1),
            }
        }
        this._doAuth();
    }

    _doAuth = async () => {
        try {
            let userToken = await AsyncStorage.getItem('token');
            let apiUrl = await AsyncStorage.getItem('apiUrl');
            //AsyncStorage.removeItem('token');
            if (apiUrl != null) {
                Api.serverUrl = apiUrl;
            }
            if (userToken) {
                Api.verifyToken(userToken).then((result) => {
                    console.log(result);
                    if (result.message == "authFail") {
                        AsyncStorage.removeItem('token');
                        AsyncStorage.removeItem('apiUrl');
                        this.props.navigation.navigate('Auth');
                    } else {
                        Animated.sequence([
                            Animated.parallel([
                                Animated.timing(this.state.anim.opacity, {
                                    toValue: 0,
                                    delay: 0,
                                    duration: 200,
                                    useNativeDriver: true,
                                })
                            ]),
                        ]).start(() => {
                            this.props.navigation.navigate('App');
                            //register for push notifications
                            Utils.registerForPushNotificationsAsync((nx)=>{
                                switch (nx.origin) {
                                    case "selected": {
                                        if (nx.data.topic == "incompleteChecklists") {
                                            this.props.navigation.navigate('Checklist');
                                        } else {
                                            this.props.navigation.navigate('Home');
                                        }
                                        break;
                                    }
                                }
                            });
                        });
                    }
                }).catch(() => {
                    Alert.alert("Connection to server failed", "Please check your connectivity settings.");
                });
            } else {
                await this.props.navigation.navigate(userToken ? 'App' : 'Auth');
            }
        } catch(e) {
            console.log(e);
            console.log("error");
        }
    };
    componentDidMount () {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(this.state.anim.springImage, {
                    toValue: 0.2,
                    delay: 0,
                    friction: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }

    render () {
        return (
            <View style={styles.spanContainer}>
                <Animated.Image
                    style={{ transform: [{ scale: this.state.anim.springImage }],
                     opacity: this.state.anim.opacity}}
                    source={require('../images/splash.png')} 
                ></Animated.Image>
            </View>
        );
    }
}