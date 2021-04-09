import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import cx from 'classnames'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { Google as GoogleIcon, Facebook as FacebookIcon } from 'mdi-material-ui'

import { setCurrentUser } from '../redux/actions'
import chordboardLogo from '../chordboard-logo-inline.png'
// import chordboardLogo from '../chordboard-logo-dark.png';

const styles = theme => ({
	root: {
		backgroundColor: theme.palette.background.hero,
		display: 'flex',
		flexGrow: 1,
		height: '90vh',
		paddingTop: '5vh',
	},
	container: {
		flexGrow: 1,
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing(8),
		paddingTop: theme.spacing(2),
		width: theme.spacing(40),
	}),
	formFooter: {
		marginTop: theme.spacing(2),
	},
	control: {
		padding: theme.spacing(2),
	},
	leftIcon: {
		marginRight: theme.spacing(),
	},
	rightIcon: {
		marginLeft: theme.spacing(),
	},
	facebookButton: {
		backgroundColor: '#4c69ba',
		margin: theme.spacing(),
	},
	googleButton: {
		backgroundColor: 'rgb(209, 72, 54)',
		margin: theme.spacing(),
	},
	addPaddingBottom: {
		paddingBottom: theme.spacing(4),
	},
	addPaddingTop: {
		paddingTop: theme.spacing(4),
	},
})

class Login extends Component {
	state = {
		email: '',
		name: '',
	}

	handleEmailChange = event => this.setState({ email: event.target.value })
	handleNameChange = event => this.setState({ name: event.target.value })

	handleLogin = event => {
		event.preventDefault()

		const user = {
			id: this.state.email,
			name: this.state.name,
		}

		localStorage.setItem('user', JSON.stringify(user))
		this.props.setCurrentUser(user)

		if (this.props.history) {
			this.props.history.push({ pathname: '/sets' })
		}
	}

	responseFacebook = response => {
		if (response && response.userID) {
			const user = {
				id: response.userID,
				name: response.name,
			}

			this.props.setCurrentUser(user)
			try {
				localStorage.setItem('user', JSON.stringify(user))
				localStorage.setItem('loginFrom', 'facebook')
			} catch (err) {
				console.error('Could not set `user` in localStorage')
			}

			console.log('Login.responseFacebook', this.props.history)

			if (this.props.history) {
				this.props.history.push({ pathname: '/sets' })
			}
		}
	}

	responseGoogle = response => {
		if (response && response.userID) {
			const user = {
				id: response.userID,
				name: response.name,
			}

			this.props.setCurrentUser(user)
			try {
				localStorage.setItem('user', JSON.stringify(user))
				localStorage.setItem('loginFrom', 'google')
			} catch (err) {
				console.error('Could not set `user` in localStorage')
			}

			console.log('Login.responseGoogle', this.props.history)

			if (this.props.history) {
				this.props.history.push({ pathname: '/sets' })
			}
		}
	}

	render() {
		const { classes } = this.props
		const { email, name } = this.state

		return (
			<div className={classes.root}>
				<Grid
					container
					className={classes.container}
					justify={'center'}
				>
					<form onSubmit={this.handleLogin}>
						<Paper className={classes.form} elevation={10}>
							<Grid
								container
								alignItems={'center'}
								direction={'column'}
							>
								{/* de-styled according to "facebook button without styling" https://www.npmjs.com/package/react-facebook-login */}

								<img
									src={chordboardLogo}
									alt={'chordboard logo'}
									height={'112px'}
									className={cx(
										classes.addPaddingTop,
										classes.addPaddingBottom
									)}
								/>

								<TextField
									id={'email'}
									label={'Your E-mail Address'}
									className={classes.textField}
									fullWidth
									value={email}
									onChange={this.handleEmailChange}
									margin={'normal'}
								/>

								<TextField
									id={'name'}
									label={'Your Name'}
									className={cx(
										classes.textField,
										classes.addPaddingBottom
									)}
									fullWidth
									value={name}
									onChange={this.handleNameChange}
									margin={'normal'}
								/>

								<Button
									variant={'outlined'}
									className={classes.button}
									type={'submit'}
									fullWidth
								>
									Login
								</Button>

								<div className={classes.addPaddingBottom} />

								<FacebookLogin
									appId={'2075514469393369'}
									autoLoad={false}
									callback={this.responseFacebook}
									render={renderProps => (
										<Button
											variant={'contained'}
											color={'primary'}
											fullWidth
											className={classes.facebookButton}
											onClick={renderProps.onClick}
										>
											<FacebookIcon
												className={classes.leftIcon}
											/>
											Continue with Facebook
										</Button>
									)}
								/>

								<GoogleLogin
									clientId={
										'839278764423-adpuvad4c202aqtsmkd39m9prca3vs8t.apps.googleusercontent.com'
									}
									buttonText={'LOGIN WITH GOOGLE'}
									onSuccess={this.responseGoogle}
									onFailure={this.responseGoogle}
									render={renderProps => (
										<Button
											variant={'contained'}
											color={'primary'}
											fullWidth
											className={classes.googleButton}
											onClick={renderProps.onClick}
										>
											<GoogleIcon
												className={classes.leftIcon}
											/>
											Sign in with Google
										</Button>
									)}
								/>
							</Grid>
						</Paper>
					</form>
				</Grid>
			</div>
		)
	}
}

const mapDispatchToProps = {
	setCurrentUser,
}
//export default withRouter( connect( mapStateToProps, actions )( withStyles( styles )( Navbar ) ) );

export default withRouter(
	connect(null, mapDispatchToProps)(withStyles(styles)(Login))
)
