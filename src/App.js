import React, { Component } from 'react'
import { findIndex } from 'lodash'
import { connect } from 'react-redux'
import {
	Redirect,
	Route,
	Switch,
	matchPath,
	withRouter,
} from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import { ThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'

import * as actions from './redux/actions'
import { db } from './firebase'
import { getMuiTheme } from './redux/reducers/theme'
import LiveBar from './components/LiveBar'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import SetCurrentSong from './components/SetCurrentSong'
import SongListContainer from './containers/SongListContainer'
import SongEditor from './components/SongEditor'
import SongContainer from './containers/SongContainer'
import SetListContainer from './containers/SetListContainer'
import Privacy from './pages/Privacy'

const styles = theme => ({
	root: {
		height: '100vh',
	},
	content: {
		minHeight: 0,
	},
})

class App extends Component {
	componentDidMount = () => {
		this.props.fetchThemeRequest()
	}

	exitLiveMode = () => {
		this.props.history.push('/sets')
	}

	goToSongIndex = index => {
		this._getSet().then(set => {
			const len = set.songs.length

			// Set index range to between 0 and list length.
			index = Math.min(Math.max(index, 0), len - 1)

			// OR

			// Set index to wrap around at the ends.
			//index = index < 0 ? len - 1 : index >= len ? 0 : index;

			const setSong = set.songs[index]

			if (!setSong) {
				return
			}

			if (this.props.history) {
				this.props.history.push(`/sets/${set.id}/songs/${setSong.id}`)
			}
		})
	}

	_getSet = () => {
		if (this.props.location) {
			const match = matchPath(this.props.location.pathname, {
				path: '/sets/:setId/songs/:songId',
				exact: true,
			})

			if (match) {
				return db.get(match.params.setId)
			}
		}
	}

	_getCurrentSongIndex = () => {
		return this._getSet().then(set => {
			const match = matchPath(this.props.location.pathname, {
				path: '/sets/:setId/songs/:songId',
				exact: true,
			})

			return set ? findIndex(set.songs, { id: match.params.songId }) : -1
		})
	}

	render() {
		const { classes, muiTheme, user } = this.props

		return (
			<ThemeProvider theme={muiTheme}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<Grid
						container
						className={classes.root}
						direction={'column'}
						wrap={'nowrap'}
					>
						<CssBaseline />
						<SetCurrentSong />
						<Navbar />

						<Grid className={classes.content} item xs>
							<Switch>
								<Route
									exact
									path={'/privacy'}
									component={Privacy}
								/>
								<Route
									exact
									path={'/login'}
									component={Login}
								/>
								<Route
									path={'/sets'}
									component={SetListContainer}
								/>

								{!user.name && <Redirect to={'/login'} />}

								<Route
									exact
									path={'/songs'}
									component={SongListContainer}
								/>

								<Route
									exact
									path={'/songs/add-to-set/:setId'}
									render={props => (
										<SongListContainer
											setId={props.match.params.setId}
											{...props}
										/>
									)}
								/>

								<Route
									exact
									path={'/songs/new'}
									component={SongEditor}
								/>

								<Route
									exact
									path={'/songs/:id/edit'}
									render={props => (
										<SongEditor
											id={props.match.params.id}
											{...props}
										/>
									)}
								/>

								<Route
									exact
									path={'/songs/:id'}
									render={({ match }) => (
										<SongContainer id={match.params.id} />
									)}
								/>

								<Redirect to={'/sets'} />
							</Switch>
						</Grid>

						<LiveBar onExitLiveMode={this.exitLiveMode} />
					</Grid>
				</MuiPickersUtilsProvider>
			</ThemeProvider>
		)
	}
}

const mapStateToProps = state => ({
	muiTheme: getMuiTheme(state),
	user: state.user,
})

export default withRouter(
	connect(mapStateToProps, actions)(withStyles(styles)(App))
)
