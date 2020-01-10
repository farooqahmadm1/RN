import React from 'react';
import { AppRegistry, Button, StyleSheet, Text, View, Image, ScrollView, StatusBar, RefreshControl, Animated, Easing } from 'react-native';
import { Appbar, List, Snackbar, TouchableRipple, Caption } from 'react-native-paper';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Api from '../utils/Api';
import { Avatar, Rating } from '../utils/Xui';
import { FilterModal } from '../utils/Util';

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
  image_conainter:{
    display:"flex",
    flexDirection:"row",
    flex:1,
    justifyContent:"space-around",
    alignItems:"center",
    alignContent:"center",
    marginVertical:50,
    marginHorizontal:10
  },
  image_second:{
    borderRadius: 36, 
    height: 72, 
    width: 72,
    borderColor:"#39B239",
    borderWidth:3,
    borderStyle:"solid" 
  },
  image_first:{
    borderRadius:60,
    height:120,
    width:120,
    borderColor:"#39B239",
    borderWidth:3,
    borderStyle:"solid"
  },
  medal: {
    position: "absolute",
    top: -28
  },
  medalContainer_first: {
    position: "absolute",
    bottom: -15
  },
  medalContainer: {
    position: "absolute",
    bottom: -15
  }
});

class LeaderItem extends React.Component {
  styles = {
    container: {
      flex: 1, 
      padding:17,
      flexDirection: "row",
      borderColor:"#F2F2F2",
      borderStyle:"solid",
      borderWidth:1,
      borderRadius:5,
      marginVertical:5,
      marginHorizontal:10
    },
    avatar: {
      borderRadius: 18,
      height: 36,
      width: 36,
      padding: 5,
      paddingEnd:10,
      borderColor: "#fff"
    },
    medal: {
      transform: [{scale: 0.5}]
    },
    medalContainer: {
      position: "relative",
      left: 20,
      top: 0
    },
    nameText: {
      color: "#010F07",
      fontWeight: "500",
      paddingTop: 10,
      fontSize: 16
    },
    progressBar: {
      height: 30,
      borderRadius: 7,
      backgroundColor: "#b7e1d8",
      width: 200,
      overflow: "hidden",
      elevation: 0
    },
    progressBarFill: {
      height: 30,
      backgroundColor: "#00b8d4",
      width: 200,
    },
    scoreLabel: {
      fontSize: 13,
      opacity: 0.8,
      color: "#fff",
      fontWeight: "500",
    },
    scoreValue: {
      fontSize: 15,
      color: "#fff",
      fontWeight: "600"
    }
  };
  constructor (props) {
    super(props);
    this.state = {

      //anim_progress: new Animated.Value(0)
    }
  }
  componentDidMount() {
    /*Animated.timing(this.state.anim_progress, {
      toValue: this.props.score / 100,
      easing: Easing.ease,
      duration: 200,
      useNativeDriver: true,
    }).start();*/
  }

  render () {
    medalList = [
      0,
      require('../images/medal1.png'),
      require('../images/medal2.png'),
      require('../images/medal3.png'),
    ];
    return <TouchableRipple onPress={()=>console.log("dfdf")}>
      <View style={[this.styles.container, {backgroundColor: this.props.background}]}>
        {/*<Avatar backgroundColor={"green"} size={90} text={"SD"}/>*/}
        <View style={{paddingEnd:15}}>
          <Text style={this.styles.nameText}>{this.props.medalNumber}</Text>
        </View>
        <View>
          <Image
            style={this.styles.avatar}
            source={{uri: this.props.image}}
          />
          {/* {typeof this.props.medalNumber != "undefined" && 
          <View style={this.styles.medalContainer}>
            <Image
              source={medalList[this.props.medalNumber]}
              style={this.styles.medal}
            />
          </View>
          } */}
        </View>
        <View style={{flex: 1, paddingLeft: 10}}>
          <Text style={this.styles.nameText}>{this.props.humanName}</Text>
          {/* <View style={this.styles.progressBar}>
            <View style={[this.styles.progressBarFill, {width: 200 * this.props.score/ 100}]}></View>
            <Animated.View 
              style={[
                this.styles.progressBarFill, 
                {
                  transform: [
                    {scaleX: this.state.anim_progress}, 
                    {translateX: this.state.anim_progress.interpolate({inputRange: [0, parseFloat(this.props.score)], outputRange: [-200 + (2 * parseFloat(this.props.score)), 0]})}
                  ]
                }
              ]}></Animated.View>
          </View> */}
        </View>
        {/* <View style={{flex: 1, paddingLeft: 10, paddingTop: 15, alignItems: "flex-end"}}>
          <Text style={this.styles.scoreLabel}>SCORE</Text>
          <Text style={this.styles.scoreValue}>{this.props.score + "%"}</Text>
          <Text></Text>
        </View> */}
      </View>
    </TouchableRipple>
  }
}
export default class LeaderBoardScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Leaderboard',
    tabBarIcon: ({tintColor, focused}) => (
      <Icon
        name="star-half"
        size={26}
        style={{ color: tintColor }}
      />
    )
  };

  static branchList = [];

  constructor (props) {
    super(props);
    this.state = {
      isLoading: true,
      noConnection: false,
      filterShown: false,
      branchId: Api.userInfo.branchId,
      employees: []
    };
  }

  _refreshFromServer () {
    Api.getEmployeesOfBranch(this.state.branchId).then((theseEmployees)=>{
      this.setState({isLoading: false, employees: theseEmployees});
    }).catch(() => {
      this.setState({ noConnection: true, isLoading: false, employees: [] });
    });
  }
  componentWillMount() {
    this.branchList = typeof Api.branchList == "undefined" ? []: Api.branchList;
  }
  componentDidMount() {
    this._refreshFromServer();
  }

  render () {
    return ([
      (
        <Appbar.Header key="1" style={{backgroundColor:"white"}}>
            <Appbar.Content style={{backgroundColor:"white"}}
                title="Leaderboard"
            />
            {parseInt(Api.userInfo.type) === 0 && this.branchList.length > 1 && <Appbar.Action icon="filter-list" onPress={() => {
              this.setState({ filterShown: true });
            }}/>}
        </Appbar.Header>
      ),
      (
        <View key="2" style={{ flex: 1 }}>
          <ScrollView 
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
          >
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
            {
              this.state.employees.length === 0 ? <Caption style={{margin: 10, fontSize: 14, fontStyle: 'italic'}}>No employees present</Caption>
              : <View style={styles.image_conainter}>
              <View style={{alignItems:"center"}}>
                <Image
                  style={styles.image_second}
                  source={{uri: typeof this.state.employees[1] !== "undefined" && this.state.employees[1].photoId !== "" ? Api.serverUrl + "/dp/"+this.state.employees[1].photoId+".png":Api.serverUrl + "/dp/def.png"}}
                />
                <View style={styles.medalContainer}><Image source={require('../images/leader_icon/two.png')}/></View>
              </View>
              <View style={{alignItems:"center"}}>
                <View style={styles.medal}><Image source={require('../images/leader_icon/crowns.png')}/></View>
                <Image
                  style={styles.image_first}
                  source={{uri: typeof this.state.employees[0] !== "undefined" && this.state.employees[0].photoId !== "" ? Api.serverUrl + "/dp/"+this.state.employees[0].photoId+".png":Api.serverUrl + "/dp/def.png"}}
                />  
                <View style={styles.medalContainer_first}><Image source={require('../images/leader_icon/one.png')}/></View>
              </View>
              <View style={{alignItems:"center"}}>
                <Image
                  style={styles.image_second}
                  source={{uri: typeof this.state.employees[2] !== "undefined" && this.state.employees[2].photoId !== "" ? Api.serverUrl + "/dp/"+this.state.employees[2].photoId+".png":Api.serverUrl + "/dp/def.png"}}
                />
                <View style={styles.medalContainer}><Image source={require('../images/leader_icon/three.png')}/></View>
              </View>
            </View>
            }
            {
              typeof this.state.employees === "undefined" ? null: 
              this.state.employees.map(
                  (employee, index) => (
                    <LeaderItem
                      key={employee.uid}
                      // medalNumber={index < 3 ? index + 1: null}
                      medalNumber={index + 1}
                      background={(()=>{
                        // let alpha = 0;
                        // switch (index) {
                        //   case 0: {
                        //     alpha = 1;
                        //     break;
                        //   }
                        //   case 1: {
                        //     alpha = .8;
                        //     break;
                        //   }
                        //   case 2: {
                        //     alpha = .6;
                        //     break;
                        //   }
                        //   default: {
                        //     alpha = 0.5 - (0.2 * (index - 2) / (this.state.employees.length - 3));
                        //     break;

                        //   }
                        // }
                        return "white";
                      })()}
                      image={employee.photoId !== "" ? Api.serverUrl + "/dp/"+employee.photoId+".png":Api.serverUrl + "/dp/def.png"}
                      humanName={(employee.humanName + " ").split(" ")[0]}
                      score={employee.status}
                    />
                  )/*(
                      <List.Item 
                          key={employee.uid}
                          title={employee.humanName} 
                          description={()=>{
                            return <Rating rating={employee.status} />;
                          }}
                          left={()=>{
                            return <Avatar backgroundColor={"#fff"} image={employee.photoId !== "" ? Api.serverUrl + "/dp/"+employee.photoId+".png":Api.serverUrl + "/dp/def.png"} />
                          }}
                          onPress={()=>{}}
                      />
                  )*/
              )
            }
          </ScrollView>
          <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
        </View>
      )
    ]);
  }
}
