import React from 'react'
import PropTypes from 'prop-types'
import { Link, matchPath, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import map from 'lodash/map'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import * as actions from '../redux/actions'
import { getThemeId } from '../redux/reducers/theme'
import chordboardLogo from '../chordboard-logo-dark.png'
import chordboardLogoSmall from '../chordboard-logo-short.png'
import {
	Brightness4 as LightModeIcon,
	Brightness5 as DarkModeIcon,
	Close as CloseIcon,
} from 'mdi-material-ui'

const styles = theme => ( {
	root: {
		'@media print': {
			display: 'none !important',
		},
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	logoBig: {
		height: theme.spacing.unit * 2,
		verticalAlign: 'middle',
	},
	logoWrapper: {
		paddingRight: theme.spacing.unit,
		paddingTop: theme.spacing.unit,
	},
	tabs: {
		flexGrow: 1,
		width: '100%',
	},
	tab: {
		root: {
			padding: 0,
		},
	},
	setToolbar: {},
	miniButton: {
		zoom: 0.8,
	},
} )

class Navbar extends React.Component {
	static propTypes = {
		classes: PropTypes.object,
		history: PropTypes.object,
		location: PropTypes.object,
		// Redux props
		currentSet: PropTypes.object,
		setCurrentSetId: PropTypes.func.isRequired,
		setCurrentUser: PropTypes.func.isRequired,
		songs: PropTypes.array,
		updateTheme: PropTypes.func.isRequired,
	}

	handleBackButton = () => {
		this.props.setCurrentSetId( null )
	}

	logout = () => {
		localStorage.setItem( 'user', '' )

		this.props.setCurrentUser( { name: null } )

		if ( this.props.history ) {
			this.props.history.push( { pathname: '/login' } )
		}

		let loginFrom = localStorage.getItem( 'loginFrom' )

		if ( loginFrom === 'google' ) {
			//google logout as per https://developers.google.com/identity/sign-in/web/sign-in
			var auth2 = window.gapi.auth2.getAuthInstance()
			auth2.signOut().then( () => {
				console.log( 'Google user signed out' )
			} )
		} else if ( loginFrom === 'facebook' ) {
			//facebook logout as per https://developers.facebook.com/docs/facebook-login/web/
			/*FB.logout( function ( response ) {
				// Person is now logged out
				console.log( 'Facebook user signed out' );
			} );*/
		}
	}

	setUserTextSize = () => this.props.setCurrentUser( { textSize: 82 } )

	toggleTheme = () => {
		const { themeId } = this.props
		if ( themeId === 'light' ) {
			this.props.updateTheme( 'dark' )
		} else {
			this.props.updateTheme( 'light' )
		}
	}

	render() {
		const { classes, currentSet, location, songs, themeId } = this.props

		let songId
		const match = matchPath( location.pathname, {
			path: '/sets/:setId/songs/:songId',
			exact: true,
		} )
		if ( match ) {
			songId = match.params.songId
		}

		return (
			<AppBar
				className={classes.root}
				color="secondary"
				position="sticky"
			>
				{!currentSet && (
					<Toolbar variant="dense">
						<Grid container alignItems="center">
							<Grid item xs>
								<Link to="/" className={classes.logoWrapper}>
									<img
										src={themeId === 'dark' ? chordboardLogo : chordboardLogo}
										className={classes.logoBig}
										alt="chordboard logo"
									/>
								</Link>
								<Button component={Link} color="inherit" to="/sets">
									Sets
								</Button>
								<Button
									component={Link}
									color="inherit"
									to="/songs"
								>
									Songs
								</Button>
							</Grid>

							<Grid item>
								<IconButton onClick={this.toggleTheme}>
									{themeId === 'dark' ? (
										<LightModeIcon/>
									) : (
										<DarkModeIcon/>
									)}
								</IconButton>
							</Grid>
						</Grid>
					</Toolbar>
				)}

				{currentSet && (
					<Toolbar className={classes.noPrint} variant="dense">
						<IconButton
							color="inherit"
							onClick={this.handleBackButton}
							className={classes.miniButton}
						>
							<CloseIcon/>
						</IconButton>
						<Tabs
							indicatorColor="primary"
							value={songId || false}
							className={classes.tabs}
							variant="scrollable"
							scrollButtons="auto"
						>
							<Tab
								key={'tabs-setlist'}
								component={Link}
								to={`/sets/${currentSet.id}`}
								label={'Setlist'}
								className={classes.tab}
								color="inherit"
								value={0}
							/>

							{map( songs, song => (
								<Tab
									key={`tabs-${song.id}`}
									component={Link}
									to={`/sets/${currentSet.id}/songs/${
										song.id
										}`}
									label={<Typography noWrap>{song.title}</Typography>}
									classes={{ root: classes.tab }}
									color="inherit"
									value={song.id}
								/>
							) )}
						</Tabs>
					</Toolbar>
				)}
			</AppBar>
		)
	}
}

const mapStateToProps = state => ( {
	currentSet: state.currentSet.id
		? state.sets.byId[ state.currentSet.id ]
		: null,
	currentSong: state.songs.byId[ state.currentSong.id ],
	themeId: getThemeId( state ),
	songs: state.currentSet.id
		? map(
			state.sets.byId[ state.currentSet.id ].songs,
			song => state.songs.byId[ song.id ],
		)
		: null,
} )

export default withRouter(
	connect(
		mapStateToProps,
		actions,
	)( withStyles( styles )( Navbar ) ),
)
