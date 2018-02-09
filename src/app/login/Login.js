import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {setUser} from 'app/actions/user';

import './login.scss';

class Login extends Component {
	state = {
		name: ''
	};

	handleInput = event => this.setState( { name: event.target.value } );

	handleLogin = event => {

		event.preventDefault();

		localStorage.setItem( 'user', this.state.name );
		this.props.setUser( {
			name: this.state.name
		} );

		if ( this.props.history ) {
			this.props.history.push( {
				pathname: '/sets'
			} );
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
										<p className="control has-icons-left">
											<input className="input is-medium" type="text" placeholder="Your Name" onInput={this.handleInput} value={name}/>
											<span className="icon is-small is-left"><i className="fa fa-envelope"/></span>
										</p>
									</div>

									<div className="field">
										<p className="control has-icons-left">
											<input className="input is-medium" type="password" placeholder="Password"/>
											<span className="icon is-small is-left"><i className="fa fa-lock"/></span>
										</p>
									</div>

									<div className="field">
										<p className="control">
											<button className="button is-primary is-medium is-fullwidth">
												Login
											</button>
										</p>
									</div>

								</form>

							</div>
						</article>

					</div>

				</section>

			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setUser: user => {
		dispatch( setUser( user ) );
	}
});


export default withRouter( connect( null, mapDispatchToProps )( Login ) );
