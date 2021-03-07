import React from 'react';
import ChatListComponent from '../chatlist/chatList';


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

    newChatBtnClicked = () => {
        // console.log('New-Chat-Button-clicked!');
        this.setState({
            newChatFormVisible: true, 
            selectedChat: null,
        });
    };

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
            </div>
            
        )
    }
};

export default DashboardComponent;