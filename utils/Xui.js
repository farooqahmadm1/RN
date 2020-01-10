import React from 'react';
import { Image, Platform, DatePickerIOS, DatePickerAndroid, View }  from 'react-native';
import { Appbar, Paper, Text, Dialog, Button, TextInput, Paragraph, Portal, IconButton, Colors, Subheading } from 'react-native-paper';

export class Calendar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            shouldUpdate: true,
            date: this.props.date
        }
    }
    componentDidUpdate() {
        if (Platform.OS == 'android' && this.props.isVisible) {
            DatePickerAndroid.open({
                date: this.props.date
            }).then(async (action) => {
                let thisRet = await action;
                if (thisRet.action != DatePickerAndroid.dismissedAction) {
                    this.props.onDateChange(new Date(thisRet.year, thisRet.month, thisRet.day));
                } else {
                    this.props.onDismiss();
                }
            });
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (Platform.OS == "android") {
            if (!this.props.isVisible && nextProps.isVisible) {
                return true;
            }
            return false;
        } else {
            return true;
        }
    }

    render() {
        if (Platform.OS == 'ios') {
            return (
                <Portal>
                    <Dialog
                        visible={this.props.isVisible}
                        onDismiss={this.props.onDismiss}>
                        <Dialog.Title>Select Date</Dialog.Title>
                        <Dialog.Content>
                            <DatePickerIOS
                                date={this.state.date}
                                onDateChange={(newDate) => {
                                    this.setState({
                                        date: newDate
                                    })
                                }}
                                mode="date"
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => { this.props.onDateChange(this.state.date) }}><Text style={{color:"#39B239"}}>Done</Text></Button>
                            <Button onPress={this.props.onDismiss}><Text style={{color:"#000"}}>Cancel</Text></Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            )
        } else {
            return null;
        }
    }
}

export class Avatar extends React.Component {
    /**
     * Renders an avatar (specifically for lists)
     * If an image is provided, any text provided is overrid and the image used instead
     */
    render () {
        let size = 35;
        size = typeof this.props.size !== "undefined" ? this.props.size: 35;
        if (this.props.image == null && this.props.source == null) {
            return (
                <View style={{
                    backgroundColor: this.props.backgroundColor == null ? '#eee': this.props.backgroundColor, 
                    height: size, width: size, 
                    borderRadius: size, 
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{this.props.text}</Text>
                </View>
            );
        } else {
            return (
                typeof this.props.image !== "undefined" ?
                <Image
                    style={{ borderRadius: size / 2, height: size, width: size }}
                    source={{uri: this.props.image}}
                />:
                <Image
                    style={{ borderRadius: size / 2, height: size, width: size, }}
                    source={this.props.source}
                />
            );
        }
    }
}

export class Rating extends React.Component {
    
    render () {
        return ([
            <View key="1" style={{flex: 0, flexDirection: 'row'}}>
                <IconButton
                    icon={this.props.rating > 0 ? "star": "star-border"}
                    size={20}
                    color={"teal"}
                />
                <IconButton
                    icon={this.props.rating > 25 ? "star": "star-border"}
                    size={20}
                    color={"teal"}
                />
                <IconButton
                    icon={this.props.rating > 55 ? "star": "star-border"}
                    size={20}
                    color={"teal"}
                />
                <IconButton
                    icon={this.props.rating > 90 ? "star": "star-border"}
                    size={20}
                    color={"teal"}
                />
            </View>,
        ]);
    }
}

export class InputBox extends React.Component {
    /**
     * Works like the default JS InputBox.
     * Set the title and default text
     * Text entered on the input will be returned 
     */
    constructor (props) {
        super(props);

        this.state = {
            newText: this.props.text,
            isTextChanged: false,
        };
    }//onChangeText={text => this.setState({text: text})}

    render () {
        return (
            <Portal>
                <Dialog
                    visible={this.props.isVisible}
                    onDismiss={this.props.onCancel}
                >
                    <Dialog.Content>
                        <Subheading style={{marginBottom:20,fontSize:18}}>{this.props.title}</Subheading>
                        <TextInput
                            underlineColor="#F9FBFD"
                            underlineColorAndroid="#F9FBFD"
                            placeholder="Enter Question"
                            style={{backgroundColor:"#F9FBFD",fontSize:14}}
                            value={this.state.isTextChanged ? this.state.newText: this.props.text}
                            onChangeText={(text) => {
                                this.setState({newText: text, isTextChanged: true})
                            }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={ () => {this.props.onCancel()} }><Text style={{color:"#000"}}>Cancel</Text></Button>
                        <Button onPress={ () => {
                            this.props.onDone(this.state.newText);
                            this.setState({isTextChanged: false});
                        } }><Text style={{color:"#39B239"}}>Done</Text></Button>
                    </Dialog.Actions>
                </Dialog>
                </Portal>
        );
    }
}
export class Xui {
    static formatCurrency(value) {
        if (typeof value == "undefined") {
            return "NaN";
        } else {
            var numVal = parseInt(value);
            if (numVal >= 1000000) {
                return ( (numVal / 1000000).toFixed(1) + " M" );
            }
            if (numVal >= 1000) {
                return ( (numVal / 1000).toFixed(1) + " K" );
            }
            return numVal;
        }
    }
    static getWeekOfMonth = function (thisDate, exact = false) {
        var month = thisDate.getMonth()
            , year = thisDate.getFullYear()
            , firstWeekday = new Date(year, month, 1).getDay()
            , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
            , offsetDate = thisDate.getDate() + firstWeekday - 1
            , index = 1 // start index at 0 or 1, your choice
            , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
            , week = index + Math.floor(offsetDate / 7)
        ;
        if (exact || week < 2 + index) return week;
        return week === weeksInMonth ? index + 5 : week;
    }
    static getFormattedDate = function (thisDate, format) {
        var theseMonths, today = new Date(), M;
        today = thisDate;
        theseMonths = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
        
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        
        var yyyy = today.getFullYear();
        var yy = today.getYear() - 100;


        M = theseMonths[today.getMonth()];
        
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
        if (typeof (format) === "undefined") {
            format = "mm/dd/yyyy";
        }
        var today = format.replace("dd", dd).replace("mm", mm).replace("yyyy", yyyy).replace("yy", yy).replace("M", M);
        return today;
    }

    static headerRenderer (headerProps, headerButtons) {
        return (
            <Appbar.Header style={{backgroundColor:"white",height:100,display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",borderColor:"#cccccc",borderBottomWidth:1,borderStyle:"solid",elevation:0}}>
                {headerProps.index == 0 ? null: <Appbar.BackAction
                    onPress={ () => {
                            headerProps.navigation.goBack(null);
                        }
                    }
                />}
                <Appbar.Content style={{height:100,display:"flex",paddingTop:10,paddingBottom:8,flexDirection:"column",justifyContent:"space-around",alignContent:"flex-start"}}
                    title={ headerProps.scene.descriptor.options.title }
                    subtitle={ headerProps.scene.descriptor.options.subtitle }
                />
                {
                    (()=> {
                        if (typeof headerProps.scene.descriptor.options.headerRight != "undefined") {
                            return headerProps.scene.descriptor.options.headerRight(headerProps.navigation);
                        }
                    })()
                }
            </Appbar.Header>
        );
    }
}