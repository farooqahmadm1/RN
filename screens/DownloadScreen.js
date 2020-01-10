import React from 'react';
import { AppRegistry,Image, Button, StyleSheet, Text, View, RefreshControl, ScrollView, Linking, Animated } from 'react-native';
import { Appbar, Snackbar, List, TouchableRipple, Colors, Searchbar, Caption } from 'react-native-paper';
import Api from '../utils/Api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DropdownModal } from '../utils/Util';
import { Avatar } from '../utils/Xui';
import { SwipeListView } from 'react-native-swipe-list-view';


const swipeStyles = StyleSheet.create({
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#FCFBFB',
    justifyContent: 'center',
    marginStart:10,
    marginEnd:10,
    marginTop:4,
    marginBottom:4,
    borderRadius:5,
    elevation:2
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    backgroundColor:"#fff",
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  }
});
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
      elevation:0,
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
  }
})

export default class DownloadScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Downloads',
    tabBarIcon: ({tintColor, focused}) => (
      <Icon
        name="file-download"
        size={26}
        style={{ color: tintColor }}
      />
    )
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      noConnection: false,
      filterShown: false,
      categoryId: 0,
      searchQuery: "",
      downloadList: [],
      anim_scroll: new Animated.Value(0)
    };
  }
  _refreshFromServer () {
    Api.download.get({
      category: this.state.categoryId,
      search: this.state.searchQuery,
      downloadId: null
    }).then((downloadList)=>{
      this.setState({downloadList: downloadList, isLoading: false});
    }).catch((e) =>{
      this.setState({ noConnection: true, isLoading: false, downloadList: [] });
    });
  }
  componentWillMount() {
  }
  componentDidMount() {
    this._refreshFromServer();
  }
  thumbList = {
    photo: require('../images/thumbs/photo.png'),
    xls: require('../images/thumbs/xls.png'),
    doc: require('../images/thumbs/doc.png'),
    zip: require('../images/thumbs/zip.png'),
    file: require('../images/thumbs/file.png'),
  };
  _getFileType(link) {
    let filegroup = "";
    switch (link.split(".")[link.split(".").length - 1]) {
      case "png":
      case "jpeg":
      case "gif":
      case "jpg": {
          filegroup = "photo";
          break;
      }
      case "xls":
      case "xlsx": {
          filegroup = "xls";
          break;
      }
      case "doc":
      case "docx":
      case "pdf": {
          filegroup = "doc";
          break;
      }
      case "rar":
      case "zip": {
          filegroup = "zip";
          break;
      }
      default: {
          filegroup = "file";
          break;
      }
    }
    return filegroup;
  }

  render () {
    var borderRadius = this.state.anim_scroll.interpolate({
      inputRange: [10, 180],
      outputRange: [0, 1]
    });
    return ([
      (
        <Appbar.Header key="1" style={styles.appbar_header}>
          <Appbar.Content style={styles.appbar_content}
            title={<Text style={styles.header_title}>{Api.downloadList[this.state.categoryId]}</Text>}
            subtitle={<Text style={styles.header_subtitle}>Download</Text>}
          />
          <Appbar.Action icon="filter-list" onPress={() => {
            this.setState({ filterShown: true });
          }}/>
        </Appbar.Header>
      ),
      (
        <View key="2" style={{ flex: 1 }}>
            <Animated.View
              style={{elevation: borderRadius, backgroundColor: "#fff" }}
            >
              <Searchbar
                placeholder="Search"
                onChangeText={(query) => {
                  this.setState({ searchQuery: query, isLoading: true }, ()=>{
                    this._refreshFromServer();
                  }); 
                }}
                value={this.state.searchQuery}
                style={{
                  borderRadius: 5,
                  elevation: 1,
                  borderColor:"#cccccc",
                  borderWidth:1,
                  borderStyle:"solid",
                  marginStart:10,
                  marginEnd:10,
                  marginTop:5,
                  marginBottom:5
                }}
              />
            </Animated.View>
          <Animated.ScrollView 
              style={{ flex: 1, backgroundColor: "#fff" }}
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
              scrollEventThrottle={18}
              onScroll={Animated.event([
                {
                  nativeEvent: {contentOffset: {y: this.state.anim_scroll}}
                }
              ], { useNativeDriver: false })}
          >
          <DropdownModal 
            title="Filter Downloads"
            caption="Category"
            isVisible={this.state.filterShown}
            // itemList={[
            //   {itemLabel: "HR Docs", id: 0},
            //   {itemLabel: "Reports", id: 1},
            //   {itemLabel: "Promotions", id: 2},
            //   {itemLabel: "Schedules", id: 3},
            //   {itemLabel: "Announcements", id: 4},
            // ]}
            itemList={Api.downloadList}
            onDismiss={()=> {
              this.setState({ filterShown: false });
            }}
            onSuccess={(itemId) => {
              this.setState(() => {
                return {
                  categoryId: itemId,
                  filterShown: false,
                  isLoading: true
                }
              }, () => { this._refreshFromServer(); });
            }}
          />
          {this.state.downloadList.length === 0 ? <Caption style={{margin: 10, fontSize: 14, fontStyle: 'italic'}}>No downloads at the moment</Caption>:null}
          <SwipeListView
            useFlatList
            data={this.state.downloadList}
            keyExtractor={(data, index) => index.toString()}
            renderItem={ (data, rowMap) => {
              return <List.Item
                title={data.item.title} 
                description={data.item.description}
                left={()=>{
                  return <Avatar backgroundColor={"#fff"} 
                  // size={50} 
                  source={this.thumbList[this._getFileType(data.item.link)]} />
                }}
                right={()=>{
                  return (
                  <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <Image source={require('../images/thumbs/cloud.png')} />
                  </View>
                  )
                }}
                onPress={()=>{
                  Linking.openURL(Api.serverUrl + "downloads/" + data.item.link);
                }}
                style={swipeStyles.rowFront}
              />
            }}
            renderHiddenItem={ (data, rowMap) => (
                <TouchableRipple
                  style={swipeStyles.rowBack}
                  onPress={()=>{
                    /*const newData = [...this.state.downloadList];
                    const prevIndex = this.state.downloadList.findIndex(item => item.id === data.item.id);
                    newData.splice(prevIndex, 1);
                    this.setState({ downloadList: newData });*/
                    this.setState({isLoading: true});
                    Api.download.remove(data.item.id).then(()=>{
                      /*newData.splice(prevIndex, 1);
                      this.setState({ downloadList: newData });*/
                      this._refreshFromServer();
                    });
                  }}
                >
                  <View>
                      <Text style={{color: '#fff'}}>Delete</Text>
                  </View>
                </TouchableRipple>
            )}
            closeOnScroll={true}
            closeOnRowPress={true}
            closeOnRowOpen={true}
            closeOnRowBeginSwipe={true}
            disableRightSwipe={true}
            rightOpenValue={-75}
          />
          </Animated.ScrollView>
          <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
        </View>
      )
    ]);
  }
}
