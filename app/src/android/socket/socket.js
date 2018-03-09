import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	TextInput,
	Dimensions,
	ActivityIndicator,
	ScrollView
} from 'react-native';

import ListItem from './listItem';

class Socket extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			width: Dimensions.get('window').width,
			messages: [],
			messageText: '',
			showProgress: true
		}
		
		ws = new WebSocket('ws://ui-socket.herokuapp.com');
		
		ws.onerror = (e) => {
			this.message = 'error'
		};
		
		ws.onopen = () => {
			ws.send('Hello ' + appConfig.socket.name + ' !!!'); 
			this.setState({
				showProgress: false
			});
		};

		ws.onmessage = (e) => {
			let d = new Date; 
			let messageObject = e.data;
			this.state.messages.unshift({
				id: +new Date(),
				name: messageObject.split('###')[1],
				date: d.toTimeString().split(' ')[0],
				message: messageObject.split('###')[0]
			})
			
			this.setState({
				showProgress: false
			});
		};
		
	}
 
 	goSend() {
		if (this.state.messageText == '') {
			this.setState({
				invalidValue: true
			});
			return;
		}
		
		let messageObject;
		messageObject = this.state.messageText + '###' + appConfig.socket.name;
		
		ws.send(messageObject); //TODO
		this.setState({
			messageText: '',
			showProgress: true
		});
	}
	
    onChangeText(text) {
        this.setState({
            messageText: text
        })
    }

    showMessages() {
        return this.state.messages.map((item) => {
            return (
                <ListItem
                    key={item.id}
                    item={item}
				/>
            )
        })
    }
	
	render() {
        var errorCtrl, loader;

        if (this.state.serverError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong.
            </Text>;
        }

        if (this.state.showProgress) {
            loader = <View style={{
                justifyContent: 'center',
                height: 100
            }}>
                <ActivityIndicator
					animating={this.state.showProgress}
					size="large"
					color="darkblue"
					style={styles.loader}
				/>
            </View>;
        }
		
		return (
			<View style={styles.container}>
				<View style={{
					flex: 1,
					backgroundColor: 'whitesmoke',
					borderColor: '#48BBEC',
					//borderRadius: 5,
					//borderWidth: 5
				}}>
					<ScrollView >
						{loader}
						{this.showMessages()}	 
					</ScrollView>
				</View>	
			
				<View style={{
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'white',
					backgroundColor: 'whitesmoke',
					borderColor: '#48BBEC',
					//borderRadius: 5,
					//borderWidth: 5,
					height: 170
				}}>
					<View>	
						<TextInput
							underlineColorAndroid='rgba(0,0,0,0)'
							onChangeText={(text)=> this.setState({
								messageText: text,
								invalidValue: false
							})}
							value={this.state.messageText}
							style={{ 
								height: 50,
								width: this.state.width * .95,
								marginTop: 0,
								padding: 4,
								fontSize: 18,
								borderWidth: 1,
								borderColor: 'lightgray',
								borderRadius: 5,
								color: 'black',
								backgroundColor: 'white'
							}} 
							placeholder='Message'>
						</TextInput>
						
					</View>	
					
					<View>	
						<TouchableHighlight
							onPress={()=> this.goSend()}
							style={{ 
								height: 50,
								width: this.state.width * .95,
								//backgroundColor: '#48BBEC',
								backgroundColor: 'darkblue',
								borderColor: '#48BBEC',
								alignSelf: 'stretch',
								marginTop: 10,
								margin: 5,
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: 5
							}} >
							<Text style={styles.buttonText}>
								Send
							</Text>
						</TouchableHighlight>
					</View>	
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'whitesmoke',
		borderColor: '#48BBEC',
		//borderRadius: 5,
		//borderWidth: 3
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		backgroundColor: 'white'
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	button: {
		height: 50,
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		alignSelf: 'stretch',
		marginTop: 10,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5
	},
    buttonText: {
        color: '#fff',
        fontSize: 20,
		fontWeight: 'bold'
    },
    error: {
        color: 'red',
        paddingTop: 10,
        textAlign: 'center'
    }	
});

export default Socket;