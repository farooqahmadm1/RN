import React from 'react';
import {
  AppRegistry, StyleSheet, ActivityIndicator, View, ScrollView, RefreshControl, Alert, Animated, Easing, TextInput as NativeText, KeyboardAvoidingView  
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Appbar, Headline, Subheading, Card, Title, Paragraph, Text, FAB, Button, TextInput, Switch, TouchableRipple, Snackbar  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Api from '../utils/Api';
import { Xui, Calendar } from '../utils/Xui';
import { AboutDialog, Utils } from '../utils/Util';
import ProfileScreen from '../screens/ProfileScreen';
import { bold } from 'ansi-colors';
import * as Font from 'expo-font';

const styles = StyleSheet.create({
  spanContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  textInput: {
      backgroundColor:"#ffffff",
      fontSize:14,
      marginBottom:10,
      marginLeft: 15,
      marginRight: 15,
      fontFamily:'muli-bold'
  },
  text_percentage:{
    fontSize:14, 
    textAlign: 'right',
    color:"#39B239",
    margin:3,
    fontFamily:'muli-bold'
  },
  percent_container:{
    borderRadius:10,
    paddingHorizontal:7,
    backgroundColor:"rgba(57,178,57,0.17)",
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
    display:"flex",
    elevation:0,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"flex-start",
    borderColor:"#cccccc",
    borderBottomWidth:1,
    borderStyle:"solid"
  },
  appbar_content:{
    height:100,
    display:"flex",
    marginLeft:-15,
    paddingTop:10,
    paddingBottom:8,
    flexDirection:"column",
    justifyContent:"space-around",
    alignItems:"flex-start",
    alignContent:"flex-start"
  },
  text_heading:{
    fontSize:14,
    marginLeft:5,
    fontFamily:'muli-bold'
  }
  /*formButton: {
      ...Platform.select({
          ios: {
              
          },
          android: {
              alignItems: 'center',
              justifyContent: 'center'
          }
      })
  }*/
});

class StatCard extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    /*
      warn prop was discarded in favor of style tag
      backgroundColor: this.props.warn ? '#c70024': '#fff'
    */
    return (
      <Card style={{ ...this.props.style, flex:1,margin:5}}>
        <Card.Content>
          <Paragraph style={{fontFamily:'muli-bold',color:"#939CA1",fontSize:16}}>{this.props.title}</Paragraph>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginTop:20}}>
            <Text style={{ fontFamily:'muli-bold',fontSize:18}}>{this.props.stat}</Text>
            <View style={{justifyContent:"flex-end",alignItems:"flex-end",borderRadius:15}}>
              <View style={styles.percent_container}>
                {
                  typeof this.props.percentage == "undefined" ?
                  null :
                  <Text style={styles.text_percentage}>{this.props.percentage + "%"}</Text>
                }
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }
}
class MainStatCard extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    /*
      warn prop was discarded in favor of style tag
      backgroundColor: this.props.warn ? '#c70024': '#fff'
    */
    return (
      <Card style={{ ...this.props.style, flex:1,margin:5}}>
        <Card.Content>
          <Paragraph style={{fontFamily:'muli-bold',color:"white",fontSize:20}}>{this.props.title}</Paragraph>
          <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginTop:20}}>
          <Text style={{fontFamily:'muli-bold',fontSize:24,color:"white" }}>{this.props.stat}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  }
}


class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      noConnection: false,
      isLoading: true,
      salesStats: {
        agedStock: {
          toMonth: "0",
          toMonthProgress: 0
        },
        agedStockTarget: {
          toMonth: "0"
        },
        discount: {
          today: 0,
          toMonth: "0"
        },
        netProfit: {
          toYear: "0",
          vsSalesYTD: 0
        },
        salesTarget: {
          today: null,
          toYear: "0",
          toYearProgress: 0
        },
        scrapping: {
          today: 0,
          toMonth: "0"
        },
        shrinkage: {
          today: 0,
          toMonth: "0"
        },
        todaysSales: 0,
        toMonthSales: "0",
        toYearSales: 0,
        margin: {
          toMonth: "0",
          today: 0
        }
      },
      growthStats: {
        discount: {
          today: 0
        },
        margin: {
          today: 0
        },
        monthsGrowth: 0,
        netProfit: {
          toYear: 0
        },
        shrinkage: {
          toMonth: 0
        },
        todaysGrowth: 0,
        yearsGrowth: 0
      },
      anim: {
        card_fade: new Animated.Value(0)
      }
    }


  }
//, opacity: anim.card_fade, transform: [ { scale: anim.card_fade } ]

  static navigationOptions = (navigation) => {
  
    return {
        title:<Text style={styles.header_title}>Overview</Text>,
        subtitle:<Text style={styles.header_subtitle}>DashBoard</Text>,
      
        headerRight: (nav) => {
          return ([
            <Appbar.Action key="1" icon={require('../images/home_icon/ic_user.png')} onPress={()=>{
              if (parseInt(Api.userInfo.type) === 0) {
                nav.navigate('SubProfile');
              } else {
                nav.navigate('Profile');
              }
            }}/>,
            <Appbar.Action key="2" icon={require('../images/home_icon/ic_setting.png')} onPress={()=>{
              //nav.navigate('SubSettings');
              nav.navigate('Settings');
            }}/>
          ]);
        }
    };
  };
  state = {
    fontLoaded: false,
  };
  async componentDidMount() {
    await Font.loadAsync({
      'muli-bold': require('../assets/fonts/Muli-Medium.ttf'),
    });
    this.setState({ fontLoaded: true });
    var thisDate = new Date;

    //used to initialize static lists
    thisDate.setDate(thisDate.getDate());
    Api.populateLists().then(() => {
      Api.reporting.salesStats(Xui.getFormattedDate(thisDate, "yyyy-mm-dd")).then((ox) => {
        this.setState({
          salesStats: ox,
          isLoading: false
        });
      }).catch((ex) => {
        this.setState({ noConnection: true, isLoading: false});
      });
      
      Api.reporting.growthStats(Xui.getFormattedDate(thisDate, "yyyy-mm-dd")).then( async (ox) => {
        this.setState({
          growthStats: ox
        });
  
        Animated.timing(this.state.anim.card_fade, {
          toValue: 1,
          easing: Easing.elastic(2),
          duration: 1000,
          useNativeDriver: true,
        }).start();
  
      }).catch((ex) => {
        this.setState({ noConnection: true, isLoading: false});
        Animated.timing(this.state.anim.card_fade, {
          toValue: 1,
          easing: Easing.elastic(2),
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    });
    /*Api.reporting.salesStats(Xui.getFormattedDate(thisDate, "yyyy-mm-dd")).then((ox) => {
      this.setState({
        salesStats: ox,
        isLoading: false
      });
    }).catch((ex) => {
      this.setState({ noConnection: true, isLoading: false});
    });
    
    Api.reporting.growthStats(Xui.getFormattedDate(thisDate, "yyyy-mm-dd")).then( async (ox) => {
      this.setState({
        growthStats: ox
      });

      Animated.timing(this.state.anim.card_fade, {
        toValue: 1,
        easing: Easing.elastic(2),
        duration: 1000,
        useNativeDriver: true,
      }).start();

    }).catch((ex) => {
      this.setState({ noConnection: true, isLoading: false});
      Animated.timing(this.state.anim.card_fade, {
        toValue: 1,
        easing: Easing.elastic(2),
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });*/

    //register for push notifications
    //Utils.registerForPushNotificationsAsync();
  }

  render() {
    const { navigate } = this.props.navigation;
    const { salesStats, growthStats, anim } = this.state;

    if (this.state.isLoading && typeof salesStats.todaysSales == "undefined") {
      return (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#fff' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              colors={['teal']}
            />}
        ></ScrollView>
      );
    }

    var animStyles = {};
    animStyles.card_intro = {
      opacity: anim.card_fade,
      transform: [ { scale: anim.card_fade } ]
    };

    return (
      <View  style={{ flex: 1 }}>
        
        <ScrollView
          style={{ flex: 1, backgroundColor: '#F9FBFD' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => {
                this.setState({ isLoading: true });
                this.componentDidMount();
              }}
              colors={['teal']}
            />}
        >
          {this.state.fontLoaded ? (
          <View style={{ flex: 1, margin: 10 }}>
            <Subheading style={styles.text_heading}>Total Sales</Subheading>
            <Animated.View style={[animStyles.card_intro, { flex: 1, flexDirection: 'column' }]}>
              <MainStatCard
                title="Yesterday"
                large={true}
                stat={Xui.formatCurrency(salesStats.todaysSales)}
                percentage={growthStats.todaysGrowth}
                style={{backgroundColor: '#39B239'}}
              />
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <StatCard
                  title="Month to Date"
                  stat={Xui.formatCurrency(salesStats.toMonthSales)}
                  percentage={growthStats.monthsGrowth}
                  style={{backgroundColor: '#FFFFFF'}}
                />
                <StatCard
                  title="Month to Date"
                  stat={Xui.formatCurrency(salesStats.toYearSales)}
                  percentage={growthStats.yearsGrowth}
                  style={{backgroundColor: '#FFFFFF'}}
                />
              </View>
            </Animated.View>
            <Subheading style={styles.text_heading}>Margin</Subheading>
            <Animated.View style={[animStyles.card_intro, { flex: 1, flexDirection: 'row' }]}>
              <StatCard
                title="Yesterday"
                stat={Xui.formatCurrency(salesStats.margin.today)}
                style={{backgroundColor: '#FFFFFF'}}
              />
              <StatCard
                title="Month to Date"
                stat={Xui.formatCurrency(salesStats.margin.toMonth)}
                style={{backgroundColor: '#FFFFFF'}}
              />
            </Animated.View>
            <Subheading style={styles.text_heading}>Target</Subheading>
            <Animated.View style={[animStyles.card_intro, { flex: 1, flexDirection: 'row' }]}>
              <StatCard
                title="Yesterday"
                stat={Xui.formatCurrency(salesStats.shrinkage.today)}
                style={{backgroundColor: '#FFFFFF'}}
              />
              <StatCard
                title="Month to Date"
                stat={Xui.formatCurrency(salesStats.shrinkage.toMonth)}
                style={{backgroundColor: '#FFFFFF'}}
              />
            </Animated.View>
            <Subheading style={styles.text_heading}>Other Expenses</Subheading>
            <Animated.View style={[animStyles.card_intro, { flex: 1, flexDirection: 'row' }]}>
              <StatCard
                title="Yesterday"
                stat={Xui.formatCurrency(salesStats.discount.today)}
                style={{backgroundColor: '#FFFFFF'}}
              />
              <StatCard
                title="Month to Date"
                stat={Xui.formatCurrency(salesStats.discount.toMonth)}
                style={{backgroundColor: '#FFFFFF'}}
              />
            </Animated.View>
          </View>
          ):null}
        </ScrollView>
        {parseInt(Api.userInfo.type) === 0 && <FAB
          style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor:"#39B239",
            }}
          icon='edit'
          onPress = {() => {
            //Alert.alert("You clicked!");
            navigate('SubSales');
          }}
        />}
        <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
      </View>
    );
  }
}



class SalesScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: false,
      totalSales: '',
      margin: '',
      shrinkage: '',
      scrapping: '',
      discount: '',
      salesTarget: '',
      agedStock: '',
      netProfit: '',
      agedStockTarget: '',
      calendarShown: false,
      date: new Date(),
      noConnection: false,  
    };
  }

  /*static navigationOptions = (navigation) => {
    return {
        title: "Sales"
    };
  };*/
  _refreshFromServer () {
    Api.reporting.allStats(Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"), 1).then((theseStats) => {
      this.setState({
        isLoading: false,
        noConnection: false,
        totalSales: theseStats.sales !== null ? theseStats.sales.toString(): '',
        margin: theseStats.sales !== null ? theseStats.margin.toString(): '', //suing sales stat to check if other stats are also available/unavailable
        shrinkage: theseStats.sales !== null ? theseStats.shrinkage.toString(): '',
        scrapping: theseStats.sales !== null ? theseStats.scrapping.toString(): '',
        discount: theseStats.sales !== null ? theseStats.discount.toString(): '',
        salesTarget: theseStats.sales !== null ? theseStats.salesTarget.toString(): '',
        agedStock: theseStats.sales !== null ? theseStats.agedStock.toString(): '',
        netProfit: theseStats.sales !== null ? theseStats.netProfit.toString(): '',
        agedStockTarget: theseStats.sales !== null ? theseStats.agedStockTarget.toString(): '',
      });
    }).catch(() => {
      this.setState({ noConnection: true, isLoading: false });
    });
  }

  componentDidMount () {
    this._refreshFromServer();
  }

  styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
});

  render() {
    const { navigate } = this.props.navigation;
    let today = new Date();
    return ([
    (
      <Appbar.Header key="1" style={styles.appbar_header}>
          <Appbar.BackAction onPress={()=>this.props.navigation.goBack(null)}/>
          <Appbar.Content  style={styles.appbar_content}
              title={<Text style={styles.header_title}>{Xui.getFormattedDate(this.state.date, 'dd-MM-yy')}</Text>}
              subtitle={<Text style={styles.header_subtitle}>Sales</Text>}
          />
          {parseInt(Api.userInfo.type) === 0 && <Appbar.Action icon={require('../images/home_icon/calendar.png')} onPress={() => {
              this.setState({ calendarShown: true });
          }}/>}
      </Appbar.Header>
    ),
    (
      <KeyboardAvoidingView key="2" behavior="padding" style={{ flex: 1 }}>

        <ScrollView 
            style={{ flex: 4,paddingTop:10,paddingBottom:50, backgroundColor: '#f6f6f6' }}
            keyboardDismissMode={"on-drag"}
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
          <Calendar date={this.state.date} 
              isVisible={this.state.calendarShown} 
              onDateChange={(date) => {
                  console.log(date);
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
          {/* <TouchableRipple onPress={() => {
            let thisDate = new Date();
            thisDate = this.state.date;
            if (this.state.date.getFullYear() === today.getFullYear()) {
              //currently in this year
              thisDate.setFullYear(this.state.date.getFullYear() - 1);
            } else {
              thisDate.setFullYear(this.state.date.getFullYear() + 1);
            }
            this.setState({ date: thisDate }, () => {
              this.componentDidMount();
            });
          }}>
              <View style={this.styles.row}>
                  <Paragraph style={{ flex: 1 }}>Previous Year</Paragraph>
                  <View pointerEvents="none">
                  <Switch value={this.state.date.getFullYear() === today.getFullYear() ? false: true} />
                  </View>
              </View>
          </TouchableRipple> */}
          <TextInput selectTextOnFocus={true} 
            placeholder='Total Sales'
            style={styles.textInput} 
            value={this.state.totalSales} 
            keyboardType='numeric' 
            returnKeyType='next'
            onChangeText={(text) => {
              this.setState({totalSales: text});
            }}
            underlineColorAndroid='#fff'
            underlineColor="#fff"
          />
          <TextInput selectTextOnFocus={true} 
            placeholder='Margin' 
            style={styles.textInput} 
            value={this.state.margin} 
            keyboardType='numeric' 
            onChangeText={(text) => {
              this.setState({margin: text});
            }}
            underlineColorAndroid='#fff'
            underlineColor="#fff"
          />
          <TextInput selectTextOnFocus={true} 
            placeholder='Target' style={styles.textInput} 
            value={this.state.shrinkage} 
            keyboardType='numeric' 
            onChangeText={(text) => {
              this.setState({shrinkage: text});
            }}
            underlineColorAndroid='#fff'
            underlineColor="#fff"
          />
          <TextInput selectTextOnFocus={true} 
            placeholder='Wages' 
            style={styles.textInput} 
            value={this.state.scrapping} 
            keyboardType='numeric'
            onChangeText={(text) => {
              this.setState({scrapping: text});
            }}
            underlineColorAndroid='#fff'
            underlineColor="#fff"
          />
          <TextInput selectTextOnFocus={true} 
            placeholder='Other Expenses' 
            style={styles.textInput} 
            value={this.state.discount} 
            keyboardType='numeric' 
            onChangeText={(text) => {
              this.setState({discount: text});
            }}
            underlineColorAndroid='#fff'
            underlineColor="#fff"
          />
          <TextInput selectTextOnFocus={true} 
            placeholder='Staff Cost' 
            style={styles.textInput} 
            value={this.state.agedStock} 
            keyboardType='numeric' 
            onChangeText={(text) => {
              this.setState({agedStock: text});
            }}
            underlineColorAndroid='#fff'
            underlineColor="#fff"
          />
          <TextInput selectTextOnFocus={true} 
            placeholder='Staff Cost Target' 
            style={styles.textInput} 
            value={this.state.agedStockTarget} 
            keyboardType='numeric' 
            underlineColorAndroid='#fff'
            underlineColor="#fff"
            onChangeText={(text) => {
              this.setState({agedStockTarget: text});
          }}/>
          <TextInput selectTextOnFocus={true} 
            placeholder='Net Profit' 
            style={styles.textInput} 
            value={this.state.netProfit} 
            keyboardType='numeric' 
            underlineColorAndroid='#fff'
            underlineColor="#fff"
            onChangeText={(text) => {
              this.setState({netProfit: text});
          }}/>
          
        </ScrollView>
        <FAB
          style={{ 
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor:"#39B239"
          }}
          icon='done'
          onPress = {() => {
              this.setState({ isLoading: true });
              Api.stats.setAll(Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"), 1, this.state).then(() => {
                this.componentDidMount();
              }).catch(() => {
                this.setState({ noConnection: true, isLoading: false });
              });
          }}
        />
        <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
      </KeyboardAvoidingView>
    )
    ]);
  }
}

const HomeStack = createStackNavigator(
  {
    SubHome: HomeScreen,
    SubProfile: ProfileScreen,
    SubSales: SalesScreen,
    //SubSettings: SettingsScreen
  },
  {
    intialRouteName: 'PageA',
    navigationOptions: {
      header: (headerProps) => {
          //return Xui.headerRenderer(headerProps);
          //console.log(headerProps.scene.route.routeName);
          //return null;
          if (headerProps.scene.route.routeName == "SubHome" ) {
            return Xui.headerRenderer(headerProps);
          } else {
            //console.log(headerProps);
            return null;
          }
      },
    }
  }
);
HomeStack.navigationOptions = {
  tabBarLabel: 'Overview',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon
      name="dashboard"
      size={26}
      style={{ color: tintColor }}
    />
  )
};
export default HomeStack;
