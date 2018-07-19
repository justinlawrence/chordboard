import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import cx from 'classnames';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
import Grid from '@material-ui/core/Grid';
import Hero from '../../components/Hero';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { setCurrentUser } from 'actions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import chordboardLogo from '../../assets/chordboard-logo-long.png';

import {
	Google as GoogleIcon,
	Facebook as FacebookIcon
} from 'mdi-material-ui';


const styles = theme => ( {
	root: {
		backgroundColor: theme.heroBackgroundColor,
		display: 'flex',
		flexGrow: 1
	},
	container: {
		flexGrow: 1
	},
	form: theme.mixins.gutters( {
		paddingBottom: theme.spacing.unit * 8,
		paddingTop: theme.spacing.unit * 2,
		width: theme.spacing.unit * theme.spacing.unit * 5
	} ),
	formFooter: {
		marginTop: theme.spacing.unit * 2
	},
	control: {
		padding: theme.spacing.unit * 2
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	facebookButton: {
		backgroundColor: '#4c69ba',
		margin: theme.spacing.unit
	},
	googleButton: {
		backgroundColor: 'rgb(209, 72, 54)',
		margin: theme.spacing.unit
	},
	addPaddingBottom: {
		paddingBottom: theme.spacing.unit * 4
	},
	addPaddingTop: {
		paddingTop: theme.spacing.unit * 4
	}
} );

class Login extends Component {
	state = {
		id: '',
		name: ''
	};

	handleEmailInput = event => this.setState( { id: event.target.value } );
	handleNameInput = event => this.setState( { name: event.target.value } );

	handleLogin = event => {

		event.preventDefault();

		const user = {
			id: this.state.id,
			name: this.state.name
		};

		localStorage.setItem( 'user', JSON.stringify( user ) );
		this.props.setCurrentUser( user );

		if ( this.props.history ) {
			this.props.history.push( { pathname: '/sets' } );
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
				localStorage.setItem( 'loginFrom', 'facebook' );

			} catch ( err ) {
				console.error( 'Could not set `user` in localStorage' );
			}

			console.log( 'Login.responseFacebook', this.props.history );

			if ( this.props.history ) {
				this.props.history.push( { pathname: '/sets' } );
			}
		}
	};

	responseGoogle = response => {
		if ( response && response.userID ) {
			const user = {
				id: response.userID,
				name: response.name
			};

			this.props.setCurrentUser( user );
			try {
				localStorage.setItem( 'user', JSON.stringify( user ) );
				localStorage.setItem( 'loginFrom', 'google' );
			} catch ( err ) {
				console.error( 'Could not set `user` in localStorage' );
			}

			console.log( 'Login.responseGoogle', this.props.history );

			if ( this.props.history ) {
				this.props.history.push( { pathname: '/sets' } );
			}
		}
	};

	render() {

		const props = this.props;
		const { classes } = this.props;

		const { name } = this.state;

		return (
			<div className={classes.root}>
				<Grid container className={classes.container} alignItems="center" justify="center">
					<form onSubmit={this.handleLogin}>

						<Paper className={classes.form} elevation={10}>

							<Grid container alignItems="center"
							      direction="column">

								<img src={chordboardLogo} width="200px"
								     className={cx(
									     classes.addPaddingTop,
									     classes.addPaddingBottom
								     )}/>

								<Typography variant="title"
								            className={classes.addPaddingBottom}>
									Please Log In
								</Typography>

								{/* look up mui buttonBase  look up styling on google/fb */}
								{/* de-styled according to "facebook button without styling" https://www.npmjs.com/package/react-facebook-login */}

								<FacebookLogin
									appId="2075514469393369"
									autoLoad={false}
									callback={this.responseFacebook}
									render={renderProps => (
										<Button variant="contained" color="primary"
										        fullWidth
										        className={classes.facebookButton}
										        onClick={renderProps.onClick}
										>
											<FacebookIcon className={classes.leftIcon}/>
											Continue with Facebook
										</Button>
									)}
								/>

								<GoogleLogin
									clientId="839278764423-adpuvad4c202aqtsmkd39m9prca3vs8t.apps.googleusercontent.com"
									buttonText="LOGIN WITH GOOGLE"
									onSuccess={this.responseGoogle}
									onFailure={this.responseGoogle}
									render={renderProps => (
										<Button variant="contained" color="primary" fullWidth
										        className={classes.googleButton}
										        onClick={renderProps.onClick}
										>
											<GoogleIcon className={classes.leftIcon}/>
											Sign in with Google
										</Button>
									)}/>

								<Typography className={classes.addPaddingTop}>
									Prefer not to log in?
								</Typography>

								<Button href={'https://beta.chordboard.co'}>
									Go to the previous version
								</Button>

							</Grid>
						</Paper>

					</form>
				</Grid>
			</div>
		);
	}
}

const mapDispatchToProps = {
	setCurrentUser
};
//export default withRouter( connect( mapStateToProps, actions )( withStyles( styles )( Navbar ) ) );

export default withRouter( connect( null, mapDispatchToProps )( withStyles( styles )( Login ) ) );
