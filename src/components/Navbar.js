import React from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Link, matchPath, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import * as actions from '../redux/actions'
import { getThemeId } from '../redux/reducers/theme'
import { getSongsForCurrentSet } from '../redux/reducers/current-set'
import SetToolbar from './SetToolbar'
import chordboardLogoDark from '../chordboard-logo-light.png'
import chordboardLogoLight from '../chordboard-logo-dark.png'

import {
	WbSunnyOutlined as DarkModeIcon,
	Brightness2Outlined as LightModeIcon,
} from '@mui/icons-material'

const PREFIX = 'Navbar'

const classes = {
	root: `${PREFIX}-root`,
	flex: `${PREFIX}-flex`,
	menuButton: `${PREFIX}-menuButton`,
	logoBig: `${PREFIX}-logoBig`,
	logoWrapper: `${PREFIX}-logoWrapper`,
	tabs: `${PREFIX}-tabs`,
	tab: `${PREFIX}-tab`,
	setToolbar: `${PREFIX}-setToolbar`,
	miniButton: `${PREFIX}-miniButton`,
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	[`&.${classes.root}`]: {
		'@media print': {
			display: 'none !important',
		},
	},

	[`& .${classes.flex}`]: {
		flex: 1,
	},

	[`& .${classes.menuButton}`]: {
		marginLeft: -12,
		marginRight: 20,
	},

	[`& .${classes.logoBig}`]: {
		height: theme.spacing(2),
		verticalAlign: 'middle',
	},

	[`& .${classes.logoWrapper}`]: {
		paddingRight: theme.spacing(),
		paddingTop: theme.spacing(),
	},

	[`& .${classes.tabs}`]: {
		flexGrow: 1,
		width: '100%',
	},

	[`& .${classes.tab}`]: {
		root: {
			padding: 0,
		},
	},

	[`& .${classes.setToolbar}`]: {},

	[`& .${classes.miniButton}`]: {
		zoom: 0.8,
	},
}))

const version = require('../../package.json').version

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
			auth2.signOut().then(() => {
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

	setUserTextSize = () => this.props.setCurrentUser({ textSize: 82 })

	toggleTheme = () => {
		const { themeId } = this.props
		if (themeId === 'light') {
			this.props.updateTheme('dark')
		} else {
			this.props.updateTheme('light')
		}
	}

	render() {
		const { currentSet, location, songs, themeId } = this.props

		let songId
		const match = matchPath(location.pathname, {
			path: '/sets/:setId/songs/:songId',
			exact: true,
		})
		if (match) {
			songId = match.params.songId
		}

		return (
			<StyledAppBar
				className={classes.root}
				color={'secondary'}
				position={'sticky'}
			>
				{currentSet ? (
					<SetToolbar
						currentSet={currentSet}
						songId={songId}
						songs={songs}
					/>
				) : (
					<Toolbar variant={'dense'}>
						<Grid container alignItems={'center'}>
							<Grid item xs>
								<Link to={'/'} className={classes.logoWrapper}>
									<img
										src={
											themeId === 'dark'
												? chordboardLogoDark
												: chordboardLogoLight
										}
										className={classes.logoBig}
										alt={'chordboard logo'}
									/>
								</Link>
								<Button
									component={Link}
									color={'inherit'}
									to={'/sets'}
								>
									Cancionero
								</Button>
								<Button
									component={Link}
									color={'inherit'}
									to={'/songs'}
								>
									Canciones
								</Button>
							</Grid>

							<Grid item>
								{/* <Typography variant={'caption'}>
									v{version}
								</Typography> */}
								<Tooltip
									title={
										themeId === 'dark'
											? 'light mode'
											: 'dark mode'
									}
								>
									<IconButton
										onClick={this.toggleTheme}
										size={'large'}
									>
										{themeId === 'dark' ? (
											<LightModeIcon />
										) : (
											<DarkModeIcon />
										)}
									</IconButton>
								</Tooltip>
							</Grid>
						</Grid>
					</Toolbar>
				)}
			</StyledAppBar>
		)
	}
}

const mapStateToProps = state => ({
	currentSet: state.currentSet.id
		? state.sets.byId[state.currentSet.id]
		: null,
	currentSong: state.songs.byId[state.currentSong.id],
	themeId: getThemeId(state),
	songs: getSongsForCurrentSet(state),
})

export default withRouter(connect(mapStateToProps, actions)(Navbar))
