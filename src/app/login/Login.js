import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ContentLimiter from '../../components/ContentLimiter';
import Hero from '../../components/Hero';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';


import { setCurrentUser } from 'actions';

import './login.scss';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  form: theme.mixins.gutters({
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  }),
  formFooter: {
    marginTop: theme.spacing.unit * 2
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});


class Login extends Component {
	state = {
		name: ''
	};

	handleInput = event => this.setState( { name: event.target.value } );

	handleLogin = event => {

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

	};

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

			console.log( 'Login.responseFacebook', this.props.history );
			
			if ( this.props.history ) {
				this.props.history.push( {
					pathname: '/sets'
				} );
			}
		}
	};

	render() {

		const props = this.props;
		const {classes} = this.props;

		const { name } = this.state;

		return (
			<div className="login">
				<Hero>
					<ContentLimiter>

						<Grid container className={classes.root} justify="space-between">

							<Grid item xs={12}>
								<Paper className={classes.form}>

									<Grid container className={classes.root} justify="space-between">

										<Grid item xs={12}>

											<form onSubmit={this.handleLogin}>

												<FacebookLogin
													appId="2075514469393369"
													autoLoad={true}
													callback={this.responseFacebook}
												/>

											</form>

										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</ContentLimiter>
				</Hero>
			</div>

		);
	}
}

const mapDispatchToProps = {
	setCurrentUser
};
//export default withRouter( connect( mapStateToProps, actions )( withStyles( styles )( Navbar ) ) );

export default withRouter( connect( null, mapDispatchToProps )( withStyles( styles )( Login ) ));
