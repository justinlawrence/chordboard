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
				<section className="hero is-dark">
					<div className="hero-body">
						<div className="container">
							<div className="columns is-vcentered">
								<div className="column">
									<h1 className="title is-1">Chordboard</h1>
									<h2 className="subtitle">The setlist for live musicians.</h2>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="section columns">
					<div className="column is-one-third is-offset-one-third">
						<article className="card is-rounded">
							<div className="card-content">
								<form onSubmit={this.handleLogin}>
									<h1 className="title">
										Login
									</h1>

									<div className="field">
										<FacebookLogin
											appId="2075514469393369"
											autoLoad={true}
											callback={this.responseFacebook}
										/>
									</div>

									{/*<div className="field">
										<p className="control has-icons-left">
											<input className="input is-medium" type="text"
											       placeholder="Your Name"
											       onInput={this.handleInput} value={name}/>
											<span className="icon is-small is-left"><i
												className="fa fa-envelope"/></span>
										</p>
									</div>

									<div className="field">
										<p className="control has-icons-left">
											<input className="input is-medium" type="password"
											       placeholder="Password"/>
											<span className="icon is-small is-left"><i
												className="fa fa-lock"/></span>
										</p>
									</div>

									<div className="field">
										<p className="control">
											<button
												className="button is-primary is-medium is-fullwidth">
												Login
											</button>
										</p>
									</div>*/}

								</form>

							</div>
						</article>

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
