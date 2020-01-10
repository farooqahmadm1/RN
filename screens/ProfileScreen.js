import React from 'react';
import { AppRegistry,TouchableHighlight,StyleSheet, Text, View, Image, ScrollView, StatusBar, RefreshControl, Picker, Alert } from 'react-native';
import { Appbar, Snackbar, Button, FAB, Subheading, TouchableRipple, IconButton, List, Caption, Headline, Colors } from 'react-native-paper';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Api from '../utils/Api';
import { Utils,FilterEmployee, FilterProfile,FilterRegion,FilterBranch,FilterPosition } from '../utils/Util';
import { InputBox, Rating } from '../utils/Xui';
import * as Font from 'expo-font';


const styles = StyleSheet.create({
    header_title:{
        fontSize:14,
        color:"#0A1F44",
      },
      header_subtitle:{
        fontSize:30,
        color:"#0A1F44",
        fontWeight:"bold",
        alignSelf:"center"
      },
      appbar_header:{
        backgroundColor:"white",
        height:100,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-start"
      },
      appbar_content:{
        height:100,
        display:"flex",
        marginLeft:-15,
        paddingTop:10,
        paddingBottom:8,
        flexDirection:"column",
        justifyContent:"space-around",
        alignContent:"flex-start"
      },
      header_name:{
          fontSize:24,
          color:"#2D2D2F",
          marginTop:15,
          fontFamily:'muli-bold'
      },
      header_desc:{
        fontSize:16,
        color:"#2D2D2F",
        marginTop:5,
        fontFamily:'muli-bold'
      },
      item:{
         backgroundColor:"white",
         borderBottomWidth:1,
         borderStyle:"solid",
         borderColor:"#cccccc",
         display:"flex",
         flexDirection:"row",
         justifyContent:"space-between",
         alignItems:"stretch",
         padding:20,
         fontSize:16
      },
      logout_button:{
        backgroundColor:'#39B239',
        padding:5,
        marginHorizontal:15,
        marginVertical:15,
        borderRadius:5
      },
      picker:{
        width:"50%",
        textAlign:"right",
        height:0
      },
      text_label:{
        fontFamily:'muli-bold'
      },
      text_value:{
          fontFamily:'muli-bold'
      }
})

export default class ProfileScreen extends React.Component {
  static branchList = [];
  state = {fontLoaded: false,};
  constructor (props) {
    super(props);
    this.state = {
        isLoading: false,
        noConnection: false,
        employeeFilterShown: false,
        positionFilterShown:false,
        branchFilterShown:false,
        regionFilterShow:false,
        userFilterShown: false,
        employee: Api.userInfo,
        branchName:"",
        list : Api.branchList,
        inputFieldShown: "" //empty means input field hidden, humanName means editing name
    }
  }
  
  _refreshFromServer (updateUser = true, retreiveUser = true) {
    let filterArr = {
        userId: this.state.employee.uid
    };
    let newEmployee = JSON.parse(JSON.stringify(this.state.employee));
    delete newEmployee.username;
    delete newEmployee.uid;
    delete newEmployee.password;
    if (Api.userInfo > 0) {
        delete newEmployee.branchId;
        delete newEmployee.type;
        delete newEmployee.region;
        delete newEmployee.position;
    }
    Promise.all([
        updateUser ? Api.updateUserProfile(this.state.employee.uid, newEmployee): 0,
        retreiveUser ? Api.getUsers(filterArr): 0,
        retreiveUser ? Api.checklist.getScore(this.state.employee.username): 0
    ]).then((values)=>{
        if (retreiveUser) {
            this.state.employee = values[1][0];
            this.state.employee["status"] = values[2];
            this.setState({
                employee: values[1][0],
                isLoading: false
            })
        } else {
            this.setState({isLoading: false});
        }
    }).catch(()=>{
        this.setState({noConnection: true});
    });
    /*Api.updateUserProfile(this.state.employee.uid, newEmployee);
    Api.getUsers(filterArr).then((thisList) => {
        this.setState({
            employee: thisList[0],
            isLoading: false
        })
    });*/
  }

  getBranchName(){
    this.state.list.map((type,index)=>{
        if(this.state.employee.branchId === type.id){
            this.state.branchName = type.branchName;
        }
    })
  }

  async componentDidMount() {
    await Font.loadAsync({
      'muli-bold': require('../assets/fonts/Muli-Medium.ttf'),
    });
    this.setState({ fontLoaded: true });
  }
  componentWillMount() {
    this._refreshFromServer(false, true);
    this.branchList = Api.branchList;
    this.getBranchName()
  }
  render() {
    const { navigate } = this.props.navigation;
    console.log(this.state.employee);
    console.log(Api.userInfo, "userInfo");
    
    return ([
        (
            <Appbar.Header key="1" style={{backgroundColor:"white",borderColor:"#cccccc",borderBottomWidth:1,borderStyle:"solid"}}>
                <Appbar.BackAction onPress={()=>this.props.navigation.goBack(null)}/>
                <Appbar.Content title = "Profile"/>
                {parseInt(Api.userInfo.type) === 0 && <Appbar.Action 
                    icon='edit' 
                    onPress = {() => {
                        this.setState({inputFieldShown: 'humanName'});
                    }}/>
                }
                {parseInt(Api.userInfo.type) === 0 && <Appbar.Action 
                    icon='search' 
                    onPress = {() => {
                        this.setState({employeeFilterShown: true});
                    }}/>
                }  
            </Appbar.Header>
          ),
          (
              
      <View key="1" style={{flex: 1, backgroundColor: '#fff' }}>
        {this.state.fontLoaded ? (
        <ScrollView
            style={{ flex: 1, backgroundColor:"#F6F6F6"}}
            refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={() => {
                    this._refreshFromServer(false, true);
                  }}
                  colors={['teal']}
                />
            }
        >
            <FilterProfile 
              title="Slect Option"
              active={Api.userInfo.type}
              subheading="Choose User Type"
              isVisible={this.state.userFilterShown}
              userList={Api.typeList}
              onDismiss={()=> {
                this.setState({ userFilterShown: false });
              }}
              onSuccess={(branchId) => {
                this.state.userFilterShown = false; 
                this.state.employee.type = branchId;
                this.setState({employee: this.state.employee}, ()=>{
                    this._refreshFromServer(true, false);
                });
              }}
            />
            <FilterRegion 
              title="Slect Option"
              active={Api.userInfo.type}
              subheading="Choose Your Region"
              isVisible={this.state.regionFilterShow}
              userList={Api.regionList}
              onDismiss={()=> {
                this.setState({ regionFilterShow: false });
              }}
              onSuccess={(branchId) => {
                this.state.regionFilterShow = false; 
                this.state.employee.region = branchId;
                this.setState({employee: this.state.employee}, ()=>{
                    this._refreshFromServer(true, false);
                });
              }}
            />
            <FilterPosition 
              title="Slect Option"
              active={Api.userInfo.type}
              subheading="Choose Position"
              isVisible={this.state.positionFilterShown}
              userList={Api.positionsList}
              onDismiss={()=> {
                this.setState({ positionFilterShown: false });
              }}
              onSuccess={(branchId) => {
                this.state.positionFilterShown = false; 
                this.state.employee.position = branchId;
                this.setState({employee: this.state.employee}, ()=>{
                    this._refreshFromServer(true, false);
                });
              }}
            />
        
            <FilterBranch 
              title="Slect Option"
              active={parseInt(Api.userInfo.type)}
              subheading="Choose Your Branch"
              isVisible={this.state.branchFilterShown}
              userList={this.branchList}
              onDismiss={()=> {
                this.setState({ branchFilterShown: false });
              }}
                onSuccess={(branchId) => {
                    this.state.branchFilterShown = false;
                    this.state.employee.branchId = branchId;
                    this.getBranchName();
                    this.setState({employee: this.state.employee}, ()=>{
                        this._refreshFromServer(true, false);
                    });
                }}
            />
            <FilterEmployee
                isVisible={this.state.employeeFilterShown}
                onSuccess={ (thisEmployee) => {
                    this.setState({ employee: thisEmployee, isLoading: false, employeeFilterShown: false }, () =>{
                        this._refreshFromServer();
                    });
                }}
                onCancel={ (thisEmployee) => {
                    this.setState({ employeeFilterShown: false });
                }}
            />
            <InputBox
                title={(()=>{
                    switch (this.state.inputFieldShown) {
                        case "humanName":
                            return "Enter Name";
                    }
                })()}
                text={(()=>{
                    switch (this.state.inputFieldShown) {
                        case "humanName":
                            return this.state.employee.humanName;
                    }
                })()}
                isVisible={this.state.inputFieldShown !== ""}
                onCancel={()=>{ this.setState({inputFieldShown: ""}) }}
                onDone={(text) => {
                    let thisEmployee = {};
                    thisEmployee = JSON.parse(JSON.stringify(this.state.employee));
                    switch (this.state.inputFieldShown) {
                        case "humanName":
                            thisEmployee.humanName = text;
                    }
                    this.setState({isLoading: true, inputFieldShown: "", employee: thisEmployee }, ()=>{
                        this._refreshFromServer(true, false);
                    });
                }}
            />
            <View style={{flex: 1,backgroundColor:"white", justifyContent: "center", alignItems: "center", paddingTop: 40,paddingBottom:40,marginBottom:10}}>
                <Image
                    style={{ borderRadius: 50, height: 100, width: 100 }}
                    source={{uri: typeof this.state.employee !== "undefined" && this.state.employee.photoId !== "" ? Api.serverUrl + "/dp/"+this.state.employee.photoId+".png":Api.serverUrl + "/dp/def.png"}}
                />
                    <Text style={styles.header_name}>{typeof this.state.employee.humanName === "undefined" ? "-": this.state.employee.humanName}</Text>
                    <Text style={styles.header_desc}>
                        {typeof this.state.employee.position === "undefined" ? "-": this.state.employee.position+" "}at {this.state.branchName}                    
                    </Text>
                {/* <Text>{this.branchList.length > 1 ? Utils.searchArray(this.branchList, "id", this.state.employee.branchId)["branchName"]: null}</Text> */}
                {/* {typeof this.state.employee.status !== "undefined" ? <Rating rating={this.state.employee.status}/>: null} */}
            </View>
            <View style={styles.item}>
                <Text style={styles.text_label}>Name</Text>
                <Text style={styles.text_value}>{typeof this.state.employee.humanName === "undefined" ? "-": this.state.employee.humanName}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.text_label}>Username</Text>
                <Text style={styles.text_value}>{typeof this.state.employee.username === "undefined" ? "-": this.state.employee.username}</Text>
            </View>
            <TouchableHighlight underlayColor="rgba(57,178,57,0.17)"
                primary onPress={() => {this.setState({positionFilterShown: true});}}>
                <View style={styles.item}>
                    <Text style={styles.text_label}>Position</Text>
                    <Text style={styles.text_value}>{this.state.employee.position}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="rgba(57,178,57,0.17)"
                primary onPress={() => {this.setState({branchFilterShown: true});}}>
                <View style={styles.item}>
                    <Text style={styles.text_label}>Branch</Text>
                    <Text style={styles.text_value}>{this.state.branchName}</Text>
                    {/* <Text style={styles.text_value}>{parseInt(Api.userInfo.type) === 0 && this.branchList.length > 1 ? Utils.searchArray(Api.branchList, "id", this.state.employee.branchId)["branchName"]: null}</Text> */}
                </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="rgba(57,178,57,0.17)"
                primary onPress={() => {this.setState({regionFilterShow: true});}}>
                <View style={styles.item}>
                    <Text style={styles.text_label}>Region</Text>
                    <Text style={styles.text_value}>{this.state.employee.region}</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="rgba(57,178,57,0.17)"
                primary onPress={() => {this.setState({userFilterShown: true});}}>
                <View style={styles.item}>
                    <Text style={styles.text_label}>Type of User</Text>
                    <Text style={styles.text_value}>{Api.typeList[this.state.employee.type]}</Text>
                </View>
            </TouchableHighlight>
            {Api.userInfo.username === this.state.employee.username ? 
                <Button
                    style={styles.logout_button} 
                    onPress={() => {Api.logOut().then(() => {navigate('Auth');});}}>
                    <Text style={{color:"white",fontFamily:'muli-bold'}}>Log Out</Text>
                </Button>: null}
            {Api.userInfo.username !== this.state.employee.username && Api.userInfo.type === 0 ? <Button color={Colors.red400} onPress={() => {
                Alert.alert("Delete User", "Are you sure you want to delete this user?",[
                    {
                        text: "No",
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: ()=>{
                            Api.deleteUser(this.state.employee.uid);
                            this.setState({employee: Api.userInfo}, ()=>{
                                this._refreshFromServer(false, true);
                            });
                        }
                    },
                ])
            }}>Delete</Button>: null}
        </ScrollView>):null}
        <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
          </View>)
    ]);
  }
}