import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';

import { setCurrentUser } from 'actions';

import './login.scss';

class Login extends Component {
	state = {
		name: ''
	};

	handleInput = event => this.setState( { name: event.target.value } );

	/*handleLogin = event => {

		event.preventDefault();

		localStorage.setItem( 'user', this.state.name );
		this.props.setCurrentUser( {
			name: this.state.name
		} );

		if ( this.props.history ) {
			this.props.history.push( {
				pathname: '/sets'
			} );
		}

	};*/

	responseFacebook = response => {
		if ( response && response.userID ) {
			const user = {
				id: response.userID,
				name: response.name
			};

			this.props.setCurrentUser( user );
			try {
				localStorage.setItem( 'user', JSON.stringify( user ) );
			} catch ( err ) {
				console.error( 'Could not set `user` in localStorage' );
			}

			if ( this.props.history ) {
				this.props.history.push( {
					pathname: '/sets'
				} );
			}
		}
	};

	render() {

		const props = this.props;
		const { name } = this.state;

		return (
			<div>
				<section className="hero is-dark is-fullheight">
					<div className="hero-body">
						<div className="container has-text-centered">
									<h1 className="title is-1">Chordboard</h1>
									<h2 className="subtitle">On the same page</h2>
									<form onSubmit={this.handleLogin}>

											<div className="field">
												<FacebookLogin
													appId="2075514469393369"
													autoLoad={true}
													callback={this.responseFacebook}
												/>
											</div>
									</form>
						</div>
					</div>
				</section>

			</div>
		);
	}
}

const mapDispatchToProps = {
	setCurrentUser
};

export default withRouter( connect( null, mapDispatchToProps )( Login ) );
