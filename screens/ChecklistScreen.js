import React from 'react';
import { AppRegistry,TouchableHighlight, ScrollView, View, RefreshControl, Text, StyleSheet, Alert, Picker, Animated, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
    Caption, Paragraph, Appbar, Button, FAB, 
    List, Paper, Checkbox, TouchableRipple, Chip, Subheading, TextInput, Snackbar, Card, Modal, Portal, IconButton, Colors, Searchbar
} from 'react-native-paper';
import { createStackNavigator, NavigationEvents } from 'react-navigation';
import { Xui, Avatar, Calendar, InputBox } from '../utils/Xui';
import { FilterModal, Utils, FilterEmployee, SuccessDialog, ColorPop } from '../utils/Util';
import Api from '../utils/Api'
import { userInfo } from '../utils/Api';
import CardStack from 'react-native-card-stack-swiper';
import { green } from 'ansi-colors';
//import CardStack from 'react-native-card-stack-swiper';

const styles=StyleSheet.create({
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
    search_bar:{
        borderRadius: 5,
        borderColor:"#cccccc",
        borderWidth:1,
        borderStyle:"solid",
        marginStart:10,
        marginEnd:10,
        marginTop:10,
        elevation:0,
        marginBottom:10
    }
})

class ChecklistList extends React.Component {
    getDisplayPicture (humanName, colorNum) {
        //TODO: if a DP photo available, show this on the thumb otherwise show the initials i.e John Doe = JD
        let initials = "";
        let colors = ["#FFF176", "#4FC3F7", "#4DB6AC", "#DCE775", "#FFB74D", "#7986CB"];

        if (humanName.indexOf(" ") > -1) {
            initials = humanName.split(" ")[0][0] + (typeof humanName.split(" ")[1][0] == "undefined" ? humanName.split(" ")[0][1]: humanName.split(" ")[1][0]);
        } else {
            initials = humanName[0] + humanName[1];
        }

        return (
            <Avatar style={{alignSelf:"center"}} text={initials} size={50} backgroundColor={colors[colorNum]} /> 
        );
    }

    static branchList = [];

    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            filterShown: false,
            branchId: Api.userInfo.branchId,
            checklists: [],
            noConnection: false,
            searchQuery: "",
            date: new Date(),
            cardStackShown: false,
            calendarShown: false,
            checklist: {
                title: " ",
                questions: []
            },
            completedDialog: false //the dialog that is shown when a checklist is completed
        };
    }

    _refreshFromServer () {
        let filterArr = {};
        if ( parseInt(Api.userInfo.type) === 0 ) {
            //admin account
            filterArr = {
                branchId: this.state.branchId,
                searchTerm: this.state.searchQuery
            }
            Api.checklist.get(filterArr, true).then((theseChecklists) => {
                for (let i = 0;i < theseChecklists.length;i++) {
                    theseChecklists[i].color = Utils.rand(6);
                }
                this.setState({
                    checklists: theseChecklists,
                    isLoading: false
                })
            }).catch(() => {
                this.setState({ noConnection: true, isLoading: false, checklists: [] });
            });
        } else {
            filterArr = {
                userId: Api.userInfo.uid
            }
            Api.checklist.get(filterArr).then((theseChecklists) => {
                for (let i = 0;i < theseChecklists.length;i++) {
                    theseChecklists[i].color = Utils.rand(6);
                }
                this.setState({
                    checklists: theseChecklists,
                    isLoading: false
                })
            }).catch(() => {
                this.setState({ noConnection: true, isLoading: false, checklists: [] });
            });
        }
    }
    componentWillMount() {
        this.branchList = typeof Api.branchList == "undefined" ? []: Api.branchList;
    }
    componentDidMount() {
        this._refreshFromServer();
        //Api.populateLists();
        /*Api.getBranchList().then((theseBranches) => {
            this.branchList = theseBranches;
        });*/
    }
    styles = StyleSheet.create({
        stackModal: {
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            alignContent:"center"
        },
        container: {
            flex: 1,
            backgroundColor: '#f2f2f2',
        },
        content:{
            marginLeft: 0,
            marginBottom: 0,
            height: 400,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            alignContent:"center"
        },
        card:{ 
            /*flex: 1,
            flexDirection: 'column',*/
            height: 300,
            marginHorizontal:30,  
            borderRadius: 10,
            display:"flex",
            width:325,
            justifyContent:"center",
            alignItems:"center",
            alignContent:"center",
            flex:1
        },
        label: {
            fontSize: 26,
            textAlign:"center",
            marginTop:30,
            marginHorizontal:15,
            flex:2
        },      
        
    });
    swiper = {};
    render() {
        const { navigate } = this.props.navigation;
        /**
         * Since state can't be accessed if the navigation is rendered using the navigation itself (the navigation render is infact out of the this class!)
            Draw the state individually here. Since two components can be returned only if it is wrapped around a parent AND wrapping around a <View> component
            causes failed rendering, return an array of components as shown below
         * In this case, it also allows the header subtilte to be part of the default rendering so it can change with this.state too
         */

         //the background color for the avatar circles are #300 colors
        return ([
            (
                <Appbar.Header key="1" style={styles.appbar_header}>
                    <Appbar.Content style={styles.appbar_content}
                        title={<Text style={styles.header_title}>{parseInt(Api.userInfo.type) === 0 && this.branchList.length > 1 ? Utils.searchArray(Api.branchList, "id", this.state.branchId)["branchName"]: Api.userInfo.humanName}</Text>}
                        subtitle={<Text style={styles.header_subtitle}>Checklists</Text>}
                    />
                    {
                        parseInt(Api.userInfo.type) === 0 ?
                            <Appbar.Action icon="event" onPress={() => {
                                this.setState({ calendarShown: true });
                            }}/> 
                        : null
                    }
                    {parseInt(Api.userInfo.type) === 0 && this.branchList.length > 1 && 1 == 2 && <Appbar.Action icon="filter-list" onPress={() => {
                        this.setState({ filterShown: true });
                    }}/>}
                </Appbar.Header>
            ),
            (
                <View key="2" style={{ flex: 1,backgroundColor:"#F9FBFD"}}>
                    <NavigationEvents 
                        onDidFocus={payload => this.componentDidMount()}
                    />
                    <View style={{elevation: 0}}>
                        <Searchbar
                            placeholder="Search by Job..."
                            inputStyle={{fontSize:14}}
                            onChangeText={(query) => {
                                this.setState({ searchQuery: query, isLoading: true }, ()=>{
                                    this._refreshFromServer();
                                }); 
                            }}
                            value={this.state.searchQuery}
                            style={styles.search_bar}
                        />
                    </View>
                    <ScrollView 
                        style={{ flex: 1}}
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
                            this.state.checklists.map(
                                checklist => (
                                    <List.Item 
                                        style={{marginStart:10,marginEnd:10,marginBottom:10,backgroundColor:"#fff",borderColor:"#ccc",borderStyle:"solid",borderWidth:0,borderRadius:5}}
                                        key={checklist.id}
                                        title={checklist.title} 
                                        description={Api.checklistTypes[checklist.type] + " checklist for " + checklist.humanName}
                                        left={()=>{return this.getDisplayPicture(checklist.humanName, checklist.color)}}
                                        right={() =>{
                                            /*console.log(checklist.id, Api.userInfo.notification.filter(ox => {
                                                console.log(ox);
                                                return ox.checklistId == checklist.id
                                            }));*/
                                            if (Api.userInfo.type > 0 && (Api.userInfo.notification.filter(ox => ox.data.checklistId == checklist.id)).length > 0) //admins have employee-level notifications
                                                return <IconButton icon="priority-high" size={20} color={Colors.red500} />;
                                            else 
                                                return null;
                                        }}
                                        onPress={() => {
                                            //navigate('View', { checklistId: checklist.id });
                                            //navigate('CardView', { checklistId: checklist.id });

                                            this.setState({isLoading: true});

                                            Api.checklist.getWithAnswers(
                                                checklist.id, 
                                                Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")
                                            ).then((thisChecklist) => {
                                                //colors[Math.floor(Math.random() * (colors.length - 0))]
                                                //let colors = ["#e35183", "#9c4dcc", "#7953d2", "#5C6BC0"];
                                                let colors = ["#ff84b2", "#d07dff", "#ad81ff", "#76d275"];
                                                
                                                //show only unticked checklists
                                                thisChecklist.questions = thisChecklist.questions.filter(question => !question.isTicked);

                                                for (let i = 0;i < thisChecklist.questions.length;i++) {
                                                    thisChecklist.questions[i]['color'] = colors[Math.floor(Math.random() * (colors.length - 0))];
                                                }
                                                
                                                if (Api.isFirstRun) {
                                                    thisChecklist.questions.unshift({id: -1});
                                                }

                                                this.setState({
                                                    isLoading: false,
                                                    checklist: thisChecklist,
                                                    cardStackShown: true
                                                });
                                            }).catch(() => {
                                                this.setState({ noConnection: true });
                                            });
                                        }}
                                    />
                                )
                            )
                        }
                    </ScrollView>
                    {parseInt(Api.userInfo.type) === 0 && <FAB
                        style={{ 
                            position: 'absolute',
                            bottom: 10,
                            right: 10
                            }}
                        icon='add'
                        onPress = {() => {
                            navigate('Add', { checklistId: null });
                        }}
                    />}
                    <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
                </View>
            ), 
            (
                <View key="3">
                    {
                        this.state.completedDialog ? 
                            <ColorPop 
                                image={require('../images/party-popper.png')} 
                                backgroundColor={"#00695f"} 
                                caption={"You completed this checklist!"}
                                onDismiss={() => { this.setState({completedDialog: false}) }}
                            />
                            :null
                    }
                    <Calendar date={this.state.date} 
                        isVisible={this.state.calendarShown} 
                        onDateChange={(date) => {
                            this.setState({
                                date: date,
                                isLoading: true,
                                calendarShown: false
                            }, () => {
                                this.componentDidMount();
                                for (var i = 0; i < this.state.checklist.questions.length; i++) {
                                    setTimeout(() => {
                                        //this.swiper.goBackFromTop();
                                    }, 100 + i);
                                }
                            });
                        }}
                        onDismiss={() => {
                            this.setState({
                                calendarShown: false
                            });
                        }}
                    />
                
                </View>
            ),
            (
                <Portal key="4" >
                    <Modal
                        animationType="slide"
                        visible={this.state.cardStackShown}
                        onDismiss={() => {
                            navigate('List');
                            this.setState({cardStackShown: false})
                            
                        }}
                        style={this.styles.stackModal}
                    >
                        {/*<Button mode="contained" style={{margin: 10}} loading={this.state.isLoading} icon="autorenew" onPress={() => {
                                for (var i = 0; i < this.state.checklist.questions.length; i++) {
                                    setTimeout(() => {
                                        this.swiper.goBackFromTop();
                                    }, 100 + i);
                                }
                            }}>
                                {this.state.isLoading ? 'Loading...': 'Reset Deck'}
                        </Button>*/}
                        <CardStack 
                            style={this.styles.content} 
                            ref={swiper => { this.swiper = swiper }} 
                            renderNoMoreCards={() => {
                                return null;
                                return (<Button raised primary icon="autorenew" onPress={() => {for (var i = 0; i < this.state.checklist.questions.length; i++) {setTimeout(() => {this.swiper.goBackFromTop();}, 100 + i);}}}>Reset Deck</Button>);}} 
                            verticalSwipe={false} onSwipedLeft={(index)=>{
                                if (index == this.state.checklist.questions.length - 1) {
                                    this.setState({ cardStackShown: false });
                                }
                            }} 
                            onSwipedRight={(index) => {
                                let isAllCompleted = true;

                                if (index == this.state.checklist.questions.length - 1) {
                                    //check if triggering colorPop is ok when the last card is swiped
                                    this.state.checklist.questions.forEach((thisQuestion, index) => {
                                        if (!thisQuestion.isTicked && index != this.state.checklist.questions.length - 1) isAllCompleted = false;
                                    });
                                    if (isAllCompleted) {
                                        //remove this notification from notification user's notification column
                                        Api.userInfo.notification = Api.userInfo.notification.filter(nx => typeof nx.data.checklistId !== "undefined" && nx.data.checklistId != this.state.checklist.id);
                                        Api.updateUserProfile(Api.userInfo.uid, {notification: JSON.stringify(Api.userInfo.notification)});
                                        this.setState({ completedDialog: true, cardStackShown: false });
                                    }
                                    this.setState({ cardStackShown: false });
                                }
                            }}
                        >

                            {
                                //contains code to render the helper info card which is shown the first time the user opens this screen
                                this.state.checklist.questions.map( question => (
                                    question.id == -1 ?
                                    <Card style={[this.styles.card, {backgroundColor: "#ff84b2"}]} key={1} index={1} onSwipedLeft={()=>{}} onSwipedRight={()=>{}}>
                                        <Text style={[this.styles.label, {color: '#ff84b2'}]}>Hello what is the meaning of this</Text>
                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            {/*<Image source={require('../images/tick.png')} style={{width: '50%'}}/>
                                            <Image source={require('../images/tick.png')} style={{width: '50%'}}/>*/}
                                            <Text style={{width: '50%', fontSize: 40, textAlign: 'left', paddingLeft:5}}>Swipe left for no</Text>
                                            <Text style={{width: '50%', fontSize: 40, textAlign: 'right', paddingRight:5}}>Swipe right for yes</Text>
                                        </View>
                                    </Card>
                                    :
                                    <Card 
                                        style={[this.styles.card,{backgroundColor:"#fff"}
                                            // {backgroundColor: question.color}
                                        ]} 
                                        key={question.id} index={1} 
                                        onSwipedRight={(ox)=> {
                                            Api.checklist.modifyTick(
                                                question.id, 
                                                Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"),
                                                true
                                            ).catch(() => {
                                                this.setState({ noConnection: true });
                                                this.swiper.goBackFromTop();
                                            });
                                            question.isTicked = true;
                                            this.setState({
                                                checklist: this.state.checklist
                                            });

                                        }} 
                                        onSwipedLeft={()=> {
                                            Api.checklist.modifyTick(
                                                question.id, 
                                                Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"),
                                                false
                                            ).catch(() => {
                                                this.setState({ noConnection: true });
                                                this.swiper.goBackFromTop();
                                            });
                                            question.isTicked = false
                                            this.setState({
                                                checklist: this.state.checklist
                                            });
                                        }}
                                    >
                                        
                                        <Text style={this.styles.label}>{question.question}</Text>
                                        <Button 
                                            style={{
                                                width:150,
                                                height:40,
                                                borderColor:"#39B239",
                                                borderStyle:"solid",
                                                borderWidth:2,
                                                borderRadius:20,
                                                alignSelf:"center"
                                            }} 
                                            // icon="close" 
                                            onPress={() => {
                                                    this.setState({cardStackShown: false});
                                                    navigate('View', { checklistId: this.state.checklist.id });
                                                }}><Text style={{fontSize:16,color:"#39B239"}}>Edit</Text>
                                            </Button>
                                        {parseInt(Api.userInfo.type) === 0 ? 
                                            <Button  
                                                style={{
                                                    backgroundColor:"rgba(255,255,255,0)",
                                                    marginBottom: 15,
                                                    width:120,
                                                    height:40,
                                                    alignSelf:"center"
                                                }} 
                                                onPress={() => {
                                                this.setState({cardStackShown: false});
                                            }}><Text style={{fontSize:16,color:"#000"}}>Close</Text>
                                            </Button>: null
                                        }
                                        <View style={{alignItems: 'center',justifyContent: 'center'}}>
                                            {question.isTicked ? 
                                                <Image 
                                                    source={require('../images/tick.png')} 
                                                    style={{width: 150, height: 150}}>
                                                </Image>: null}                                        
                                        </View>
                                    </Card>
                                ))
                            }
                        </CardStack>
                    </Modal>
                </Portal>
            )
        ]);
    }
}
class ChecklistEdit extends React.Component {
    styles = StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderStyle:"solid",
          borderColor:"#E8ECEF",
          borderWidth:1,
          borderRadius:5,
          marginHorizontal:5,
          marginVertical:5
        },
        row_item:{
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            paddingVertical:10
        },
        row_label_container:{
            height:35,
            display:"flex",
            flexDirection:"row",
            alignItems:"center",
            paddingVertical:10
        },
        row_label_text:{
            marginLeft:5,
            fontSize:16,
            color:"#9B9B9B"
        }

    });
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            employeeFilterShown: false,
            questionInputShown: false,
            titleInputShown: false,
            employee: {},
            currentQuestion: { //to store the current question being entered atm
                id: -1,
                question: ""
            },
            checklist: {
                id: -1,
                title: " ",
                userId: -1,
                type: 0,
                questions: [
                    //{id: 1, question: "My first question"}
                ]
            }
        };
    }
    componentDidMount() {
        const { getParam } = this.props.navigation;
        if (getParam("checklistId", null) !== null) {
            //checklistId provided
            Api.checklist.getWithAnswers(
                getParam("checklistId", null), 
                Xui.getFormattedDate(new Date(), "yyyy-mm-dd") //the date is just a placeholder, we won't be needing this information
            ).then((thisChecklist) => {
                this.setState({
                    checklist: thisChecklist
                });
                Api.getUsers({userId: thisChecklist.userId}, false).then(ox => {
                    this.setState({
                        isLoading: false,
                        employee: ox[0]
                    });
                });
            });
        } else {
            this.setState({
                isLoading: false
            });
        }
    }
    render() {
        const { navigate, getParam } = this.props.navigation;
        const typeResolver = ["Daily", "Weekly", "Monthly"]
        return ([
            (
                <Appbar.Header key="1">
                    <Appbar.BackAction
                        onPress={() => {
                            this.props.navigation.goBack(null);
                        }}
                    />
                    <Appbar.Content
                        title="Edit Checklist"
                    />
                    <Appbar.Action icon="delete" onPress={() => {
                        Api.checklist.delete(this.state.checklist.id).then(() => {
                            navigate('List');
                        });
                    }}/>
                </Appbar.Header>
            ),
            (
                <View key="2" style={{ flex: 1 }}>
                    <NavigationEvents 
                        onDidFocus={payload => this.componentDidMount()}
                    />
                    <ScrollView 
                        style={{ flex: 1, backgroundColor: '#fff' }}
                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.isLoading}
                              onRefresh={() => {
                                this.componentDidMount();
                              }}
                              colors={['teal']}
                            />
                        }
                    >
                    <View style={{ flex: 1, marginRight: 10, marginLeft: 10, marginTop: 0 }}>
                        <Text style={{color:"#000",fontSize:24,marginVertical:15}}>{this.state.checklist.title}</Text>
                        <TouchableHighlight onPress={ () => { this.setState({ titleInputShown: true }) } }>
                            <View style={this.styles.row_item}>
                                <View style={this.styles.row_label_container}>
                                    <Image source={require('../images/checklist_icon/light_bolt.png')}/>
                                    <Text style={this.styles.row_label_text}>Project</Text>
                                </View>
                                <View><Text>{this.state.checklist.title}</Text></View>
                            </View>
                        </TouchableHighlight>
                        <View style={this.styles.row_item}>
                            <View style={this.styles.row_label_container}>
                                <Image source={require('../images/checklist_icon/light_bolt.png')}/>
                                <Text style={this.styles.row_label_text}>Type</Text>
                            </View>
                            <View><Text>{typeResolver[this.state.checklist.type]}</Text></View>
                        </View>
                        <View style={this.styles.row_item}>
                            <View style={this.styles.row_label_container}>
                                <Image source={require('../images/checklist_icon/light_bolt.png')}/>
                                <Text style={this.styles.row_label_text}>Status</Text>
                            </View>
                            <View>
                                <Button 
                                style={{
                                    height:33,
                                    backgroundColor:"#39B239",
                                    paddingHorizontal:20,
                                    borderRadius:5}}
                                    ><Text style={{color:"#fff",
                                    fontSize:12,textAlign:"center",}}>IN PROGRESS</Text>
                                </Button></View>
                        </View>
                        <TouchableHighlight onPress={ () => { this.setState({ employeeFilterShown: true }) } }>
                            <View style={this.styles.row_item}>
                                <View style={this.styles.row_label_container}>
                                    <Image source={require('../images/checklist_icon/user.png')}/>
                                    <Text style={this.styles.row_label_text}>Assigned Manager</Text>
                                </View>
                                <View><Text>{this.state.employee.humanName}</Text></View>
                            </View>
                        </TouchableHighlight>
                        <FilterEmployee
                            isVisible={this.state.employeeFilterShown}
                            onSuccess={ (thisEmployee) => {
                                let thisChecklistInfo = {};

                                this.setState({ employeeFilterShown: false, isLoading: true });
                                thisChecklistInfo = {
                                    title: this.state.checklist.title,
                                    userId: thisEmployee.uid
                                }
                                if (this.state.checklist.id === -1) {
                                    //new checklist therefore do not do server updates, only edit local entity
                                    this.setState({ employee: thisEmployee, isLoading: false });
                                } else {
                                    Api.checklist.modify(this.state.checklist.id, thisChecklistInfo).then(async () => {
                                        this.setState({ employee: thisEmployee, isLoading: false });
                                    });
                                }
                            }}
                            onCancel={ (thisEmployee) => {
                                this.setState({ employeeFilterShown: false });
                            }}
                        />
                        <View style={{display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",marginVertical:10}}>
                            <Image style={{height:20,width:20}} source={require('../images/checklist_icon/Icon.png')}/>
                            <Text style={{marginLeft:5,fontSize:16,color:"#9B9B9B"}}>Tasks</Text>
                        </View>
                        {
                            this.state.checklist.questions.length === 0 ? //no questions found
                            <Caption>Press the '+' FAB to add tasks!</Caption>
                            : null
                        }
                        {
                            this.state.checklist.questions.map( thisQuestion => (
                                <TouchableRipple key={thisQuestion.id} onPress={() => {
                                    this.setState({
                                        currentQuestion: {id: thisQuestion.id, question: thisQuestion.question},
                                        questionInputShown: true
                                    });
                                }}>
                                    <View style={this.styles.row}>
                                        <Paragraph style={{ flex: 1 }}>{thisQuestion.question}</Paragraph>
                                    </View>
                                </TouchableRipple>
                            ))
                        }
                        <InputBox
                            title={"Enter Title"}
                            text={this.state.checklist.title}
                            isVisible={this.state.titleInputShown}
                            onCancel={()=>{ this.setState({titleInputShown: false}) }}
                            onDone={(text) => {
                                this.setState({isLoading: true, titleInputShown: false});
                                    
                                thisChecklistInfo = {
                                    title: text,
                                    userId: this.state.checklist.userId
                                }
                                if (this.state.checklist.id === -1) {
                                    //new checklist therefore do not do server updates, only edit local entity
                                    let tempChecklist = this.state.checklist;
                                    tempChecklist.title = text;
                                    this.setState({ checklist: tempChecklist, isLoading: false });
                                } else {
                                    //modify existing checklist
                                    Api.checklist.modify(this.state.checklist.id, thisChecklistInfo).then(async () => {
                                        let tempChecklist = this.state.checklist;
                                        tempChecklist.title = text;
                                        this.setState({ checklist: tempChecklist, isLoading: false });
                                    });
                                }
                            }}
                        />
                        <InputBox
                            title={"Enter Question"}
                            text={this.state.currentQuestion.question}
                            isVisible={this.state.questionInputShown}
                            onCancel={()=>{ this.setState({questionInputShown: false}) }}
                            onDone={(text) => {
                                this.setState({isLoading: true, questionInputShown: false});

                                if (this.state.checklist.id === -1) {
                                    //new checklist therefore do not do server updates, only edit local entity
                                    if (this.state.currentQuestion.id === -1) {
                                        //insert new question
                                        tempChecklist = this.state.checklist;
                                        tempChecklist.questions.push({id: tempChecklist.questions.length, question: text});
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    } else {
                                        //modify existing question
                                        tempChecklist = this.state.checklist;
                                        for (i = 0;i < tempChecklist.questions.length;i++) {
                                            if (tempChecklist.questions[i].id === this.state.currentQuestion.id) {
                                                tempChecklist.questions[i].question = text;
                                            }
                                        }
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    }
                                    return;
                                }

                                if (this.state.currentQuestion.id === -1) {
                                    //add new question
                                    Api.checklist.insertQuestion(this.state.checklist.id, text).then(async thisQuestion => {
                                        tempChecklist = this.state.checklist;
                                        tempChecklist.questions.push({id: thisQuestion.id, question: text});
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    });
                                } else {
                                    //editing an existing question
                                    Api.checklist.modifyQuestion(this.state.currentQuestion.id, text).then(async () => {
                                        tempChecklist = this.state.checklist;
                                        for (i = 0;i < tempChecklist.questions.length;i++) {
                                            if (tempChecklist.questions[i].id === this.state.currentQuestion.id) {
                                                tempChecklist.questions[i].question = text;
                                            }
                                        }
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    });
                                }

                                //this.setState({isLoading: true, questionInputShown: false, currentQuestion: {id: -1, question: ""}});
                            }}
                        />
                    </View>
                    </ScrollView>
                    <FAB
                        style={{ 
                            position: 'absolute',
                            bottom: 10,
                            right: 10
                            }}
                        icon='add'
                        onPress = {() => {
                            this.setState({currentQuestion: {id: -1, question: ""}, questionInputShown: true})
                        }}
                    />
                </View>
            )
        ]);
    }
}
class AddCheckListView extends React.Component{
        styles = StyleSheet.create({
        row: {
            backgroundColor:"#fff",
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderStyle:"solid",
          borderColor:"#E8ECEF",
          borderWidth:1,
          borderRadius:5,
          marginHorizontal:5,
          marginVertical:5
        },
        text_head:{
            color:"#7D91A6",
            fontSize:15,
            marginVertical:10
        }
    });
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            employeeFilterShown: false,
            questionInputShown: false,
            titleInputShown: false,
            employee: {},
            currentQuestion: { //to store the current question being entered atm
                id: -1,
                question: ""
            },
            title:"",
            checklist: {
                id: -1,
                title: "",
                userId: -1,
                type: 0,
                questions: [
                    //{id: 1, question: "My first question"}
                ]
            }
        };
    }
    componentDidMount() {
        const { getParam } = this.props.navigation;
        if (getParam("checklistId", null) !== null) {
            //checklistId provided
            Api.checklist.getWithAnswers(
                getParam("checklistId", null), 
                Xui.getFormattedDate(new Date(), "yyyy-mm-dd") //the date is just a placeholder, we won't be needing this information
            ).then((thisChecklist) => {
                this.setState({
                    checklist: thisChecklist
                });
                Api.getUsers({userId: thisChecklist.userId}, false).then(ox => {
                    this.setState({
                        isLoading: false,
                        employee: ox[0]
                    });
                });
            });
        } else {
            this.setState({
                isLoading: false
            });
        }
    }
    render() {
        const { navigate, getParam } = this.props.navigation;
        const typeResolver = ["Daily", "Weekly", "Monthly"]
        return ([
            (
                <Appbar.Header key="1">
                    <Appbar.BackAction
                        onPress={() => {
                            this.props.navigation.goBack(null);
                        }}
                    />
                        <Appbar.Content
                            title="Add Checklist"
                        />
                        <Appbar.Action icon="done" onPress={() => {
                            this.state.checklist.title = this.state.title
                            let thisChecklistInfo = {
                                title: this.state.checklist.title,
                                userId: this.state.employee.uid,
                                type: this.state.checklist.type
                            }
                            let thisQuestionList = [];
                            //validation START
                            if (typeof this.state.employee.uid === "undefined" || this.state.employee.uid === -1) {
                                Alert.alert("Please select an employee");
                                return;                                
                            }
                            if (this.state.checklist.title === " ") {
                                Alert.alert("Please enter a title");
                                return
                            }
                            //validation END
                            for (i = 0; i< this.state.checklist.questions.length;i++) {
                                thisQuestionList[i] = {question: ""};
                                thisQuestionList[i].question = this.state.checklist.questions[i].question;
                            }
                            Api.checklist.insert(thisChecklistInfo, thisQuestionList).then(
                                checklistId => { 
                                    navigate('View', { checklistId: checklistId });
                                })
                        }}/>
                </Appbar.Header>
            ),
            (
                <View key="2" style={{ flex: 1,backgroundColor:"#F9FBFD" }}>
                    <NavigationEvents 
                        onDidFocus={payload => this.componentDidMount()}
                    />
                    <ScrollView 
                        style={{flex:1,backgroundColor:"#F9FBFD"}}
                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.isLoading}
                              onRefresh={() => {
                                this.componentDidMount();
                              }}
                              colors={['teal']}
                            />
                        }
                    >
                    <View style={{ flex: 1, marginRight: 10, marginLeft: 10, marginTop: 0 ,backgroundColor:"#F9FBFD"}}>
                        <View>
                            <Text style={this.styles.text_head}>Title</Text>
                            <TextInput
                                placeholder="Enter Title"
                                style={{backgroundColor:"#fff"}}
                                underlineColor="#fff"
                                underlineColorAndroid="#fff"
                                value={this.state.title} 
                                onChangeText={(text) => {
                                    this.setState({title : text});
                                }}
                            />
                        </View>
                        <View style={{flex:2,display:"flex",flexDirection:"row"}}>
                            <View style={{flex:1,marginRight:5}}>
                                <Text style={this.styles.text_head}>Assigned Manager</Text>
                                <Chip style={{borderRadius:0,backgroundColor:"#fff",height:50,justifyContent:"center",display:"flex"}} onPress={ () => { this.setState({ employeeFilterShown: true }) } }>
                                    {(typeof this.state.employee.humanName === "undefined" ? <Text style={{}}>Select User</Text>: this.state.employee.humanName)}
                                </Chip>
                            </View>
                            <View style={{flex:1,marginLeft:5}}>
                                <Text style={this.styles.text_head}>Type</Text>
                                <Picker
                                    style={{height:50,backgroundColor:"#fff"}}
                                    selectedValue={this.state.checklist.type}
                                    onValueChange={(itemValue, itemIndex) => {
                                        let tempChecklist = this.state.checklist;
                                        tempChecklist.type = itemValue;
                                        this.setState({checklist: tempChecklist})
                                    }}
                                >
                                    <Picker.Item label={"Daily"} value={0} key={0} />
                                    <Picker.Item label={"Weekly"} value={1} key={1} />
                                    <Picker.Item label={"Monthly"} value={2} key={2} />
                                </Picker>
                            </View>
                        </View>
                        <FilterEmployee
                            isVisible={this.state.employeeFilterShown}
                            onSuccess={ (thisEmployee) => {
                                let thisChecklistInfo = {};

                                this.setState({ employeeFilterShown: false, isLoading: true });
                                thisChecklistInfo = {
                                    title: this.state.checklist.title,
                                    userId: thisEmployee.uid
                                }
                                if (this.state.checklist.id === -1) {
                                    //new checklist therefore do not do server updates, only edit local entity
                                    this.setState({ employee: thisEmployee, isLoading: false });
                                } else {
                                    Api.checklist.modify(this.state.checklist.id, thisChecklistInfo).then(async () => {
                                        this.setState({ employee: thisEmployee, isLoading: false });
                                    });
                                }
                            }}
                            onCancel={ (thisEmployee) => {
                                this.setState({ employeeFilterShown: false });
                            }}
                        />
                        <Text style={this.styles.text_head}>Task</Text>
                        {

                            this.state.checklist.questions.length === 0 ? //no questions found
                            <Chip style={{borderRadius:0,backgroundColor:"#fff",height:50,justifyContent:"center",display:"flex"}}>
                                <Caption>Press the '+' FAB to add tasks!</Caption>
                            </Chip>
                            : null
                        }
                        {
                            this.state.checklist.questions.map( thisQuestion => (
                                <TouchableRipple key={thisQuestion.id} onPress={() => {
                                    this.setState({
                                        currentQuestion: {id: thisQuestion.id, question: thisQuestion.question},
                                        questionInputShown: true
                                    });
                                }}>
                                    <View style={this.styles.row}>
                                        <Paragraph style={{ flex: 1 }}>{thisQuestion.question}</Paragraph>
                                    </View>
                                </TouchableRipple>
                            ))
                        }
                        <InputBox
                            title={"Enter Title"}
                            text={this.state.checklist.title}
                            isVisible={this.state.titleInputShown}
                            onCancel={()=>{ this.setState({titleInputShown: false}) }}
                            onDone={(text) => {
                                this.setState({isLoading: true, titleInputShown: false});
                                    
                                thisChecklistInfo = {
                                    title: text,
                                    userId: this.state.checklist.userId
                                }
                                if (this.state.checklist.id === -1) {
                                    //new checklist therefore do not do server updates, only edit local entity
                                    let tempChecklist = this.state.checklist;
                                    tempChecklist.title = text;
                                    this.setState({ checklist: tempChecklist, isLoading: false });
                                } else {
                                    //modify existing checklist
                                    Api.checklist.modify(this.state.checklist.id, thisChecklistInfo).then(async () => {
                                        let tempChecklist = this.state.checklist;
                                        tempChecklist.title = text;
                                        this.setState({ checklist: tempChecklist, isLoading: false });
                                    });
                                }
                            }}
                        />
                        <InputBox
                            title={"Task"}
                            text={this.state.currentQuestion.question}
                            isVisible={this.state.questionInputShown}
                            onCancel={()=>{ this.setState({questionInputShown: false}) }}
                            onDone={(text) => {
                                this.setState({isLoading: true, questionInputShown: false});

                                if (this.state.checklist.id === -1) {
                                    //new checklist therefore do not do server updates, only edit local entity
                                    if (this.state.currentQuestion.id === -1) {
                                        //insert new question
                                        tempChecklist = this.state.checklist;
                                        tempChecklist.questions.push({id: tempChecklist.questions.length, question: text});
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    } else {
                                        //modify existing question
                                        tempChecklist = this.state.checklist;
                                        for (i = 0;i < tempChecklist.questions.length;i++) {
                                            if (tempChecklist.questions[i].id === this.state.currentQuestion.id) {
                                                tempChecklist.questions[i].question = text;
                                            }
                                        }
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    }
                                    return;
                                }

                                if (this.state.currentQuestion.id === -1) {
                                    //add new question
                                    Api.checklist.insertQuestion(this.state.checklist.id, text).then(async thisQuestion => {
                                        tempChecklist = this.state.checklist;
                                        tempChecklist.questions.push({id: thisQuestion.id, question: text});
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    });
                                } else {
                                    //editing an existing question
                                    Api.checklist.modifyQuestion(this.state.currentQuestion.id, text).then(async () => {
                                        tempChecklist = this.state.checklist;
                                        for (i = 0;i < tempChecklist.questions.length;i++) {
                                            if (tempChecklist.questions[i].id === this.state.currentQuestion.id) {
                                                tempChecklist.questions[i].question = text;
                                            }
                                        }
                                        this.setState({
                                            checklist: tempChecklist, 
                                            isLoading: false,
                                            currentQuestion: {id: -1, question: ""}
                                        });
                                    });
                                }

                                //this.setState({isLoading: true, questionInputShown: false, currentQuestion: {id: -1, question: ""}});
                            }}
                        />
                    </View>
                    </ScrollView>
                    <FAB
                        style={{ 
                            position: 'absolute',
                            bottom: 10,
                            right: 10
                            }}
                        icon='add'
                        onPress = {() => {
                            this.setState({currentQuestion: {id: -1, question: ""}, questionInputShown: true})
                        }}
                    />
                </View>
            )
        ]);
    }
}
class ChecklistView extends React.Component {
    styles = StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderStyle:"solid",
          borderColor:"#E8ECEF",
          borderWidth:1,
          borderRadius:5,
          marginHorizontal:10,
          marginVertical:5
        },
    });
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            date: new Date(),
            calendarShown: false,
            checklist: {
                title: " ",
                questions: []
            },
            completedDialog: false //the dialog that is shown when a checklist is completed
        };
    }
    componentDidMount() {
        const { getParam } = this.props.navigation;
        Api.checklist.getWithAnswers(
            getParam("checklistId", null), 
            Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")
        ).then((thisChecklist) => {
            this.setState({
                isLoading: false,
                checklist: thisChecklist
            }, () => {
                console.log(this.state.checklist);
            });
        });
    }
    
    getDateString(thisDate, checklistType) {
        switch (checklistType) {
            case 0: {
                //daily
                return Xui.getFormattedDate(thisDate, "dd M yy");
            }
            case 1: {
                //TODO: Get the week and return it instead!
                return "Week " + Xui.getWeekOfMonth(thisDate) + " of " + Xui.getFormattedDate(thisDate, "M");
            }
            case 2: {
                return Xui.getFormattedDate(thisDate, "M");
            }
        }
    }
    render() {
        const { navigate, getParam } = this.props.navigation;
        return ([
            (
                <Appbar.Header key="1">
                    <Appbar.BackAction
                        onPress={() => {
                            this.props.navigation.goBack(null);
                        }}
                    />
                    <Appbar.Content
                        title="View Checklist"
                        subtitle={this.state.checklist.title /*== "" ? null: this.state.checklist.title*/}
                    />
                    {
                        parseInt(Api.userInfo.type) === 0 ?
                            <Appbar.Action icon="event" onPress={() => {
                                this.setState({ calendarShown: true });
                            }}/> 
                        : null
                    }
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
                                Api.checklist.getWithAnswers(
                                    this.state.checklist.id, 
                                    Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")
                                ).then((thisChecklist) => {
                                    this.setState({
                                        isLoading: false,
                                        checklist: thisChecklist
                                    });
                                });
                              }}
                              colors={['teal']}
                            />
                        }
                    >
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
                        <Caption style={{ paddingLeft: 10 }}>{this.getDateString(this.state.date, this.state.checklist.type)}</Caption>
                        {/*<Button onPress={() => {
                            this.setState({completedDialog: true});
                        }}>Hello</Button>*/}
                        {
                            /*this.state.completedDialog ? 
                                <ColorPop 
                                    image={require('../images/party-popper.png')} 
                                    backgroundColor={"#00695f"} 
                                    caption={"You completed this checklist!"}
                                    onDismiss={() => { this.setState({completedDialog: false}) }}
                                />
                                :null*/
                        }
                        {
                            this.state.checklist.questions.map( question => (
                                <TouchableRipple onPress={() => {
                                    Api.checklist.modifyTick(
                                        question.id, 
                                        Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"),
                                        !question.isTicked
                                    );
                                    question.isTicked = !question.isTicked;
                                    this.setState({
                                        checklist: this.state.checklist
                                    });

                                    //check if triggering colorPop is ok
                                    let isAllCompleted = true;
                                    this.state.checklist.questions.forEach(thisQuestion => {
                                        if (!thisQuestion.isTicked) isAllCompleted = false;
                                    });
                                    if (isAllCompleted) {
                                        this.setState({ completedDialog: true });
                                    }
                                }} key={question.id}>
                                    <View style={this.styles.row}>
                                        <Paragraph style={{ flex: 1 }}>{question.question}</Paragraph>
                                        <View pointerEvents="none">
                                            <Checkbox status={question.isTicked ? "checked": "unchecked"} />
                                        </View>
                                    </View>
                                </TouchableRipple>
                            ))
                        }
                        <View style={{height: 60}}></View>
                    </ScrollView>
                    {parseInt(Api.userInfo.type) === 0 && <FAB
                        style={{ 
                            position: 'absolute',
                            bottom: 10,
                            right: 10
                            }}
                        icon='edit'
                        onPress = {() => {
                            navigate('Edit', { checklistId: this.state.checklist.id });
                        }}
                    />}
                </View>
            )
        ]);
    }
    
}


class ChecklistCardView extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            noConnection: false,
            isLoading: true,
            date: new Date(),
            calendarShown: false,
            cardStackShown: true,
            checklist: {
                title: " ",
                questions: []
            },
            completedDialog: false //the dialog that is shown when a checklist is completed
        };
    }
    componentDidMount() {
        const { getParam } = this.props.navigation;
        this.setState({isLoading: true});
        Api.checklist.getWithAnswers(
            getParam("checklistId", null), 
            Xui.getFormattedDate(this.state.date, "yyyy-mm-dd")
        ).then((thisChecklist) => {
            //colors[Math.floor(Math.random() * (colors.length - 0))]
            let colors = ["#e35183", "#9c4dcc", "#7953d2", "#5C6BC0"];
            for (let i = 0;i < thisChecklist.questions.length;i++) {
                thisChecklist.questions[i]['color'] = colors[Math.floor(Math.random() * (colors.length - 0))];
            }
            this.setState({
                isLoading: false,
                checklist: thisChecklist
            });
        }).catch(() => {
            this.setState({ noConnection: true });
        });
    }
    
    getDateString(thisDate, checklistType) {
        switch (checklistType) {
            case 0: {
                //daily
                return Xui.getFormattedDate(thisDate, "dd M yy");
            }
            case 1: {
                //TODO: Get the week and return it instead!
                return "Week " + Xui.getWeekOfMonth(thisDate) + " of " + Xui.getFormattedDate(thisDate, "M");
            }
            case 2: {
                return Xui.getFormattedDate(thisDate, "M");
            }
        }
    }

    render() {
        const { navigate, getParam } = this.props.navigation;
        return ([
            (
                <Toolbar key="1">
                    <ToolbarBackAction
                        onPress={() => {
                            this.props.navigation.goBack(null);
                        }}
                    />
                    <ToolbarContent
                        title="View Checklist"
                        subtitle={this.state.checklist.title /*== "" ? null: this.state.checklist.title*/}
                    />
                    {
                        parseInt(Api.userInfo.type) === 0 ?
                            <ToolbarAction icon="event" onPress={() => {
                                this.setState({ calendarShown: true });
                            }}/> 
                        : null
                    }
                </Toolbar>
            ),
            (
                <View key="2" style={{ flex: 1 }}>
                    {
                        this.state.completedDialog ? 
                            <ColorPop 
                                image={require('../images/party-popper.png')} 
                                backgroundColor={"#00695f"} 
                                caption={"You completed this checklist!"}
                                onDismiss={() => { this.setState({completedDialog: false}) }}
                            />
                            :null
                    }
                    <Calendar date={this.state.date} 
                        isVisible={this.state.calendarShown} 
                        onDateChange={(date) => {
                            this.setState({
                                date: date,
                                isLoading: true,
                                calendarShown: false
                            }, () => {
                                this.componentDidMount();
                                for (var i = 0; i < this.state.checklist.questions.length; i++) {
                                    setTimeout(() => {
                                        this.swiper.goBackFromTop();
                                    }, 100 + i);
                                }
                            });
                        }}
                        onDismiss={() => {
                            this.setState({
                                calendarShown: false
                            });
                        }}
                    />
                    <Modal
                        animationType="slide"
                        visible={this.state.cardStackShown}
                        onDismiss={() => {
                            navigate('List');
                            this.setState({cardStackShown: false})
                            
                        }}
                    >
                    
                    <CardStack style={this.styles.content} ref={swiper => { this.swiper = swiper }} renderNoMoreCards={() => {
                        return null;
                        return (
                        <Button raised primary icon="autorenew" onPress={() => {
                            for (var i = 0; i < this.state.checklist.questions.length; i++) {
                                setTimeout(() => {
                                    this.swiper.goBackFromTop();
                                }, 100 + i);
                            }
                        }}>
                            Reset Deck
                        </Button>
                        );
                    }} verticalSwipe={false} onSwipedRight={(index) => {
                        let isAllCompleted = true;

                        if (index == this.state.checklist.questions.length - 1) {
                            //check if triggering colorPop is ok when the last card is swiped
                            this.state.checklist.questions.forEach(thisQuestion => {
                                if (!thisQuestion.isTicked) isAllCompleted = false;
                            });
                            if (isAllCompleted) {
                                this.setState({ completedDialog: true });
                            }
                        }
                    }}>
                        {
                            this.state.checklist.questions.map( question => (
                                <Card style={{width: 400, height: 550, backgroundColor: question.color, borderRadius: 10}} key={question.id} index={1} onSwipedRight={(ox)=> {
                                    Api.checklist.modifyTick(
                                        question.id, 
                                        Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"),
                                        true
                                    ).catch(() => {
                                        this.setState({ noConnection: true });
                                        this.swiper.goBackFromTop();
                                    });
                                    question.isTicked = true;
                                    this.setState({
                                        checklist: this.state.checklist
                                    });

                                }} onSwipedLeft={()=> {
                                    Api.checklist.modifyTick(
                                        question.id, 
                                        Xui.getFormattedDate(this.state.date, "yyyy-mm-dd"),
                                        false
                                    ).catch(() => {
                                        this.setState({ noConnection: true });
                                        this.swiper.goBackFromTop();
                                    });
                                    question.isTicked = false
                                    this.setState({
                                        checklist: this.state.checklist
                                    });
                                }}>
                                    <Text style={this.styles.label}>{question.question}</Text>
                                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                                    {question.isTicked ? <Image source={require('../images/tick.png')} style={{width: 150, height: 150}}></Image>: null}
                                    </View>
                                </Card>
                            ))
                        }
                    </CardStack>
                    <Button raised primary loading={this.state.isLoading} icon="autorenew" onPress={() => {
                            for (var i = 0; i < this.state.checklist.questions.length; i++) {
                                setTimeout(() => {
                                    this.swiper.goBackFromTop();
                                }, 100 + i);
                            }
                        }}>
                            {this.state.isLoading ? 'Loading...': 'Reset Deck'}
                    </Button>
                    <Snackbar visible={this.state.noConnection} duration={3000} onDismiss={() => { this.setState({noConnection: false}) }}>Connection to server failed</Snackbar>
                    </Modal>
                    
                </View>
            )
        ]);
    }
    styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#f2f2f2',
        },
        content:{
            marginLeft: 10,
            width: 500,
            height: 600,
        },
        card:{
            width: 400,
            height: 400,
            backgroundColor: '#fff',
          },
        label: {
              fontSize: 40,
              margin: 10,
          }
    });
}


const ChecklistScreen = createStackNavigator(
    {
      List: ChecklistList,
      View: ChecklistView,
      CardView: ChecklistCardView,
      Edit: ChecklistEdit,
      Add:AddCheckListView
    },
    {
      intialRouteName: 'List',
      navigationOptions: {
        header: (headerProps) => {
            // return Xui.headerRenderer(headerProps);
            return null;
        },
      }
    }
);

ChecklistScreen.navigationOptions = {
    tabBarLabel: 'Checklist',
    tabBarIcon: ({tintColor, focused}) => (
      <Icon
        name="assignment-turned-in"
        size={26}
        style={{ color: tintColor }}
      />
    )
};
export default ChecklistScreen;