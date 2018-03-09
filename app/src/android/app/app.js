'use strict';

import React, {Component} from 'react';
import {BackAndroid} from 'react-native';

console.disableYellowBox = true;

import Login from './login';
import AppContainer from './appContainer';

class App extends Component {
    constructor(props) {
        super(props);
		
		BackAndroid.addEventListener('hardwareBackPress', () => {
			if (this.props.navigator) {
				this.props.navigator.pop();
			}
			return true;
		});
		
        this.state = {
            isLoggedIn: false
        };

        window.appConfig = {
            access_token: '',
			url: 'http://jwt-gai.herokuapp.com/',
			onLogOut: this.onLogOut.bind(this),
			users: {
                refresh: false
            },
			socket: {
                name: ''
            }	
        };		
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <AppContainer />
            )
        } else {
            return (
                <Login onLogin={this.onLogin.bind(this)}/>
            )
        }
    }

    onLogin() {
        console.log('onLogin');
        this.setState({isLoggedIn: true});
    }

    onLogOut() {
        console.log('onLogOut');
        this.setState({isLoggedIn: false});
    }
}

export default App;