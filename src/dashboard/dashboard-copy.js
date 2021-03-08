import React from 'react';
import ChatListComponent from '../chatlist/chatList';
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import ChatViewComponent from "../chatview/chatView";
import ChatTextBoxComponent from "../chattextbox/chatTextBox";

// for v9.0
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


class DashboardComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: [],
            friends: [],

        }
    };

    selectChat = async  (chatIndex) => {
        console.log('Selected-a-chat!', chatIndex);
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    // this.messageRead();
    };

    //  "filter" for each user access by "[0]"
    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);

        // console.log('submitMessage-docKey', docKey);
        // firebase fun autometic added into firebase after submit
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                message: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
                    message: msg,
                    timestamp: Date.now()

                }),
                // taken from firebase db
                receiverHasRead: false,
            })
    };

    //  for "submitMessage" for "chatTextBox" page
    // user1: user2
    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

    newChatBtnClicked = () => {
        // console.log('New-Chat-Button-clicked!');
        this.setState({
            newChatFormVisible: true, 
            selectedChat: null,
        });
    };

    signOut = () => firebase.auth().signOut();

    // grabbing info from fb
    // "onSnapshot" by db document will update
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr){
                this.props.history.push('/login');
            }else{
                await firebase
                .firestore()
                .collection('chats')
                .where('users', 'array-contains', _usr.email)
                .onSnapshot(async res => {
                    const chats = res.docs.map(_doc => _doc.data());

                    await this.setState({
                        email: _usr.email,
                        chats: chats,
                        friends: [],
                      });
                      console.log('chats->', this.state);
                });
            }
        });
    };

    render() {

        const { classes } = this.props;
        return (
            <div>
                {/* <div>
                Hello World Dashboard
            </div> */}
            {/* <ChatListComponent customProp={2+2}></ChatListComponent> */}
            {/* <ChatListComponent history={this.props.history} newChatBtnFn={this.newChatBtnClicked} selecteChatFn={this.selectChat} chats={this.state.chats} userEmail={this.state.email} selectedChatIndex={this.state.selectedChat}></ChatListComponent> */}

            <ChatListComponent history={this.props.history} 
            userEmail={this.state.email} 
            selectChatFn={this.selectChat} 
            chats={this.state.chats} 
            selectedChatIndex={this.state.selectedChat}
            newChatBtnFn={this.newChatBtnClicked}>
          </ChatListComponent>
            {
            this.state.newChatFormVisible ? null :
             <ChatViewComponent user={this.state.email} chat={this.state.chats[this.state.selectedChat]}></ChatViewComponent>
            }

            {
                // If chat is selected
                this.state.selectedChat !== null && !this.state.newChatFormVisible ? 
                <ChatTextBoxComponent submitMessageFn = {this.submitMessage}></ChatTextBoxComponent> : null
            }
          
          <Button className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
            
        )
    }
};

export default withStyles(styles)(DashboardComponent);