import React from 'react';
import { View, StyleSheet, ActivityIndicator, AsyncStorage,NavigationActions, Platform, Image, KeyboardAvoidingView, InputAccessoryView, Alert, Animated, Easing, Picker, Linking, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Button, Surface } from 'react-native-paper';
import Api from '../utils/Api';
import { Utils } from '../utils/Util';
import * as Font from 'expo-font';


const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: '#ffffff'
    },
    top:{
        margin:30,
        justifyContent:"center",
        alignItems:"center"
    },
    middle:{
        margin:30,
        justifyContent:"flex-start",
        alignItems:"center",
        flexDirection:"row",
        backgroundColor:"rgba(156, 157, 158, 0.06)",
        borderRadius:5,
        padding:15,
        overflow:"hidden"
    },
    bottom:{
        justifyContent:"center",
        alignItems:"stretch",
        margin:30,
        overflow:"hidden"
    },  
    text_header:{
        fontSize:30,
        fontWeight:"bold",
        color:"#010F07",
        fontFamily:"muli-bold",
        marginTop:20
    },
    text_bottom:{
        fontSize:14,
        color:"#010F07",
        marginTop:10,
        fontFamily:"muli-bold",
        textAlign:"center"
    },
    button_fill:{
        backgroundColor:'#39B239',
        padding:5,
        marginTop:15,
        borderRadius:5
    },
    textInput:{
        width:"80%",
        backgroundColor:"#ffffff",
        fontSize:16,
        fontFamily:"muli-bold",
        backgroundColor:"rgba(156, 157, 158, 0)",
        marginLeft:10,
        overflow:"hidden",
        marginBottom:10
    },
    text:{
        color:'white',
        fontFamily:"muli-bold",
        fontSize:14
    },
})

export default class ForgotPasswordScreen extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            email:""
        }
    }
    state = {fontLoaded: false,};
    async componentDidMount() {
        await Font.loadAsync({
          'muli-bold': require('../assets/fonts/Muli-Medium.ttf'),
        });
        this.setState({ fontLoaded: true });
      }

    render(){
        const { navigate } = this.props.navigation;
        return(
            <View style={styles.container}>
                <View style={styles.top}>
                    <Image style={styles.logo} 
                        source={require('../images/forgot.png')}> 
                    </Image>
                    <Text style={styles.text_header}>Forgot Password</Text>
                    <Text style={styles.text_bottom}>Enter your Email Address and we will send you a reset instructions.</Text>
                </View>
                <View style={styles.middle}>
                    <Image style={styles.mailbox} 
                        source={require('../images/mailbox.png')}> 
                    </Image>
                    <TextInput 
                        placeholder="Enter Email"
                        textContentType='emailAddress'
                        style={styles.textInput} 
                        value={this.state.email}
                        underlineColor="rgba(255,255,255,0)"
                        underlineColorAndroid="rgba(255,255,255,0)" 
                        onChangeText={(text) => {this.setState({email: text});
                    }}/>
                </View>
                <View style={styles.bottom}>
                    <Button style={styles.button_fill} raised primary onPress={this._signIn}>
                        <Text style={styles.text}>Reset Password</Text>
                    </Button> 
                </View>

            </View>
        )
    }

}