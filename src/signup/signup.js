
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// const firebase = require("firebase"); for v6.0.2

// for v9.0
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

class SignupComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            passwordConfirmation: null,
            signupError: '',
        };
    }

    


    // taking two arguements
    userTyping = (type, e) => {
        // console.log(type, e);

        switch (type) {
            case 'email':
            this.setState({email: e.target.value});
            break;

            case 'password':
            this.setState({password: e.target.value});
            break;

            case 'passwordConfirmation':
            this.setState({passwordConfirmation: e.target.value});
            break;

            default:
            break;

        }
    };


    //Custom validation
    formValid = () => 
    this.state.password === this.state.passwordConfirmation;
    
    submitSignup = (e) => {
        // page refresh block
        e.preventDefault();
        if(!this.formValid()) {
            this.setState({ signupError: "Password doesn't match!" });
            return;
        }        
        // console.log('Submitting!', this.state);
        // call all firebase method
        // users the firebase collection
        firebase
        .auth()
        .createUserWithEmailAndPassword( this.state.email, this.state.password )
        .then(authRes => {
            const userObj = {
                email: authRes.user.email
            };
            firebase
            .firestore()
            .collection('users')
            .doc(this.state.email)
            .set(userObj)
            // if success
            .then(() => {
                this.props.history.push('/dashboard')
            }, dbError => {
                console.log(dbError);
                this.setState({signupError: 'Failed to add user!' });
            });
        }, authErr => {
            console.log(authErr);
            this.setState({signupError: 'Failed to add user!' });
        })


    };

    render() {
        // 1st do this
        // class binding with style
        const { classes } = this.props;

        
        
        
        return (
           <main className={classes.main}> 
            <CssBaseline></CssBaseline>
            <Paper className={classes.paper}>
                <Typography component='h1' variant='h5'>
                    Sign Up!
                </Typography>
                {/*  anonymous function in onSubmit */}
                <form onSubmit={(e) => this.submitSignup(e)} className={classes.form}>
                <FormControl required fullWidth margin='normal'>
                    <InputLabel htmlFor='signup-email-input'>
                    Enter Your Email
                    </InputLabel>
                    <Input autoComplete='email' onChange={(e) => this.userTyping('email', e)} autoFocus id='signup-email-input'></Input>
                </FormControl>

                <FormControl required fullWidth margin='normal'>
                <InputLabel htmlFor='signup-password-input'>
                    Create A Password
                    </InputLabel>
                    <Input type='password' autoComplete='password' onChange={(e) => this.userTyping('password', e)} autoFocus id='signup-password-input'></Input>
                </FormControl>

                <FormControl required fullWidth margin='normal'>
                <InputLabel htmlFor='signup-password-confirmation-input'>
                Confirmation Your Password
                    </InputLabel>
                    <Input type='password' autoComplete='password' onChange={(e) => this.userTyping('passwordConfirmation', e)} autoFocus id='signup-password-confirmation-input'></Input>
                </FormControl>
            <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>
                </form>
                {/* ":" mean if turnary opr */}
                {
                   this.state.signupError ? <Typography className={classes.errorText} component='h5' variant='h6'>
                       {this.state.signupError}
                   </Typography> : null
                }
                <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>Already Have An Account?</Typography>
                <Link className={classes.logInLink} to='/login'>Log In!</Link>
            </Paper>
           </main>
        )
    }
};

export default withStyles(styles)(SignupComponent);