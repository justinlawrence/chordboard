import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import cx from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'

import * as actions from '../redux/actions'
import chordboardLogo from '../chordboard-logo-dark.png'

const styles = theme => ({
	root: {},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	logo: {
		paddingRight: 8,
		height: 16
	}
})

class Navbar extends React.Component {
	state = {
		isMenuVisible: false
	}

	logout = () => {
		localStorage.setItem('user', '')

		this.props.setCurrentUser({ name: null })

		if (this.props.history) {
			this.props.history.push({ pathname: '/login' })
		}

		let loginFrom = localStorage.getItem('loginFrom')

		if (loginFrom === 'google') {
			//google logout as per https://developers.google.com/identity/sign-in/web/sign-in
			var auth2 = window.gapi.auth2.getAuthInstance()
			auth2.signOut().then(function() {
				console.log('Google user signed out')
			})
		} else if (loginFrom === 'facebook') {
			//facebook logout as per https://developers.facebook.com/docs/facebook-login/web/
			/*FB.logout( function ( response ) {
				// Person is now logged out
				console.log( 'Facebook user signed out' );
			} );*/
		}
	}

	setUserTextSize = () => {
		this.props.setCurrentUser({ textSize: 82 })
	}

	toggleNavbarMenu = () => {
		this.setState({
			isMenuVisible: !this.state.isMenuVisible
		})
	}

	render() {
		const { focusedSet, syncState, classes } = this.props

		const { isMenuVisible } = this.state

		return (
			<div className={classes.root}>
				<AppBar color="secondary" position="static" className="no-print">
					<Toolbar>
						<Link to="/">
							<img src={chordboardLogo} className={classes.logo} />
						</Link>

						{/*
					<IconButton aria-label="Menu" className={classes.menuButton} color="inherit">
						<MenuIcon/>
					</IconButton> */}

						<Button component={Link} color="inherit" to="/sets">
							Sets
						</Button>
						<Button component={Link} color="inherit" to="/songs">
							Songs
						</Button>
					</Toolbar>
				</AppBar>
			</div>
		)

		return (
			<nav className="navbar no-print">
				<div className="container">
					<div className="navbar-brand">
						<Link className="navbar-item" to="/">
							<img
								src="/assets/chordboard-logo-inline.png"
								alt="chordboard: a chord-sheet manager for live musicians"
								width="142"
							/>
						</Link>
						<div className="navbar-burger" onClick={this.toggleNavbarMenu}>
							<span />
							<span />
							<span />
						</div>
					</div>

					<div className={cx('navbar-menu', { 'is-active': isMenuVisible })}>
						<div className="navbar-start">
							<Link className="navbar-item" to="/sets">
								Sets
							</Link>
							<Link className="navbar-item" to="/songs">
								Songs
							</Link>

							{focusedSet && (
								<Link className="navbar-item" to={`/sets/${focusedSet._id}`}>
									Live
								</Link>
							)}
						</div>
						<div className="navbar-end" />
					</div>
				</div>
			</nav>
		)
	}
}

Navbar.propTypes = {
	classes: PropTypes.object
}

const mapStateToProps = state => ({ syncState: state.syncState })

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(withStyles(styles)(Navbar))
)
