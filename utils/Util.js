import React from 'react';
import { Text, View, Picker, ActivityIndicator, Animated, Easing,StyleSheet, Image, Dimensions, Modal, Platform, Alert, Linking } from 'react-native';
import { Button, Dialog, Paragraph, Searchbar, List, TouchableRipple, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from '../utils/Xui';
import Api from '../utils/Api';
import { Permissions, Notifications } from 'expo';

const styles = StyleSheet.create({
    content:{
        marginTop:10,
        borderColor:"#39B239",
        borderRadius:5, 
        borderStyle:"solid",
        borderWidth:1
    },
    action:{
        marginBottom:20,
        display:'flex',
        justifyContent:"center",
        alignItems:"center"
    },
    action_button:{
        backgroundColor:"#39B239",width:100
    },
    action_text:{
        color:"white"
    }
})

export class Utils {
    static rand(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    static searchArray(arr, propName, searchTerm) {
        /**
         * This function can be used to get the element by searching through the element's properties
         * Ex: Assume arr = [{ id: 10, name: "John Doe"}, { id: 11, name: "Mike Deere"}], searchTerm is 10 and propName is id; returns { id: 10, name: "John Doe"}
         */
        return arr.find((elem) => {
            return elem[propName] === searchTerm ? true: false;
        });
    }
    static async registerForPushNotificationsAsync(onNotification) {
        const { status: existingStatus } = await Permissions.getAsync(
          Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
      
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
          // Android remote notification permissions are granted during the app
          // install, so this will only ask on iOS
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
      
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
          return;
        }
      
        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
      
        Api.updateUserProfile(Api.userInfo.uid, {expoId: token});
        let thisNotification = null;
        Notifications.addListener((n)=>{

            if (Platform.OS == "ios") {
                Alert.alert(n.data.title, n.data.body);
            }

            onNotification(n);
            
        });
    }
    
}

export class DropdownModal extends React.Component {
    /*
        A more generalised version of the FilterModal plugin
        Usage:
        listOfItems = [{
            itemLabel: "",
            id: 1
        }]
        <DropdownModal 
            title=<>
            caption=<>
            isVisible=<>
            onDismiss=<>
            onSuccess=<>
            itemList=<listOfItems>
            {optional itemLabel=<name field of the item>}
            {optional itemId=<id field of the item>}
        />
    */
    constructor (props) {
        super(props);

        this.state = {
            selectedId: 1
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }

    render() {
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Title>{this.props.title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{this.props.caption}</Paragraph>
                        <Picker
                            selectedValue={this.state.selectedId}
                            onValueChange={(itemValue, itemIndex) => this.setState({selectedId: itemValue})}
                        >
                            {
                                this.props.itemList.map((type, index)=>{
                                    return <Picker.Item label={type} value={index} key={index} />
                                })
                                // this.props.itemList.map( item => <Picker.Item 
                                //     label={item[typeof this.props.itemLabel === "undefined" ? "itemLabel": this.props.itemLabel]} 
                                //     value={item[typeof this.props.itemId === "undefined" ? "id": this.props.itemId]}
                                //     key={item[typeof this.props.itemId === "undefined" ? "id": this.props.itemId]} />)

                            }
                        </Picker>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={ () => {this.props.onSuccess(this.state.selectedId)} }><Text style={{color:"#39B239"}}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}
export class FilterModal extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            branchId: 1
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }

    render() {
        /*if (typeof this.props.branchList === "undefined") {
            return null;
        }*/
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    {/* <Dialog.Title>{this.props.title}</Dialog.Title> */}
                    <Dialog.Title>Select Branch</Dialog.Title>
                    <Dialog.Content>
                        {/* <Paragraph>Select Branch</Paragraph> */}
                        <View style={styles.content}>
                            <Picker
                                selectedValue={this.state.branchId}
                                onValueChange={(itemValue, itemIndex) => this.setState({branchId: itemValue})}
                            >
                                {
                                    this.props.branchList.map( branch => <Picker.Item label={branch.branchName} value={branch.id} key={branch.id} />)
                                }
                                {
                                    //<Picker.Item label="(All)" value="all" />
                                    /*(() => {
                                        const branchList = this.props.branchList;
                                        const pickerArr = [];
                                            
                                        for (var i = 0;i < branchList.length;i++) {
                                            pickerArr[i] = <Picker.Item label={branchList[i].branchName} value={i} key={i} />
                                        }
                                        return pickerArr;
                                    })()*/
                                }
                            </Picker>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.action}>
                        <Button style={styles.action_button} onPress={ () => {this.props.onSuccess(this.state.branchId)} }><Text style={styles.action_text}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

export class FilterProfile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            branchId: 1
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }

    render() {
        /*if (typeof this.props.branchList === "undefined") {
            return null;
        }*/
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Title>{this.props.subheading}</Dialog.Title>
                    <Dialog.Content>
                        {/* <Paragraph>{this.props.subheading}</Paragraph> */}
                        <View style={styles.content}>
                            <Picker
                                enabled={this.props.active < 1}
                                selectedValue={this.state.branchId}
                                onValueChange={(itemValue, itemIndex) => this.setState({branchId: itemValue})}
                            >
                                {
                                    this.props.userList.map((type, index)=>{
                                        return <Picker.Item label={type} value={index} key={index} />
                                    })
                                }
                            </Picker>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.action}>
                        <Button style={styles.action_button} onPress={ () => {this.props.onSuccess(this.state.branchId)} }><Text style={styles.action_text}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}
export class FilterRegion extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            branchId: null
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }

    render() {
        /*if (typeof this.props.branchList === "undefined") {
            return null;
        }*/
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Title>{this.props.subheading}</Dialog.Title>
                    <Dialog.Content>
                        {/* <Paragraph>{this.props.subheading}</Paragraph> */}
                        <View style={styles.content}>
                            <Picker
                                enabled={this.props.active < 1}
                                selectedValue={this.state.branchId}
                                onValueChange={(itemValue, itemIndex) => this.setState({branchId: itemValue})}
                            >
                            {
                                this.props.userList.map((type)=>{
                                    return <Picker.Item label={type} value={type} key={type} />
                                })
                            }
                            </Picker>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.action}>
                        <Button style={styles.action_button} onPress={ () => {this.props.onSuccess(this.state.branchId)} }><Text style={styles.action_text}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}
export class FilterPosition extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            branchId: null
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }

    render() {
        /*if (typeof this.props.branchList === "undefined") {
            return null;
        }*/
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Title>{this.props.subheading}</Dialog.Title>
                    <Dialog.Content>
                        {/* <Paragraph>{this.props.subheading}</Paragraph> */}
                        <View style={styles.content}>
                            <Picker
                                enabled={this.props.active < 1}
                                selectedValue={this.state.branchId}
                                onValueChange={(itemValue, itemIndex) => this.setState({branchId: itemValue})}
                            >
                            {
                                this.props.userList.map((type)=>{
                                    return <Picker.Item label={type} value={type} key={type} />
                                })
                            }
                            </Picker>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.action}>
                        <Button style={styles.action_button} onPress={ () => {this.props.onSuccess(this.state.branchId)} }><Text style={styles.action_text}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}
export class FilterBranch extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            branchId: 1,
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }

    render() {
        /*if (typeof this.props.branchList === "undefined") {
            return null;
        }*/
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Title>{this.props.subheading}</Dialog.Title>
                    <Dialog.Content>
                        {/* <Paragraph>{this.props.subheading}</Paragraph> */}
                        <View style={styles.content}>
                            <Picker
                                enabled={this.props.active < 1}
                                selectedValue={this.state.branchId}
                                onValueChange={(itemValue, itemIndex) => this.setState({branchId: itemValue})}
                            >
                            {
                                this.props.userList.map((type,index)=>{
                                    return <Picker.Item label={type.branchName} value={type.id} key={type.id} />
                                })
                            }
                            </Picker>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions style={styles.action}>
                        <Button style={styles.action_button} onPress={ () => {this.props.onSuccess(this.state.branchId)} }><Text style={styles.action_text}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

export class ColorPop extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            anim: {
                background: new Animated.ValueXY({x: 0, y:0 }),
                radius: new Animated.Value(50),
                springImage: new Animated.Value(0),
                caption: new Animated.Value(0),
            }
        };
    }

    componentDidMount() {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(this.state.anim.background, {
                    toValue: {x: Dimensions.get("window").width, y: Dimensions.get("window").height},
                    duration: 700,
                    easing: Easing.elastic(1),
                }),
                Animated.timing(this.state.anim.radius, {
                    toValue: 0,
                    delay: 400,
                    duration: 100,
                    easing: Easing.ease,
                }),
                Animated.spring(this.state.anim.springImage, {
                    toValue: 1,
                    friction: 1,
                    delay: 100,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.anim.caption, {
                    toValue: 1,
                    delay: 500,
                    duration: 600,
                    easing: Easing.elastic(1),
                })
            ]),
        ]).start();
    }

    render () {
        return (
            <Modal
                visible={true}
                animationType={"fade"}
                transparent={true}
                onRequestClose={this.props.onDismiss}
            >
                <View 
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }}
                >
                    <Animated.View
                        style={{
                            width: this.state.anim.background.x,
                            height: this.state.anim.background.y,
                            borderRadius: this.state.anim.radius,
                            backgroundColor: this.props.backgroundColor == null ? '#eee': this.props.backgroundColor, 
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        
                    >
                        <Animated.Image
                            style={{ transform: [{ scale: this.state.anim.springImage }] }}
                            source={this.props.image}
                        ></Animated.Image>
                        <Animated.Text
                            style={{ marginTop: 50, fontWeight: "500", color: "#fff", opacity: this.state.anim.caption, fontSize: 30, textAlign: "center", fontStyle: "italic", transform: [{ scaleX: this.state.anim.caption }] }}
                        >{this.props.caption}</Animated.Text>
                        
                        <Image source={require('../images/confetti2.gif')} ></Image>
                        <Button onPress={() => { this.props.onDismiss() }} style={{ width: "100%", paddingTop: 10, paddingBottom: 10}}>Close</Button>
                    </Animated.View>
                </View>
            </Modal>
        )
    }
}
export class SuccessDialog extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            anim: {
                springImage: new Animated.Value(0),
                balloonFloat: new Animated.Value(1),
                caption: new Animated.Value(0)
            }
        };
    }

    componentDidMount () {
        Animated.parallel([
            Animated.spring(this.state.anim.springImage, {
                toValue: 1,
                friction: 1,
                //easing: Easing.spring(),
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.anim.caption, {
                toValue: 1,
                delay: 500
            }),
            Animated.timing(this.state.anim.balloonFloat, {
                toValue: 0,
            })
        ]).start();


        /*Animated.timing(this.state.anim.balloonFloat, {
            toValue: 0,
            duration: 2000,
            delay: 100
        }).start();
        Animated.spring(this.state.anim.springImage, {
            toValue: 1,
            friction: 1,
            //easing: Easing.spring(),
            duration: 1000,
            useNativeDriver: true,
        }).start();

          Animated.timing(this.state.anim.fadeText, {
              toValue: 1
          }).start();*/
    }

    _hideDialog = () => {
        this.props.onDismiss();
    }


    render () {
        console.log(Dimensions.get("screen"));
        return ([
            <Animated.View
                key={1}
                style={{ left: 0, position: "absolute", zIndex: 9000, opacity: (this.state.anim.balloonFloat) }}
            >
                <Image
                    source={this.props.balloonImage}
                />
            </Animated.View>
            ,
            <Dialog
                key={2}
                visible={true}
                onDismiss={() => {this._hideDialog()}}
            >
                <DialogContent>
                    <View style={{alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.Image
                            style={{ transform: [{ scale: this.state.anim.springImage }] }}
                            source={this.props.image}
                        ></Animated.Image>
                        <Animated.Text style={{ opacity: this.state.anim.caption, fontWeight: '500' }}>You have completed this checklist successfully!</Animated.Text>
                    </View>
                </DialogContent>
                <DialogActions>
                    <Button onPress={ () => {this._hideDialog()} }>Yay!</Button>
                </DialogActions>
            </Dialog>
        ]);
    }
}

export class AboutDialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    render () {
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onDismiss}
                >
                    <Dialog.Content>
                        <Text>Version: v2.2.0</Text>
                        <Text>Updated: 11 Sept 19</Text>
                        <Button onPress={()=>{Linking.openURL(Api.defServerUrl + "legal/privacy_policy.html")}}>Privacy Policy</Button>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={ () => {this.props.onDismiss()} }>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

export class FilterEmployee extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            employeeId: 1,
            isLoading: false,
            searchTerm: "",
            employees: []
        };
    }

    _hideDialog = () => {
        this.setState({ isVisible: false });
    }
    _doSearch = (query) => {
        let filterArr = {
            humanName: query
        };

        Api.getUsers(filterArr).then((thisList) => {
            let limitedList = [];

            for (let i = 0; i < (thisList.length > 3 ? 3: thisList.length);i++) { //limit the number of entries to 3
                limitedList[i] = thisList[i];
            }

            this.setState({
                employees: limitedList,
                isLoading: false
            })
        });
    }
    render() {
        return (
            <Portal>
                {this.props.isVisible === true?
                    <View style={{backgroundColor:"white",paddingTop:40,width:"100%",height:"100%"}}>
                        <View style={{display:"flex",flexDirection:"row",paddingLeft:10,marginBottom:20,alignItems:"center"}}>
                            <Searchbar
                                style={{flex:1}}
                                placeholder="Search"
                                onChangeText={ (query) => {
                                    this.setState({ searchTerm: query, isLoading: true });
                                    this._doSearch(query);
                                }}
                                value={this.state.searchTerm}
                            />
                            <Button  onPress={ () => {this.props.onCancel()} }><Text style={{color:"#000"}}>Cancel</Text></Button>
                        </View>
                        {this.state.isLoading ? <ActivityIndicator animating={true} style={{ margin: 10 }}/>: null}
                        {
                            this.state.employees.map( employee => (
                                <List.Item 
                                    key={employee.uid}
                                    title={employee.humanName} 
                                    // description={Api.checklistTypes[checklist.type] + " checklist for " + checklist.humanName}
                                    description={employee.position}
                                    left={()=>{return <Avatar backgroundColor={"#fff"} image={employee.photoId !== "" ? Api.serverUrl + "/dp/"+employee.photoId+".png":Api.serverUrl + "/dp/def.png"} />}}
                                    onPress={() => {
                                        this.props.onSuccess(employee);
                                    }}
                                />
                            ))
                        }
                    </View>: null
                }
                {/* <Dialog style={{padding:0,backgroundColor:"rgba(255,255,255,0)",marginTop:60}}
                    visible={this.props.isVisible}
                    onDismiss={this.props.onCancel}
                >
                    <Dialog.Content>
                        <Searchbar
                            placeholder="Search Employee"
                            onChangeText={ (query) => {
                                this.setState({ searchTerm: query, isLoading: true });
                                this._doSearch(query);
                            }}
                            value={this.state.searchTerm}
                        />
                        {this.state.isLoading ? <ActivityIndicator animating={true} style={{ margin: 10 }}/>: null}
                        {
                            this.state.employees.map( employee => (
                                <List.Item 
                                    key={employee.uid}
                                    title={employee.humanName} 
                                    //description={Api.checklistTypes[checklist.type] + " checklist for " + checklist.humanName}
                                    left={()=>{return <Avatar backgroundColor={"#fff"} image={employee.photoId !== "" ? Api.serverUrl + "/dp/"+employee.photoId+".png":Api.serverUrl + "/dp/def.png"} />}}
                                    onPress={() => {
                                        this.props.onSuccess(employee);
                                    }}
                                />
                            ))
                        }
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={ () => {this.props.onCancel()} }>Cancel</Button>
                    </Dialog.Actions>
                </Dialog> */}
            </Portal>
        );
    }
}