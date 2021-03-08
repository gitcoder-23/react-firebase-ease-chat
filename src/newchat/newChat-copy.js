import React from 'react';
import styles from "./styles";
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';

// for v9.0
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { NotListedLocation } from '@material-ui/icons';

class NewChatComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            username: null,
            message: null,
        }
    };

    userTyping = (type, e) => {
        console.log('userTyping->', type, e);
        switch (type) {
            case 'username':
              this.setState({username: e.target.value});
            break;

            case 'message':
                this.setState({message: e.target.value});
            break;

            default:
            break;
        }

    };

    submitNewChat = async (e) => {
        e.preventDefault();
        const userExists = await this.userExists();
        if(userExists) {
            const chatExists = await this.chatExists();
            chatExists ? this.goToChat() : this.createChat();
        }
    };

    createChat = () => {
        this.props.newChatSubmitFn({
            sendTo: this.state.username,
            message: this.state.message,
        });
    };

    goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

    buildDocKey = () => {
        return [firebase.auth().currentUser.email, this.state.username].sort().join(':');
    };
    // for "chats" database
    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await firebase
         .firestore()
         .collection('chats')
         .doc(docKey)
         .get();
         console.log(chat.exists);
         return chat.exists;

    };
// for "user" database
    userExists = async () => {
        const usersSnapshot = await 
        firebase
            .firestore()
            .collection('user')
            .get();
        const exists = usersSnapshot.docs
        .map(_doc => _doc.data().email)
        .includes(this.state.username);
    // this.setState({ serverError: !exists });
    return exists;

    }


    render() {
        const {classes} = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' varient='h5'>Send A Message!</Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>

                    <FormControl fullWidth>
                        <InputLabel htmlFor='new-chat-username'>
                            Enter Your Friend's Email
                        </InputLabel>
                    <Input required className={classes.input} autoFocus onChange={(e) => this.userTyping('username', e)} id='new-chat-username'></Input>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel htmlFor='new-chat-message'>
                            Enter Your Message
                        </InputLabel>
                    <Input required className={classes.input} autoFocus onChange={(e) => this.userTyping('message', e)} id='new-chat-message'></Input>
                    </FormControl>
                    <Button type='submit' fullWidth className={classes.submit} variant='contained' color='primary'> Submit</Button>

                    </form>
                </Paper>
            </main>
        )
    }
};

export default withStyles(styles)(NewChatComponent);