import React from 'react';
import { StyleSheet,ScrollView, Text, View,Image,Linking,SafeAreaView  } from 'react-native';
import { Button } from 'react-native-paper';
import Api from '../utils/Api';


const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        alignItems:"stretch"
    },
    logo_container:{
        justifyContent:'flex-start',
        alignItems:"stretch",
        display:"flex",
        flexDirection:"column",
        marginLeft:20
    },
    button_container:{
        justifyContent:"flex-start",
        margin:20
    },
    bottom_container:{
        justifyContent:"flex-start",
        alignItems:"stretch",
        marginHorizontal:20,
        marginBottom:20,
    },
    logo:{
        display:'flex',
        marginBottom:20,
        marginTop:30
    },
    text_header:{
        color:'#39B239',
        fontSize:24,
        fontWeight:"bold"
    },
    text:{
        color:'white'
    },
    text_green:{
        color:'#39B239'
    },
    button_fill:{
        backgroundColor:'#39B239',
        padding:5,
        borderRadius:5
    },

});


export default class Agreescreen extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
        }
    }
    render(){
        const { navigate } = this.props.navigation;
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.logo_container}>
                    <Image style={styles.logo} 
                        source={require('../images/logo_basic.png')}> 
                    </Image>
                    <Text style={styles.text_header}>Welcome to StoreBoss</Text>
                    <Text style={styles.text_bottom}>By continuing, you agree to the Terms{"\n"}of Use and Privacy Policy.</Text>
                </View>
                <View style={styles.button_container}>
                    <Text style={{fontSize:15,fontWeight:"700"}}>Terms of Use</Text>
                    <ScrollView>
                    <Text style={{fontSize:15,color:"rgba(0,0,0,69)",marginVertical:10}}>
                    Trendsta Pty Ltd built the StoreBoss app as a Free app.{"\n"}
                    This SERVICE is provided by Trendsta Pty Ltd at no cost and is intended for use as is. 
                    This page is used to inform visitors regarding our policies with the collection, 
                    use, and disclosure of Personal Information if anyone decided to use our Service. 
                    If you choose to use our Service, then you agree to the collection 
                    and use of information in relation to this policy. 
                    The Personal Information that we collect is used for providing and improving the Service. 
                    We will not use or share your information with anyone except as described in this Privacy 
                    Policy. 
                    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, 
                    which is accessible at StoreBoss unless otherwise defined in this Privacy Policy. 
                    Information Collection and Use For a better experience, while using our Service, 
                    we may require you to provide us with certain personally identifiable information, 
                    including but not limited to Android advertising ID. 
                    The information that we request will be retained by us and used as described in this privacy policy. 
                    The app does use third party services that may collect information used to identify you. 
                    Link to privacy policy of third party service providers used 
                    by the app Google Play Services Facebook
                    </Text>
                    </ScrollView>
                </View>
                <View style={styles.bottom_container}>
                    <Button
                        onPress={()=> navigate("App")}
                        style={styles.button_fill}>
                        <Text style={styles.text}>Agree</Text>
                    </Button>
                </View>
            </SafeAreaView>
        )
    }
}