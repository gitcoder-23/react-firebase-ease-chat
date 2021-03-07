import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';

class ChatListComponent extends React.Component {

    newChat = () => {
        this.props.newChatBtnFn();
    };

    selectChat = (index) => {
        console.log('Select-chat', index);
        this.props.selectChatFn(index);
    };

    // userIsSender = (chat) => {
    //     chat.messages[chat.messages.length - 1].sender === this.props.userEmail;
    // };

    render() {
  
      const { classes } = this.props;

      return(
        // "customProp" coming from dashboard
        // <>Chat Board props: {this.props.customProp}</>

        <main className={classes.main}>
            <Button varient='contained' fullWidth color='primary' className={classes.newChatBtn} onClick={this.newChat}></Button>
            <List>
            {
                this.props.chats.map((_chat, _index) => {
                  return (
                    // "selectedChatIndex", "userEmail" coming from dashboard, "filter" check array of user
                    <div key={_index}>
                      <ListItem onClick={() => this.selectChat(_index)} 
                        className={classes.listItem} 
                        selected={this.props.selectedChatIndex === _index} 
                        alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp">{_chat.users.filter(_user => _user !== this.props.userEmail)[0].split('')[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={_chat.users.filter(_user => _user !== this.props.userEmail)[0]}
                          secondary={
                            <React.Fragment>
                                {/* atleast "30" char msg */}
                              <Typography component='span'
                                color='textPrimary'>
                                  {_chat.messages[_chat.messages.length - 1].message.substring(0, 30) + ' ...'}
                              </Typography>
                            </React.Fragment>
                          }/>
                          {
                            _chat.receiverHasRead === false && !this.userIsSender(_chat) ? 
                            <ListItemIcon><NotificationImportant className={classes.unreadMessage}></NotificationImportant></ListItemIcon> :
                            null
                          }
                      </ListItem>
                      <Divider/>
                    </div>
                  )
                })
              }
            </List>
        </main>
      )
  
    }
  }
  
  export default withStyles(styles)(ChatListComponent);
