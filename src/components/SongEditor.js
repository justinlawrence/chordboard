import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import { connect } from 'react-redux'
import slugify from 'slugify'
import Textarea from 'react-textarea-autosize'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { db } from '../database'
import { parseSong } from './SongViewer'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import Hero from './Hero'
import Song from '../utils/Song'
import chordproParser from '../parsers/chordpro-parser'
import Parser from '../parsers/song-parser'
//import '../SongEditor/SongEditor.scss';

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2
	}),
	formFooter: {
		marginTop: theme.spacing.unit * 2
	},
	control: {
		padding: theme.spacing.unit * 2
	},
	addPaddingBottom: {
		paddingBottom: theme.spacing.unit
	},
	textEditorContent: {
		fontFamily: 'monospace',
		fontSize: '1.2em',
		width: '90%',
		height: '80vh !important',
		padding: '24px',
		border: '1px solid silver'
	},
	songPreview: {
		zoom: '0.3',
		padding: '12px'
	}
})

class SongEditor extends Component {
	static propTypes = {
		classes: PropTypes.object,
		id: PropTypes.string,
		match: PropTypes.object,
		history: PropTypes.object,
		// Redux props
		addSong: PropTypes.func.isRequired,
		deleteSong: PropTypes.func.isRequired,
		song: PropTypes.object,
		updateSong: PropTypes.func.isRequired
	}

	state = {
		author: '',
		content: '',
		isLoading: false,
		key: '',
		title: '',
		parserType: 'chords-above-words'
	}

	componentDidMount() {
		this.updateSongState()
	}

	componentDidUpdate(prevProps) {
		const { song } = this.props
		if (!song || !prevProps.song || song.id !== prevProps.song.id) {
			this.updateSongState()
		}
	}

	handleParserChange = event => {
		this.setState({ parserType: event.target.value })
	}

	onAuthorInput = event => {
		this.setState({ author: event.target.value })
	}

	onContentInput = event => {
		const content = event.target.value
		this.setState({ content })
	}

	onTitleInput = event => {
		this.setState({ title: event.target.value })
	}

	onKeyInput = event => {
		this.setState({ key: event.target.value })
	}

	onDeleteSong = () => {
		if (window.confirm('Are you very sure you want to delete this song?')) {
			this.props.deleteSong(this.props.song.id)
			if (this.props.history) {
				this.props.history.push({ pathname: '/songs' })
			}
		}
	}

	handleCancel = () => {
		if (this.props.history) {
			this.props.history.goBack()
		}
	}

	onSaveSong = () => {
		const { song } = this.props
		const { author, parserType, title, key } = this.state
		const isNew = !song || isNil(song.id)
		let content = this.state.content

		if (parserType === 'chordpro') {
			content = chordproParser(content)
		}

		const newSong = {
			author,
			content,
			key,
			title
		}

		if (isNew) {
			this.props.addSong(newSong)
		} else {
			this.props.updateSong(song.id, newSong)
		}

		// TODO: change this because it seems to cause a refresh
		if (this.props.history) {
			//this.props.history.goBack()
		}
	}

	updateSongState = () => {
		const { song } = this.props
		if (song) {
			this.setState({
				author: song.author,
				content: song.content,
				key: song.key,
				title: song.title
			})
		}
	}

	render() {
		const { classes, match } = this.props
		const { author, content, key, title, parserType } = this.state

		const isNew = match.path === '/songs/new'

		let parsedContent = content
		if (parserType === 'chordpro') {
			parsedContent = chordproParser(content)
		}
		const parser = new Parser()
		const previewSong = parseSong(parser.parse(parsedContent), [])

		return (
			<div className="song-editor">
				<Hero>
					<ContentLimiter>
						<Grid
							container
							className={classes.root}
							justify="center"
							hide="xsDown"
						>
							<Grid item xs={12} sm={8}>
								<Grid container>
									<Grid item>
										<Typography
											variant="caption"
											className={classes.addPaddingBottom}
										>
											Song Editor
										</Typography>
									</Grid>
									<Grid item>
										<select
											onChange={this.handleParserChange}
											value={parserType}
										>
											<option value="chords-above-words">
												Chords above words
											</option>
											<option value="chordpro">Onsong</option>
										</select>
									</Grid>
								</Grid>

								<Textarea
									className={classes.textEditorContent}
									onChange={this.onContentInput}
									placeholder="Type words and chords here. Add colons after section headings eg. Verse 1:"
									value={parsedContent}
								/>
							</Grid>

							<Grid item xs={12} sm={4}>
								<Grid
									container
									className={classes.root}
									justify="center"
									hide="xsDown"
								>
									<Paper className={classes.form} component="form">
										<Grid
											container
											className={classes.root}
											justify="space-between"
										>
											<Grid item xs={12}>
												<TextField
													id="title"
													label="Song title"
													className={classes.textField}
													fullWidth
													onChange={this.onTitleInput}
													margin="normal"
													value={title}
												/>
											</Grid>
											<Grid item xs={12}>
												<TextField
													id="author"
													label="Authors (comma separated)"
													className={classes.textField}
													fullWidth
													onChange={this.onAuthorInput}
													margin="normal"
													value={author}
												/>
											</Grid>
											<Grid item xs={12}>
												<TextField
													id="key"
													label="Key"
													className={classes.textField}
													fullWidth
													onChange={this.onKeyInput}
													margin="normal"
													value={key}
												/>
											</Grid>

											<Grid item xs={8}>
												<Grid container justify="flex-end">
													{!isNew && (
														<Button onClick={this.onDeleteSong} color="primary">
															Delete
														</Button>
													)}

													<Button onClick={this.handleCancel}>Cancel</Button>

													<Button
														onClick={this.onSaveSong}
														color="primary"
														variant="contained"
													>
														Save
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Paper>
								</Grid>

								<Grid item sm={4}>
									<Grid
										container
										className={classes.root}
										justify="space-between"
									>
										<Grid item xs={12}>
											<Typography
												variant="caption"
												className={classes.addPaddingBottom}
											>
												Song Preview
											</Typography>

											<Paper>
												<div className={classes.songPreview}>
													<h1 className="title">{title}</h1>
													<h2 className="subtitle">{author}</h2>

													<div>{previewSong}</div>
												</div>
											</Paper>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</ContentLimiter>
				</Hero>
			</div>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	song: state.songs.byId[ownProps.id]
})

export default connect(
	mapStateToProps,
	actions
)(withStyles(styles)(SongEditor))
