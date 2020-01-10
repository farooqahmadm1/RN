import React from 'react';
import { StyleSheet, Text, View,Image,Linking } from 'react-native';
import { Button } from 'react-native-paper';
import Api from '../utils/Api';
import * as Font from 'expo-font';

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    logo_container:{
        justifyContent:'flex-end',
        flex:4
    },
    button_container:{
        justifyContent:'flex-end',
        flex:2,
        marginHorizontal:25
    },
    bottom_container:{
        flex:1,
        justifyContent:'flex-end',
    },
    logo:{
        display:'flex',
        marginLeft:20,
        marginBottom:20
    },
    text:{
        fontFamily:'muli-bold',
        color:'white'
    },
    text_green:{
        fontFamily:'muli-bold',
        color:'#39B239'
    },
    button_fill:{
        backgroundColor:'#39B239',
        padding:5,
        marginTop:15,
        borderRadius:5
    },
    button_border:{
        backgroundColor:'rgba(255,255,255,0)',
        padding:5,
        marginTop:15,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#39B239'
    },
    text_bottom:{
        fontFamily:'muli-bold',
        color:'#39B239',
        textAlign:'center',
        fontSize:12,
        marginBottom:15
    }

});

export default class WelcomeScreen extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            userInfo:{}
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
            {this.state.fontLoaded ? (
            <View style={styles.container}>
                <View style={styles.logo_container}>
                    <Image style={styles.logo} 
                        source={require('../images/logo.png')}> 
                    </Image>
                </View>
                <View style={styles.button_container}>
                    <Button
                        onPress={()=> navigate("App")}
                        style={styles.button_fill}>
                        <Text style={styles.text}>Sign In With Google</Text>
                    </Button>
                    <Button style={styles.button_border}
                        onPress={()=> navigate("SignIn")}>
                        <Text style={styles.text_green}>Create an Account</Text>
                    </Button>
                </View>
                <View style={styles.bottom_container}>
                    <Button 
                        onPress={()=>{
                            Linking.openURL(Api.defServerUrl + "legal/privacy_policy.html")
                            }}>
                        <Text style={styles.text_bottom}>Privacy Policy</Text>
                    </Button>
                </View>
            </View>
            ): null}
            </View>
        )
    }
}