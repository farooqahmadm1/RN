import React from 'react';
import { View, ScrollView,StyleSheet, ActivityIndicator, AsyncStorage,NavigationActions, Platform, Image, KeyboardAvoidingView, InputAccessoryView, Alert, Animated, Easing, Picker, Linking, Text } from 'react-native';
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
    header_container:{
        flex:3,
        margin:30,
        justifyContent:"center",
        alignItems:"stretch"
    },
    input_container:{
        flex:6,
        margin:30,
        justifyContent:"flex-start",
        alignContent:"stretch"
    },
    text_header:{
        fontSize:30,
        fontWeight:"bold",
        color:"#010F07",
        fontFamily:"muli-bold"
    },
    text_bottom:{
        fontSize:14,
        color:"#010F07",
        marginTop:10,
        fontFamily:"muli-bold"
    },
    button_fill:{
        backgroundColor:'#39B239',
        padding:5,
        marginTop:15,
        borderRadius:5
    },
    textInput:{
        backgroundColor:"#ffffff",
        fontSize:14,
        marginBottom:10,
        borderColor:"#EEEEEF",
        borderRadius:5,
        fontFamily:"muli-bold",
        borderWidth:1,
        borderStyle:"solid"
    },
    text:{
        color:'white',
        fontFamily:"muli-bold",
        fontSize:14
    },
    text_green:{
        color:'#39B239',
        fontFamily:"muli-bold",
        fontSize:12
    },
    text_black:{
        color:'#000000',
        fontFamily:"muli-bold",
        fontSize:12
    },
    forget_password:{
        justifyContent:"center",
        alignItems:"stretch",
        color:"#888892",
        fontSize:12,
        textAlign:"right",
        marginTop:5,
        fontFamily:"muli-bold",
        marginBottom:5
    },
    label_text:{
        color:"#454555",
        fontFamily:"muli-bold",
        fontSize:14,
        marginBottom:10
    }
});
export default class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Sign In'
    };
    state = {fontLoaded: false,};
    async componentDidMount() {
        await Font.loadAsync({
          'muli-bold': require('../assets/fonts/Muli-Medium.ttf'),
        });
    
        this.setState({ fontLoaded: true });
      }
    /*_signIn () {
        const { navigate } = this.props.navigation;
        if (this.state.username == "" || this.state.password == "") {
            return;
        }

        Api.authenticate(this.state.username.toLowerCase(), this.state.password).then(async (result) => {
            console.log(result);
            if (result.message == "authFail") {
                Alert.alert("Invalid credentials.");
            } else {
                await AsyncStorage.setItem('token', result.token);
                this.props.navigation.navigate('App');
            }
    });*/
    _signIn = async () => {
        const { navigate } = this.props.navigation;
        let thisCompany;
        if (this.state.username == "" || this.state.password == "") {
            return true;
        }
        this.setState({isLoading: true});
        // if (this.state.company != "") {
        //     //company has been entered, resolve it
        //     thisCompany = await Api.resolveCompany(this.state.company.toLowerCase());
        //     if (!thisCompany) {
        //         //company not found
        //         Alert.alert("Invalid company code.");
        //         this.setState({isLoading: false});
        //         return true;
        //     }
        //     await AsyncStorage.setItem('apiUrl', thisCompany.url);
        //     Api.serverUrl = thisCompany.url;
        // }

        await Api.authenticate(this.state.username.toLowerCase(), this.state.password).then(async (result) => {
            console.log(result);
            console.log(result);
            if (result.token == "authFail") {
                Alert.alert("Invalid credentials.");
                AsyncStorage.removeItem('apiUrl');
                this.setState({isLoading: false});
            } else {
                await AsyncStorage.setItem('token', result.token);
                this.props.navigation.navigate('App');
            }
        });
        return true;
    }
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            company: '',
            isLoading: false
        };
    }

    render () {
        const { navigate } = this.props.navigation;
        //<KeyboardAvoidingView style={{flex: 2, justifyContent: 'center', backgroundColor: '#f6f6f6'}} behavior='position' enabled>
        return (
            <View  style={styles.container}>
            {this.state.fontLoaded ? (
            <View style={styles.container}>
                {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../images/login.png')} />
                </View> */}
                <View style={styles.header_container}>
                    <Text style={styles.text_header}>Welcome Back</Text>
                    <Text style={styles.text_bottom}>Enter your Username and Password for {"\n"}sign in</Text>
                </View>
                
                <View style={styles.input_container}>
                    {/*<Picker
                        selectedValue={1}
                        onValueChange={(itemValue, itemIndex) => this.setState({selectedId: itemValue})}
                    >
                        {
                            this.state.itemList.map( item => <Picker.Item 
                                label={item["itemLabel"]} 
                                value={item["id"]}
                                key={item["id"]} />)
                        }
                    </Picker>*/}
                    {this.state.isLoading ? <ActivityIndicator size='large'/>: null}
                    {/* <Text>Company</Text> */}
                    {/* <TextInput
                        label="Company"
                        style={styles.textInput} 
                        value={this.state.company} 
                        onChangeText={(text) => {this.setState({company: text});
                    }}/> */}
                    <Text style={styles.label_text}>Username</Text>
                    <TextInput 
                        placeholder="Username"
                        textContentType='emailAddress'
                        style={styles.textInput} 
                        value={this.state.username} 
                        underlineColor="#fff"
                        underlineColorAndroid="#fff"  
                        onChangeText={(text) => {this.setState({username: text});
                    }}/>
                    <Text style={styles.label_text}>Password</Text>
                    <TextInput 
                        placeholder="Password"
                        textContentType='password' 
                        style={styles.textInput} 
                        secureTextEntry={true} 
                        value={this.state.password}
                        underlineColor="#fff"
                        underlineColorAndroid="#fff"  
                        onChangeText={(text) => {this.setState({password: text});
                    }}/>
                    <Text 
                        style={styles.forget_password}
                        onPress={()=> navigate('ForgotPass')}>
                        Forget Password
                    </Text>
                    <Button style={styles.button_fill} raised primary onPress={() => this._signIn()}>
                        <Text style={styles.text}>Login</Text>
                    </Button>
                    {/* { <Button primary 
                        onPress={()=> this.props.navigation.navigate('App', {}, NavigationActions.navigate({ routeName: 'Main'}))}>Skip Ahead</Button> } */}
                    <Button style={{marginTop:15}} onPress={()=> navigate('SignUp')}>
                        <Text style={styles.text_black}>Don't have an account? </Text>
                        <Text style={styles.text_green}>Sign Up</Text>
                    </Button>
                </View>
            </View>
            ):null}
            </View>
        );
    }
}