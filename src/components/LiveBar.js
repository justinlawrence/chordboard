import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, matchPath, withRouter } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	FormatListBulleted as SetListIcon,
} from 'mdi-material-ui'

import * as actions from '../redux/actions'
import getSongSections from '../utils/getSongSections'

const styles = theme => ({
	root: {
		// alignItems: 'stretch',
		backgroundColor: theme.palette.background.hero,
		borderTopColor: 'rgb(206, 206, 206)',
		borderTopWidth: '1px',
		display: 'flex',

		// Live bar has a fixed position so that the scroll can be natural
		// and not break the print view.
		bottom: 0,
		left: 0,
		position: 'fixed',
		right: 0,
		zIndex: 1,

		'@media print': {
			display: 'none !important',
		},
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2,
		width: 500,
	}),
	formFooter: {
		marginTop: theme.spacing.unit * 2,
	},
	deleteButton: {
		color: theme.palette.error.main,
	},
	sections: {
		alignItems: 'center',
		display: 'flex',
		flex: '1 1 0',
		height: '100%',
		overflowX: 'auto',
	},
	section: {
		backgroundColor: '#eee',
		border: 2,
		color: theme.palette.common.white,
		height: '100%',
		minWidth: theme.spacing.unit * 3,
		paddingLeft: theme.spacing.unit * 2,
		paddingRight: theme.spacing.unit * 2,
		position: 'relative',
	},
})

class LiveBar extends Component {
	static propTypes = {
		classes: PropTypes.object,
		location: PropTypes.object,
		// Redux props
		goToNextSong: PropTypes.func,
		goToPreviousSong: PropTypes.func,
	}

	state = {
		nextSongKey: '',
		nextSongTitle: '',
		previousSongKey: '',
		previousSongTitle: '',
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
			path: '/sets/:setId/songs/:songId',
		})

		if (match) {
			// db.get(match.params.setId).then(set => {
			// 	const setSongs = set.songs
			// 	const index = findIndex(set.songs, { _id: match.params.songId })
			// 	const keys = [null, null, null]
			//
			// 	const nextSetSong = setSongs && setSongs[index + 1]
			// 	const prevSetSong = setSongs && setSongs[index - 1]
			//
			// 	if (match && match.params.songId) {
			// 		keys[1] = match.params.songId
			// 	}
			//
			// 	if (index > -1) {
			// 		if (prevSetSong) {
			// 			keys[0] = prevSetSong._id
			// 		}
			// 		if (nextSetSong) {
			// 			keys[2] = nextSetSong._id
			// 		}
			// 	}
			//
			// 	db.allDocs({
			// 		include_docs: true,
			// 		keys: keys.filter(k => k)
			// 	}).then(result => {
			// 		const songs = result.rows.map(r => r.doc).filter(r => !!r)
			//
			// 		const currentSong = find(songs, { _id: keys[1] })
			// 		const nextSong = find(songs, { _id: keys[2] })
			// 		const previousSong = find(songs, { _id: keys[0] })
			//
			// 		if (nextSong && nextSetSong) {
			// 			nextSong.key = nextSetSong.key
			// 		}
			// 		if (previousSong && prevSetSong) {
			// 			previousSong.key = prevSetSong.key
			// 		}
			//
			// 		this.setState({
			// 			currentSong: currentSong ? new Song(currentSong) : null,
			// 			nextSongKey: nextSong ? nextSong.key : '-',
			// 			nextSongTitle: nextSong ? nextSong.title : '-- END --',
			// 			previousSongKey: previousSong ? previousSong.key : '-',
			// 			previousSongTitle: previousSong
			// 				? previousSong.title
			// 				: '-- BEGINNING --'
			// 		})
			// 	})
			// })
		}
	}

	render() {
		const {
			currentSetId,
			currentSong,
			onGoToNextSong,
			onGoToPreviousSong,
			classes,
		} = this.props

		const {
			nextSongKey,
			nextSongTitle,
			previousSongKey,
			previousSongTitle,
		} = this.state

		const sections = getSongSections(currentSong)
		let sectionIndex = 0

		// if (currentSong && currentSong.lines) {
		// 	currentSong.lines.forEach(line => {
		// 		if (line.type === 'section') {
		// 			sections.push({
		// 				index: ++sectionIndex,
		// 				text: line.text,
		// 			})
		// 		}
		// 	})
		// }

		const routes = [
			//'/songs/:id',
			'/sets/:setId/songs/:songsId',
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
			<nav className={classes.root}>
				<Grid container className={classes.root}>
					<Grid item xs={10}>
						<div className={classes.sections}>
							{sections.map(section => (
								<ButtonBase
									component="a"
									key={`section-${section.index}`}
									href={`#section-${section.index}`}
									className={classes.section}
									title={`Jump to ${section.title}`}
									style={{ backgroundColor: section.color }}
								>
									<Typography
										className={classes.sectionText}
										color="inherit"
									>
										{section.abbreviation}
									</Typography>
								</ButtonBase>
							))}
						</div>
					</Grid>

					<Grid item xs={2}>
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
						</div>
					</Grid>
				</Grid>
			</nav>
		) : null
	}
}

const mapStateToProps = state => ({
	currentSetId: state.currentSet.id,
	currentSong: state.songs.byId[state.currentSong.id],
})

export default withRouter(
	connect(
		mapStateToProps,
		actions
	)(withStyles(styles)(LiveBar))
)
