import React from 'react';
import { View, StyleSheet, ImageBackground,ActivityIndicator,TouchableHighlight, Image,ScrollView , KeyboardAvoidingView, Text } from 'react-native';
import { TextInput, Button} from 'react-native-paper';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Font from 'expo-font';

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: '#ffffff',
    },
    input_container:{
        flex:6,
        margin:30,
        justifyContent:"flex-start",
        alignContent:"stretch"
    },
    text_header:{
        fontSize:34,
        fontWeight:"bold",
        color:"#010F07",
        fontFamily:"muli-bold",
        elevation:0
    },
    text_bottom:{
        fontSize:16,
        color:"#010F07",
        fontFamily:"muli-bold",
        marginTop:10
    },
    button_fill:{
        backgroundColor:'#39B239',
        padding:5,
        marginTop:15,
        borderRadius:5
    },
    image_picker:{
        backgroundColor:'#39B239',
        borderRadius:50,
        width:100,
        height:100,
        marginBottom:20,
        alignItems:"center",
        justifyContent:"center",
        overflow:"hidden"
    },
    textInput:{
        backgroundColor:"#ffffff",
        fontSize:16,
        marginBottom:10,
        color:"#CCCCD0",
        borderColor:"#EEEEEF",
        fontFamily:"muli-bold",
        borderRadius:5,
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
        fontSize:14,
        textAlign:"right"
    },
    label_text:{
        color:"#454555",
        fontFamily:"muli-bold",
        fontSize:14,
        marginBottom:10
    }
});
export default class SignUpScreen extends React.Component {
    static navigationOptions = {
        title: 'Create An Account'
    };
    constructor (props) {
        super(props);
        const { navigate } = this.props.navigation;
        this.state = {
            name:'',
            email:'',
            username: '',
            password: '',
            confirmpassowrd: '',
            image:null,
            isLoading: false
        };
    }
    state = {fontLoaded: false,};
    async componentDidMount() {
        await Font.loadAsync({
          'muli-bold': require('../assets/fonts/Muli-Medium.ttf'),
        });
    
        this.setState({ fontLoaded: true });
      }
    render () {
        const { navigate } = this.props.navigation;
        let { image } = this.state;
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView  behavior='position' enabled>
                <ScrollView>
                <View style={styles.input_container}>
                    <View style={{justifyContent:"center",alignItems:"center",display:"flex",}}>
                        <TouchableHighlight 
                            style={[styles.image_picker, { borderColor: 'green', borderWidth:1 }]}
                            onPress={() => this._pickImage()}>
                                { image === null ? 
                                    <ImageBackground
                                        style={styles.image_picker}
                                        source={require('../images/ic_avatar.png')}/>:null
                                }
                        {/* {image &&
                            <ImageBackground 
                                style={styles.image_picker}
                                source={{ uri: image }}/>
                        } */}
                        </TouchableHighlight>
                    </View>
                    {this.state.isLoading ? <ActivityIndicator size='large'/>: null}
                    <Text style={styles.label_text}>Name</Text>
                    <TextInput 
                        placeholder="Enter Name"
                        style={styles.textInput} 
                        value={this.state.name} 
                        underlineColorAndroid="#fff"
                        underlineColor="#fff"
                        onChangeText={(text) => {this.setState({name: text});
                    }}/>
                    <Text style={styles.label_text}>Email</Text>
                    <TextInput 
                        placeholder="Enter Email"
                        textContentType='emailAddress'
                        style={styles.textInput} 
                        value={this.state.email} 
                        underlineColorAndroid="#fff"
                        underlineColor="#fff"
                        onChangeText={(text) => {this.setState({email: text});
                    }}/>
                    <Text style={styles.label_text}>Username</Text>
                    <TextInput 
                        placeholder="Enter Username"
                        style={styles.textInput} 
                        value={this.state.username} 
                        underlineColorAndroid="#fff"
                        underlineColor="#fff"
                        onChangeText={(text) => {this.setState({username: text});
                    }}/>
                    <Text style={styles.label_text}>Password</Text>
                    <TextInput 
                        placeholder="Enter Password"
                        textContentType='password' 
                        style={styles.textInput} 
                        secureTextEntry={true} 
                        value={this.state.password}  
                        underlineColorAndroid="#fff"
                        underlineColor="#fff"
                        onChangeText={(text) => {this.setState({password: text});
                    }}/>
                    <Text style={styles.label_text}>Confirm Passowrd</Text>
                    <TextInput 
                        placeholder="Confirm Password"
                        textContentType='password' 
                        style={styles.textInput} 
                        secureTextEntry={true} 
                        value={this.state.confirmpassowrd}  
                        underlineColorAndroid="#fff"
                        underlineColor="#fff"
                        onChangeText={(text) => {this.setState({confirmpassowrd: text});
                    }}/>
                    <Button style={styles.button_fill} onPress={()=> navigate("Agree")}>
                        <Text style={styles.text}>Login</Text>
                    </Button>
                    <Button style={{marginTop:15}}>
                        <Text style={styles.text_black}>Already Have An Account? </Text>
                        <Text style={styles.text_green}>Sign In</Text>
                    </Button>
                </View>
                </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
    componentDidMount() {
        this.getPermissionAsync();
    }
    getPermissionAsync = async () => {
        if (Constants.platform.ios  || Constants.platform.android) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }
    
    _pickImage = async () => {
        let result = await Expo.ImagePicker.launchImageLibraryAsync({
            mediaTypes: Expo.ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
        });
        console.log(result);
        if (!result.cancelled) {
          this.setState({ image: result.uri });
        }
    };
}