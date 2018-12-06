import React, { Component } from 'react'
import { findIndex } from 'lodash'
import { connect } from 'react-redux'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import CssBaseline from '@material-ui/core/CssBaseline'

import * as actions from './redux/actions'
import { db } from './database'
import { db as firestore } from './firebase'
import LiveBar from './components/LiveBar'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import SongListContainer from './containers/SongListContainer'
import SongEditor from './components/SongEditor'
import SongContainer from './containers/SongContainer'
import SetListContainer from './containers/SetListContainer'
import Privacy from './pages/Privacy'

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
			const querySnapshot = await firestore
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
		//firestore.collection( 'sets' ).add( newSet );
	})

	console.log('sets on pouchdb:', sets.length)

	firestore
		.collection('sets')
		.get()
		.then(querySnapshot => {
			console.log('sets on firebase:', querySnapshot.size)
		})
})
//-------------------------------------------------------------------------

class App extends Component {
	render() {
		const { user } = this.props
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
							render={() => (
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
