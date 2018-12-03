import React, { Component } from 'react'
import { findIndex } from 'lodash'
import { connect } from 'react-redux'
import {
	Redirect,
	Route,
	Switch,
	matchPath,
	withRouter
} from 'react-router-dom'

import CssBaseline from '@material-ui/core/CssBaseline'

import LiveBar from './app/common/LiveBar'
import Login from './app/login/Login'
import Navbar from './app/common/Navbar/Navbar'
import SongListContainer from './containers/SongListContainer'
import SongEditor from './app/SongEditor/SongEditor'
import SongContainer from './app/songs/SongContainer'
import SetListContainer from './containers/SetListContainer'
import Privacy from './app/privacy/Privacy'

import * as actions from './actions'
import { db, sync } from './database'
import { db as firebase } from './firebase'
//import './app.scss'

import { db as firestore } from './firebase'

class App extends Component {
	state = {
		focusedSet: null,
		setList: [],
		songList: []
	}

	componentDidMount() {
		//-------------------------------------------------------------------------
		// SAVE SETS
		db.allDocs({ include_docs: true }).then(response => {
			const sets = response.rows.map(i => i.doc).filter(d => d.type === 'set')
			//console.log( sets );

			sets.forEach(async set => {
				const newSet = {
					author: set.author,
					setDate: set.setDate,
					slug: set.slug,
					songs: [],
					title: set.title
				}
				//console.log('set', set);
				for (let i = 0; i < set.songs.length; i++) {
					const setSong = set.songs[i]
					const doc = await db.get(setSong._id)
					const querySnapshot = await firebase
						.collection('songs')
						.where('slug', '==', doc.slug)
						.get()
					querySnapshot.forEach(songDoc => {
						newSet.songs.push({
							id: songDoc.id,
							ref: songDoc.ref,
							key: setSong.key
						})
					})
				}

				//console.log('newSet', newSet);
				// Uncomment to build new sets.
				//firebase.collection( 'sets' ).add( newSet );
			})

			console.log('sets on pouchdb:', sets.length)

			firebase
				.collection('sets')
				.get()
				.then(querySnapshot => {
					console.log('sets on firebase:', querySnapshot.size)
				})
		})
		//-------------------------------------------------------------------------

		this._getListOfSongs().then(songList => {
			this.setState({ songList })
		})

		const setId = localStorage.getItem('focusedSetId')
		if (setId) {
			db.get(setId).then(doc => this.setState({ focusedSet: doc }))
		}

		sync.on('change', () => {
			this._getListOfSongs().then(songList => {
				this.setState({ songList })
			})
		})
	}

	exitLiveMode = () => {
		this.setFocusedSet(null)
	}

	goToNextSong = () => {
		this._getCurrentSongIndex().then(index => {
			this.goToSongIndex(index + 1)
		})
	}

	goToPreviousSong = () => {
		this._getCurrentSongIndex().then(index => {
			this.goToSongIndex(index - 1)
		})
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

	setFocusedSet = focusedSet => {
		//localStorage.setItem( 'focusedSetId', focusedSet ? focusedSet.id : '' );
		this.setState({ focusedSet })
	}

	render() {
		const { user } = this.props
		const { focusedSet, songList } = this.state

		return (
			<div className="app">
				<div className="app__content">
					<CssBaseline />
					<Navbar />
					<Switch>
						<Route exact path="/privacy" component={Privacy} />

						<Route exact path="/login" component={Login} />

						<Route
							path="/sets"
							render={props => (
								<SetListContainer setFocusedSet={this.setFocusedSet} />
							)}
						/>

						{!user.name && <Redirect to="/login" />}

						<Route
							exact
							path="/songs"
							render={props => <SongListContainer {...props} />}
						/>

						<Route
							exact
							path="/songs/add-to-set/:setId"
							render={props => (
								<SongListContainer
									setId={props.match.params.setId}
									{...props}
								/>
							)}
						/>

						<Route exact path="/songs/new" component={SongEditor} />

						<Route
							exact
							path="/songs/:id/edit"
							render={props => (
								<SongEditor id={props.match.params.id} {...props} />
							)}
						/>

						<Route
							exact
							path="/songs/:id"
							render={({ match }) => <SongContainer id={match.params.id} />}
						/>

						<Redirect to="/sets" />
					</Switch>
				</div>

				<LiveBar
					onExitLiveMode={this.exitLiveMode}
					onGoToNextSong={this.goToNextSong}
					onGoToPreviousSong={this.goToPreviousSong}
				/>
			</div>
		)
	}

	_getSet = () => {
		if (this.props.location) {
			const match = matchPath(this.props.location.pathname, {
				path: '/sets/:setId/songs/:songId',
				exact: true
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
				exact: true
			})

			return set ? findIndex(set.songs, { id: match.params.songId }) : -1
		})
	}

	_getListOfSongs = () => {
		return db
			.find({
				selector: {
					type: 'song'
				}
			})
			.then(result => result.docs)
			.catch(err => {
				console.warn(
					'App.constructor - pouchdb query failed: _getListOfSongs',
					err
				)
			})
	}
}

const mapStateToProps = state => ({
	user: state.user
})

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(App)
)
