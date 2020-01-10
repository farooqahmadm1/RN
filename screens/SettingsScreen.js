import React from 'react';
import { AppRegistry,TouchableHighlight, StyleSheet, Text, View, Image, ScrollView, StatusBar, RefreshControl } from 'react-native';
import { Appbar, Snackbar, Button } from 'react-native-paper';
import { createStackNavigator, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Api from '../utils/Api';
import { AboutDialog } from '../utils/Util';

const styles = StyleSheet.create({

  container:{
    display:"flex",
    justifyContent:"flex-start",
    alignItems:"stretch",
    flex:1,
    backgroundColor:"white",
    flexDirection:"column"
  },
  item_container:{
    display:"flex",
    justifyContent:"flex-start",
    alignItems:"center",
    flexDirection:"row",
    paddingHorizontal:20,
    paddingVertical:15
  },
  heading:{
    fontSize:14,
    color:"#1D1E2C",
    fontWeight:"bold",
    margin:20
  },
  reguler:{
    fontSize:16,
    color:"#1D1E2C",
    marginLeft:25
  },
  reguler_green:{
    fontSize:16,
    color:"green",
    marginLeft:25
  },
  icon:{
    width:18,
    height:18,
    marginLeft:5
  },
  icon_logo:{
    width:22,
    height:22,
    marginLeft:5
  }
})

export default class SettingsScreen extends React.Component {
  
  
  constructor (props) {
    super(props);
    this.state = {
      settingsDialogShown: false
    }
  }

  static navigationOptions = (navigation) => {
    return {
        title: "Settings"
    };
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>General</Text>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_email.png')} />
            <Text style={styles.reguler}>Email</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_lock.png')} />
            <Text style={styles.reguler}>Change Password</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_tab_notification.png')} />
            <Text style={styles.reguler}>Notification Settings</Text>
          </View>
        </TouchableHighlight>
        <Text style={styles.heading}>Application</Text>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)" raised primary onPress={() => {this.setState({settingsDialogShown: true});}}>
          <View style={styles.item_container}>
            <Image style={styles.icon_logo} source={require('../images/logo_basic.png')} />
            <Text style={styles.reguler}>About StoreBoss</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_privacy.png')} />
            <Text style={styles.reguler}>Privacy Policy of StoreBoss</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_document.png')} />
            <Text style={styles.reguler}>Term of Service</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_feedback.png')} />
            <Text style={styles.reguler}>Send Feedback</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_update.png')} />
            <Text style={styles.reguler}>Check for Update</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor="rgba(57,178,57,0.17)">
          <View style={styles.item_container}>
            <Image style={styles.icon} source={require('../images/setting_icon/ic_logout.png')} />
            <Text style={styles.reguler_green}>Logout</Text>
          </View>
        </TouchableHighlight>
        <AboutDialog 
            isVisible={this.state.settingsDialogShown} 
            onDismiss={()=>{
              this.setState({settingsDialogShown: false});
            }}
          />
      </View>
      </ScrollView>
    );
  }
}