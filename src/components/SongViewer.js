import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isAfter } from 'date-fns'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'

import { withStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import {
	Close as CloseIcon,
	Image as ImageIcon,
	Minus as MinusIcon,
	PlaylistPlus as PlaylistPlusIcon,
	Plus as PlusIcon,
	Pencil as PencilIcon,
	Settings as SettingsIcon,
} from 'mdi-material-ui'

import * as actions from '../redux/actions'
import ChordLine from './ChordLine'
import ChordPair from './ChordPair'
import ContentLimiter from './ContentLimiter'
import getKeyDiff from '../utils/getKeyDiff'
import Hero from './Hero'
import KeySelector from './KeySelector'
import Line from './Line'
import Parser from '../parsers/song-parser'
import Song from './Song'
import transposeChord from '../utils/transpose-chord'
import transposeLines from '../utils/transpose-lines'
import { linesToNashville } from '../utils/convertToNashville'

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	capoButton: {
		borderRadius: 3,
		flexDirection: 'column',
		padding: theme.spacing(),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(),
		top: theme.spacing(),
	},
	paper: {
		padding: theme.spacing(2),
		height: '100%',
		color: theme.palette.text.secondary,
	},
	control: {
		padding: theme.spacing(2),
	},
	select: {
		width: theme.spacing(7),
	},

	noPrint: {
		'@media print': {
			display: 'none !important',
		},
	},
})

class SongViewer extends Component {
	static defaultProps = {
		song: {},
	}

	static propTypes = {
		classes: PropTypes.object,
		isPreview: PropTypes.bool,
		setKey: PropTypes.string,
		song: PropTypes.object,
	}

	state = {
		capoAmount: 0,
		chordSize: 16,
		capoKey: null,
		isNashville: false,
		isSetListDialogVisible: false,
		isSongKeyDialogOpen: false,
		displayKey: '',
		lines: [],
		setList: [],
		wordSize: 20,
	}

	componentDidMount() {
		this.handleProps(this.props)
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.handleProps(nextProps)
	}

	addToSet = set => {
		const { song } = this.props

		// db.get(set.id)
		// 	.then(doc => {
		// 		const data = {
		// 			...doc
		// 		}
		//
		// 		data.songs = data.songs || []
		// 		data.songs.push({ id: song.id, key: song.key })
		// 		data.songs = uniqBy(data.songs, 'id')
		//
		// 		db.put(data)
		// 			.then(() => {
		// 				if (this.props.history) {
		// 					const location = {
		// 						pathname: `/sets/${doc.id}`
		// 					}
		//
		// 					this.props.history.push(location)
		// 				}
		// 			})
		// 			.catch(err => {
		// 				if (err.name === 'conflict') {
		// 					console.error('SongList.addToSet: conflict -', err)
		// 				} else {
		// 					console.error('SongList.addToSet -', err)
		// 				}
		// 			})
		// 	})
		// 	.catch(err => {
		// 		console.error(err)
		// 	})
	}

	createAddToSetHandler = set => () => {
		this.closeSetListDialog()
		this.addToSet(set)
	}

	handleSelectSetKey = option => {
		const { song } = this.props
		this.props.setCurrentSetSongKey({
			key: option.key,
			song,
		})

		console.log(option.key, this.state.displayKey)

		if (this.state.displayKey === option.key && this.props.song.id) {
			localStorage.removeItem(`chordboard.${this.props.song.id}.capoKey`)
		}
	}

	handleSelectDisplayKey = option => {
		const key = option.key === this.props.setKey ? null : option.key

		this.setState({
			displayKey: key,
			isNashville: option.value === 'nashville',
		})

		if (this.props.song.id) {
			if (this.props.setKey === option.key) {
				localStorage.removeItem(
					`chordboard.${this.props.song.id}.capoKey`
				)
			} else {
				localStorage.setItem(
					`chordboard.${this.props.song.id}.capoKey`,
					key
				)
			}
		}
		this.props.setCurrentSongUserKey(key)
	}

	handleSongKeyDialogClose = () =>
		this.setState({ isSongKeyDialogOpen: false })
	handleSongKeyDialogOpen = () => this.setState({ isSongKeyDialogOpen: true })

	handleProps = props => {
		//Set the page title to the song title
		document.title = props.song.title

		const songUser =
			(props.song.users &&
				props.song.users.find(u => u.id === props.user.id)) ||
			{}

		const capoKey = localStorage.getItem(
			`chordboard.${props.song.id}.capoKey`
		)
		const displayKey =
			capoKey || songUser.key || props.setKey || props.song.key

		const parser = new Parser()
		const lines = parser.parse(props.song.content)

		this.setState({ displayKey, lines })
	}

	scrollToSection(section) {
		let totalVertPadding = 32
		let headerHeight = 92

		window.location.href = '#'
		window.location.href = '#section-' + section.index

		let scrollBottom =
			window.innerHeight - document.body.scrollTop + totalVertPadding

		if (headerHeight < scrollBottom) {
			// Go back 92 pixels to offset the header.
			window.scrollBy(0, -headerHeight)
		}
	}

	changeKey = key => {
		if (key) {
			this.setState({ displayKey: key })
			this.props.setCurrentSongUserKey(key)
		}
	}

	chordSizeDown = () =>
		this.setState(prevState => ({ chordSize: prevState.chordSize - 1 }))
	chordSizeUp = () =>
		this.setState(prevState => ({ chordSize: prevState.chordSize + 1 }))

	closeSetListDialog = () =>
		this.setState({
			isSetListDialogVisible: false,
		})

	openSetListDialog = () =>
		this.setState({
			isSetListDialogVisible: true,
		})

	transposeDown = () => {
		this.changeKey(transposeChord(this.state.displayKey, -1))
	}
	transposeUp = () => {
		this.changeKey(transposeChord(this.state.displayKey, 1))
	}

	wordSizeDown = () =>
		this.setState(prevState => ({ wordSize: prevState.wordSize - 1 }))
	wordSizeUp = () =>
		this.setState(prevState => ({ wordSize: prevState.wordSize + 1 }))

	toggleNashville = value => () =>
		this.setState(prevState => ({
			isNashville: value !== undefined ? value : !prevState.isNashville,
		}))

	render() {
		const { classes, isPreview, setKey, setList, song } = this.props
		const {
			chordSize,
			isNashville,
			isSetListDialogVisible,
			isSongKeyDialogOpen,
			displayKey,
			lines: linesState,
			wordSize,
		} = this.state

		const capo = getKeyDiff(displayKey, setKey || song.key) //this is only for display purposes, telling the user where to put the capo
		const transposeAmount = getKeyDiff(song.key, displayKey) //this is how much to transpose by
		
		let lines = transposeLines(linesState, transposeAmount)
		if (isNashville) {
			lines = linesToNashville(displayKey, lines)
		}

		let capoKeyDescr = ''

		if (capo) {
			capoKeyDescr = 'Capo ' + capo
		} else {
			capoKeyDescr = 'Capo key'
		}

		const setListActive = filter(set => isAfter(set.setDate, new Date()))(
			setList
		)

		return (
			<Fade in={Boolean(song)} appear mountOnEnter unmountOnExit>
				<Container className="song-viewer">
					<Hero>
						<ContentLimiter>
							<Grid
								container
								className={classes.root}
								justify="space-between"
							>
								<Grid item xs={12} sm={7}>
									<Typography variant="h4">
										{song.title}
									</Typography>
									<Typography variant="subtitle1">
										{song.author}
									</Typography>
								</Grid>
								{!isPreview && (
									<Grid
										item
										xs={12} sm={5}
										className={classes.noPrint}
									>
										<form autoComplete="off">
											{setKey && (
												<Tooltip title="The key everyone will be playing in">
													<KeySelector
														label="Set key"
														onSelect={
															this
																.handleSelectSetKey
														}
														songKey={setKey}
													/>
												</Tooltip>
											)}

											<Tooltip title="The key you will be playing in">
												<KeySelector
													label={capoKeyDescr}
													onSelect={
														this
															.handleSelectDisplayKey
													}
													songKey={
														displayKey || setKey
													}
													className={classes.select}
												/>
											</Tooltip>

											<Tooltip title="Edit song">
												<IconButton
													className={classes.button}
													href={`/songs/${
														song.id
													}/edit`}
												>
													<PencilIcon />
												</IconButton>
											</Tooltip>

											<Tooltip title="Add to set">
												<IconButton
													className={classes.button}
													onClick={
														this.openSetListDialog
													}
												>
													<PlaylistPlusIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title="Song settings">
												<IconButton
													className={classes.button}
													onClick={
														this
															.handleSongKeyDialogOpen
													}
												>
													<SettingsIcon />
												</IconButton>
											</Tooltip>

											<Dialog
												onClose={
													this.closeSetListDialog
												}
												open={Boolean(
													isSetListDialogVisible
												)}
											>
												<DialogTitle id="add-to-set-title">
													Add to Set
													<IconButton
														aria-label="Close"
														className={
															classes.closeButton
														}
														onClick={
															this
																.closeSetListDialog
														}
													>
														<CloseIcon />
													</IconButton>
												</DialogTitle>
												<List component="nav">
													{setListActive.map(set => (
														<ListItem
															button
															key={set.id}
															onClick={this.createAddToSetHandler(
																set
															)}
															value={set.id}
														>
															<Avatar>
																<ImageIcon />
															</Avatar>

															<ListItemText
																primary={
																	set.author +
																	' • ' +
																	set.title
																}
																secondary={
																	set.setDate
																}
															/>
														</ListItem>
													))}
												</List>
											</Dialog>

											
										</form>
									</Grid>
								)}
							</Grid>
						</ContentLimiter>
					</Hero>

					<ContentLimiter>
						<section className="section">
							<Container maxWidth={'xl'}>
								<Typography component="div">
									<Song
										chordSize={chordSize}
										lines={lines}
										wordSize={wordSize}
									/>
									{/*<div className="song-viewer__song">
									{parseSong( lines, sections, chordSize )}
								</div>*/}
								</Typography>
							</Container>
						</section>
					</ContentLimiter>

					{!isPreview && (
						<Dialog
							aria-labelledby="songkey-dialog-title"
							onClose={this.handleSongKeyDialogClose}
							open={isSongKeyDialogOpen}
						>
							<DialogTitle id="songkey-dialog-title">
								Song Settings
							</DialogTitle>

							<Paper className={classes.control}>
								<Grid container className={classes.root}>
									{/* Capo key is already editable via the song header
									<Grid item xs={12}>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography>
													Capo Key
												</Typography>
											</Grid>

											<Grid item xs={6}>
												<IconButton
													aria-label="Transpose down"
													onClick={this.transposeDown}
												>
													<MinusIcon />
												</IconButton>

												<IconButton
													aria-label="Transpose up"
													onClick={this.transposeUp}
												>
													<PlusIcon />
												</IconButton>

												<KeySelector
													onSelect={
														this
															.handleSelectDisplayKey
													}
													songKey={displayKey}
												/>

											</Grid>
										</Grid>
									</Grid> */}

									<Grid item xs={12}>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography>
													Word and Chord Size
												</Typography>
											</Grid>

											<Grid item xs={6}>
												<IconButton
													aria-label="Word size down"
													onClick={this.wordSizeDown}
												>
													<MinusIcon />
												</IconButton>

												<IconButton
													aria-label="Word size up"
													onClick={this.wordSizeUp}
												>
													<PlusIcon />
												</IconButton>
											</Grid>
										</Grid>
									</Grid>

{/* JL currently chord size doesn't do anything.
									<Grid item xs={12}>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography variant="h5">
													Chord Size
												</Typography>
											</Grid>

											<Grid item xs={6}>
												<IconButton
													aria-label="Chord size down"
													onClick={this.chordSizeDown}
												>
													<MinusIcon />
												</IconButton>

												<IconButton
													aria-label="Chord size up"
													onClick={this.chordSizeUp}
												>
													<PlusIcon />
												</IconButton>
											</Grid>
										</Grid>
									</Grid>
 */}
									<Grid item xs={12}>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Typography>
													Nashville Numbering
												</Typography>
											</Grid>

											<Grid item xs={6}>
												<Button
													variant="contained"
													aria-label="Toggle Nashville Numbering"
													onClick={this.toggleNashville()}
												>
													Toggle
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Paper>
						</Dialog>
					)}
				</Container>
			</Fade>
		)
	}
}

const mapStateToProps = state => ({
	setList: reduce((acc, set) => {
		acc.push(set)
		return acc
	})([])(state.sets.byId),
})

export default connect(
	mapStateToProps,
	actions
)(withStyles(styles)(SongViewer))

export function parseSong(lines, sections, chordSize) {
	let children = []
	let result = []
	let section = ''
	let sectionIndex = 0

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i]

		switch (lines[i].type) {
		case 'chord-line':
			children.push(<ChordLine key={i} chords={line.chords} />)
			break

		case 'chord-pair':
			children.push(
				<ChordPair key={i} chords={line.chords} text={line.text} />
			)
			break

		case 'empty':
			children.push(<div key={i} className="empty-line" />)
			break

		case 'line':
			children.push(<Line key={i} text={line.text} />)
			break

		case 'section':
			if (section) {
				// Finish off last section
				result.push(
					<section
						id={`section-${sectionIndex}`}
						key={`section-${sectionIndex}`}
						className="song-viewer__section"
						data-section={section}
					>
						{children}
					</section>
				)
				children = []
			} else {
				result = result.concat(children)
			}

			section = line.text
			sections.push({ title: line.text, index: sectionIndex })

			sectionIndex++

			break
		}
	} //end of loop through lines

	if (section) {
		result.push(
			<section
				id={`section-${sectionIndex}`}
				key={`section-${sectionIndex}`}
				className="song-viewer__section"
				data-section={section}
			>
				{children}
			</section>
		)
	}

	if (children.length && !section) {
		result = result.concat(children)
	}

	return result
}
