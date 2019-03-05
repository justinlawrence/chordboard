import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { find, findIndex } from 'lodash'
import { Link, matchPath, withRouter } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	FormatListBulleted as SetListIcon
} from 'mdi-material-ui'

import * as actions from '../redux/actions'
import { db } from '../database'
import SongKey from './SongKey'
import Song from '../utils/Song'
import Tooltip from '@material-ui/core/Tooltip'

//import './live-bar.scss';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2,
		width: 500
	}),
	formFooter: {
		marginTop: theme.spacing.unit * 2
	},
	deleteButton: {
		color: theme.palette.error.main
	},
	liveBar: {
		alignItems: 'stretch',
		// backgroundColor: '#F6F9FC',
		backgroundColor: 'rgb(242, 242, 242)',
		borderTopColor: 'rgb(206, 206, 206)',
		borderTopWidth: '1px',
		display: 'flex',
		flex: '0 0 48px'
	}
})

class LiveBar extends Component {
	static propTypes = {
		classes: PropTypes.object,
		location: PropTypes.object,
		// Redux props
		goToNextSong: PropTypes.func,
		goToPreviousSong: PropTypes.func
	}

	state = {
		nextSongKey: '',
		nextSongTitle: '',
		previousSongKey: '',
		previousSongTitle: ''
	}

	componentDidMount() {
		this.handleProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.handleProps(nextProps)
	}

	handleGoToNextSong = () => this.props.goToNextSong()
	handleGoToPreviousSong = () => this.props.goToPreviousSong()

	handleProps = props => {
		const { location } = props

		//see if we're currently on a song and therefore need to show the livebar

		const match = matchPath(location.pathname, {
			path: '/sets/:setId/songs/:songId'
		})

		if (match) {
			db.get(match.params.setId).then(set => {
				const setSongs = set.songs
				const index = findIndex(set.songs, { _id: match.params.songId })
				const keys = [null, null, null]

				const nextSetSong = setSongs && setSongs[index + 1]
				const prevSetSong = setSongs && setSongs[index - 1]

				if (match && match.params.songId) {
					keys[1] = match.params.songId
				}

				if (index > -1) {
					if (prevSetSong) {
						keys[0] = prevSetSong._id
					}
					if (nextSetSong) {
						keys[2] = nextSetSong._id
					}
				}

				db.allDocs({
					include_docs: true,
					keys: keys.filter(k => k)
				}).then(result => {
					const songs = result.rows.map(r => r.doc).filter(r => !!r)

					const currentSong = find(songs, { _id: keys[1] })
					const nextSong = find(songs, { _id: keys[2] })
					const previousSong = find(songs, { _id: keys[0] })

					if (nextSong && nextSetSong) {
						nextSong.key = nextSetSong.key
					}
					if (previousSong && prevSetSong) {
						previousSong.key = prevSetSong.key
					}

					this.setState({
						currentSong: currentSong ? new Song(currentSong) : null,
						nextSongKey: nextSong ? nextSong.key : '-',
						nextSongTitle: nextSong ? nextSong.title : '-- END --',
						previousSongKey: previousSong ? previousSong.key : '-',
						previousSongTitle: previousSong
							? previousSong.title
							: '-- BEGINNING --'
					})
				})
			})
		}
	}

	render() {
		const {
			currentSetId,
			onGoToNextSong,
			onGoToPreviousSong,
			classes
		} = this.props

		const {
			currentSong,
			nextSongKey,
			nextSongTitle,
			previousSongKey,
			previousSongTitle
		} = this.state

		const sections = []
		let sectionIndex = 0

		if (currentSong && currentSong.lines) {
			currentSong.lines.forEach(line => {
				if (line.type === 'section') {
					sections.push({
						index: ++sectionIndex,
						text: line.text
					})
				}
			})
		}

		const routes = [
			//'/songs/:id',
			'/sets/:setId/songs/:songsId'
		]
		const { location } = this.props
		let show = false

		routes.forEach(path => {
			const match = matchPath(location.pathname, { path })

			if (match) {
				show = true
			}
		})

		/*const match = matchPath(location.pathname, {
			path: '/sets/:setId/songs/:songsId'
		})*/

		return show ? (
			<nav className={classes.liveBar}>
				<Grid container className={classes.root} justify="space-between">
					<Grid item xs={8} sm={7}>
						<div className="live-bar__sections">
							{sections.map(section => (
								<a
									key={`section-${section.index}`}
									href={`#section-${section.index}`}
									className="live-bar__section-link song-viewer__section"
									data-section={section.text}
									title={`Jump to the ${section.text}`}
								/>
							))}
						</div>
					</Grid>

					<Grid item xs={4} sm={5}>
						<div className="live-bar__navigation-actions">
							<Hidden xsDown>
								<Tooltip title="Back to setlist">
									<IconButton
										className={classes.button}
										component={Link}
										to={`/sets/${currentSetId}`}
									>
										<SetListIcon />
									</IconButton>
								</Tooltip>
							</Hidden>

							<Tooltip title="Jump to previous song">
								<IconButton
									className={classes.button}
									onClick={this.handleGoToPreviousSong}
								>
									<ChevronLeftIcon />
								</IconButton>
							</Tooltip>

							<Tooltip title="Jump to next song">
								<IconButton
									className={classes.button}
									onClick={this.handleGoToNextSong}
								>
									<ChevronRightIcon />
								</IconButton>
							</Tooltip>

							{/*
							<a
								className="live-bar__navigation-actions__item"
								onClick={onGoToPreviousSong}
								title="Jump to the previous song"
							>
								<ChevronLeftIcon />

								<Hidden xsDown>
									{previousSongTitle && (
										<React.Fragment>
											<SongKey value={previousSongKey} />
											{previousSongTitle}
										</React.Fragment>
									)}
								</Hidden>
							</a>

							<a
								className="live-bar__navigation-actions__item"
								onClick={onGoToNextSong}
								title="Jump to the next song"
							>
								<Hidden xsDown>
									{nextSongTitle && (
										<React.Fragment>
											<SongKey value={nextSongKey} />
											{nextSongTitle}
										</React.Fragment>
									)}
								</Hidden>

								<ChevronRightIcon />
							</a>
							
							*/}
						</div>
					</Grid>
				</Grid>
			</nav>
		) : null
	}
}

const mapStateToProps = state => ({
	currentSetId: state.currentSet.id,
	currentSong: state.songs.byId[state.currentSong.id]
})

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(withStyles(styles)(LiveBar))
)
