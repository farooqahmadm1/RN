import React from 'react';
import { TouchableHighlight,AppRegistry, Button, StyleSheet, Text, View, Image, FlatList, RefreshControl, Picker } from 'react-native';
import { Appbar, Snackbar, List, IconButton, Checkbox,Dimensions } from 'react-native-paper';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import Api from '../utils/Api';
import { FilterModal, Utils } from '../utils/Util';
import { Xui, Calendar, Avatar } from '../utils/Xui';

import Icon from 'react-native-vector-icons/MaterialIcons';


const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  toolbar: {
    height: 56,
    elevation: 2,
    backgroundColor: '#6200EE'
  },
  button: {
    margin: 100
  },
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
      elevation:5,
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"flex-start",
      alignContent:"flex-start",
      borderColor:"#cccccc",
      borderBottomWidth:1,
      borderStyle:"solid"
  },
  appbar_content:{
      height:100,
      display:"flex",
      paddingTop:10,
      paddingBottom:8,
      flexDirection:"column",
      justifyContent:"space-around",
      alignContent:"flex-start",
      alignItems:"flex-start"
  },
  text_green:{
      color:'#39B239'
  },
  button_border:{
      height:30,
      marginTop:15,
      borderRadius:15,
      paddingVertical:10,
      textAlign:"center",
      fontSize:10,
      marginHorizontal:1.2,
      overflow:"hidden"
  }
});


export default class AttendanceScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Attendance',
    tabBarIcon: ({tintColor, focused}) => (
      <Icon
        name="watch-later"
        size={24}
        style={{ color: tintColor }}
      />
    )
  };

  static branchList = [];

  _refreshFromServer () {
    Api.getUsers({branch: this.state.branchId}, false, {sortBy: "humanName", sortOrder: "ASC"}).then((theseEmployees)=>{
      this.setState({employees: theseEmployees});
    }).catch(() => {
      this.setState({ noConnection: true, isLoading: false, employees: [] });
    });
    Api.getAttendance(this.state.branchId, Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")).then((thisList)=>{
      this.setState({attendanceList: thisList, isLoading: false});
    }).catch(() => {
      this.setState({ noConnection: true, isLoading: false, employees: [] });
    });
  }

  constructor (props) {
    super(props);
    this.state = {
      color:['#F3F2F2','#39B239','#4CE5B1','#010F07','#5856D6','#FF8C00'],
      item_one:1,
      item_two:2,
      item_three:3,
      item_four:4,
      item_five:5,
      isLoading: true,
      noConnection: false,
      filterShown: false,
      branchId: Api.userInfo.branchId,
      employees: [],
      attendanceList: [],
      date: new Date(),
      calendarShown: false,
    };
  }
  componentDidMount () {
    this._refreshFromServer();
  }
  componentWillMount() {
    this.branchList = typeof Api.branchList == "undefined" ? []: Api.branchList;
  }

  _getColor = (value) => {
    switch(value) {
      case 0:
          return "#39B239"
      case 1:
          return "#4CE5B1"
      case -1:
        return "#010F07"
      case -2:
        return "#5856D6"
      case -3:
        return "#FF8C00"
    }
  }

  _onPressItem(value) {
    switch (value) {
      case 0:
        this.state.item_three = 0
        break;
    
      default:
        break;
    }

  }

  render () {
    return ([
      (
        <Appbar.Header key="1" style={styles.appbar_header}>
          <Appbar.Content style={styles.appbar_content}
            title={<Text style={styles.header_title}>
                  {parseInt(Api.userInfo.type) === 0 && this.branchList.length > 1 ? Utils.searchArray(Api.branchList, "id", this.state.branchId)["branchName"]: null}
                </Text>}
            subtitle={<Text style={styles.header_subtitle}>Attendance</Text>}
          />
          <Appbar.Action icon="event" onPress={() => {
              this.setState({ calendarShown: true });
              console.log(this.state.attendanceList);
          }}/>
          {parseInt(Api.userInfo.type) === 0 && this.branchList.length > 1 && <Appbar.Action icon="filter-list" onPress={() => {
            this.setState({ filterShown: true });
          }}/>}
        </Appbar.Header>
      ),
      (
        <View key="2" style={{ flex: 1 }}>
          <Calendar date={this.state.date} 
            isVisible={this.state.calendarShown} 
            onDateChange={(date) => {
              this.setState({
                date: date,
                isLoading: true,
                calendarShown: false
              }, () => {
                this.componentDidMount();
              });
            }}
            onDismiss={() => {
              this.setState({
                calendarShown: false
              });
            }}
          />
          <FilterModal 
            title="Filter Checklists"
            isVisible={this.state.filterShown}
            branchList={this.branchList}
            onDismiss={()=> {
              this.setState({ filterShown: false });
            }}
            onSuccess={(branchId) => {
              this.setState(() => {
                return {
                  branchId: branchId,
                  filterShown: false,
                  isLoading: true
                }
              }, () => { this._refreshFromServer(); });
            }}
          />
          <List.Subheader style={{ backgroundColor: '#F3F2F2',padding:30}}>{
            Xui.getFormattedDate(this.state.date, "dd M yy")
          }
          </List.Subheader>
          <FlatList 
              style={{ flex: 1, backgroundColor: '#fff' }}
              refreshControl={
                <RefreshControl 
                  refreshing={this.state.isLoading} 
                  onRefresh={() => {
                    this.setState({ isLoading: true });
                      this._refreshFromServer();
                    }}
                  colors={['teal']}
                />
              }
              data={this.state.employees}
              extraData={this.state}
              keyExtractor={(employee, index) => employee.uid.toString()}
              renderItem={({item})=>{
                // <List.item 
                  // key={item.uid} 
                  // left={() => {
                    let isPresent = false;
                    let presenceType = 0;
                    let attendanceIndex = -1;
                    this.state.attendanceList.forEach((thisAttendance, i) => {
                      if (thisAttendance.userId === item.uid) {
                        isPresent = true;
                        presenceType = parseInt(thisAttendance.type);
                        attendanceIndex = i;
                      }
                    });
                    return <View style={{flex:1,flexDirection:"column",display:"flex",justifyContent:"flex-start",alignItems:"stretch",padding:10,marginHorizontal:10,marginTop:10,borderColor:"#F3F2F2",borderStyle:"solid",borderWidth:1,borderRadius:5}}>
                      {/*<Checkbox status={isPresent ? "checked": "unchecked"} />*/}
                      <View style={{flex:1,display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",}}>              
                        <Avatar backgroundColor={"#fff"} image={item.photoId !== "" ? Api.serverUrl + "/dp/"+item.photoId+".png":Api.serverUrl + "/dp/def.png"} />
                        <Text style={{marginStart:10}}>{item.humanName}</Text>
                      </View>
                      {/* <View style={{flex:1,display:"flex",flexDirection:"row",justifyContent:"flex-start",alignContent:"stretch"}}>
                        <TouchableHighlight style={{flex:1}} onPress={() => {this._onPressItem.bind(this,0)}}>
                          <Text style={[styles.button_border,{backgroundColor:this.state.color[this.state.item_one]}]}>Absent</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{flex:1}} onPress={() => {this._onPressItem.bind(this,1)}}>
                          <Text style={[styles.button_border,{backgroundColor:this.state.color[this.state.item_two]}]}>Present</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{flex:1}} onPress={() => {this._onPressItem.bind(this,-1)}}>
                          <Text style={[styles.button_border,{backgroundColor:this.state.color[this.state.item_three]}]}>Annual Leave</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{flex:1}} onPress={() => {this._onPressItem.bind(this,-2)}}>
                          <Text style={[styles.button_border,{backgroundColor:this.state.color[this.state.item_four]}]}>Sick Leave</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{flex:1}} onPress={() => {this._onPressItem.bind(this,-3)}}>
                          <Text style={[styles.button_border,{backgroundColor:this.state.color[this.state.item_five]}]}>Unpaid Leave</Text>
                        </TouchableHighlight>
                      </View> */}
                      <View>
                        <Picker
                          selectedValue={presenceType}
                          mode={"dialog"}
                          onValueChange={(itemValue, itemIndex)=>{
                            let tempStore = this.state.attendanceList;
                            let index = -1;
                            //console.log("tempStore", tempStore);
                            //console.log("attendanceIndex", attendanceIndex);
                            this.state.attendanceList.forEach((thisAttendance, i) => {
                              if (thisAttendance.userId === item.uid) {
                                index = i;
                              }
                            });
                            console.log("selected item value",itemValue)
                            console.log("index", index);
                            if (Api.userInfo.type > 0) {
                              //non-admin users can't modify ticks
                              return;
                            }
                            Api.modifyAttendance(itemValue, item.uid, Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")).catch(()=>{
                              this.setState({ noConnection: true, isLoading: false});
                            });
                            if (index < 0) {
                              //not found in an array. Create new entry
                              tempStore.push({userId: item.uid, type: itemValue, humanName: item.humanName});
                            } else {
                              //found in array
                              if (itemValue == 0) {
                                //absent
                                tempStore.splice(index, 1);
                              } else {
                                tempStore[index].type = itemValue;
                              }
                            }
                            /*if (attendanceIndex < 0) {//if less than 0, index wasn't found and nothing to delete
                              tempStore.splice(attendanceIndex, 1); //start by removing the entry
                            }
                            if (itemValue == 0) { //marked absent
                              //tempStore.splice(attendanceIndex, 1);
                            } else {
                              tempStore.push({userId: item.uid, type: itemValue});
                              //tempStore[attendanceIndex].type = itemValue;
                            }*/
                            this.setState({attendanceList: tempStore});

                          }}
                        >
                          <Picker.Item label="Absent" value={0} />
                          <Picker.Item label="Present" value={1} />
                          <Picker.Item label="Annual Leave" value={-1} />
                          <Picker.Item label="Sick Leave" value={-2} />
                          <Picker.Item label="Unpaid Leave" value={-3} />
                        </Picker>
                      </View></View>
                  // }}
                  // onPress={()=>{
                  //   let isPresent = false, index = -1, tempStore = this.state.attendanceList;
                  //   return; //this onPress is not used
                  //   if (Api.userInfo.type > 0) {
                  //     //non-admin users can't modify ticks
                  //     return;
                  //   }
                  //   this.state.attendanceList.forEach((thisAttendance, i) => {
                  //     if (thisAttendance.userId === item.uid) {
                  //       isPresent = true;
                  //       index = i;
                  //     }
                  //   });
                  //   Api.modifyAttendance(!isPresent, !isPresent ? item.uid: tempStore[index].id, Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")).catch(()=>{
                  //     this.setState({ noConnection: true, isLoading: false});
                  //   });
                  //   //this._refreshFromServer();
                  //   if (isPresent) {
                  //     //currently present, newly mark as absent
                  //     tempStore.splice(index, 1);
                  //   } else {
                  //     //currently absent, newly mark as present
                  //     tempStore.push({userId: item.uid, type: 1});
                  //   }
                  //   this.setState({attendanceList: tempStore});
                  // }}
                // />
            }}
          />
          <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
        </View>
      )
    ]);
  }
}