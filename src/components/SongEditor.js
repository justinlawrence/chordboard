import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Textarea from 'react-textarea-autosize'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import SongViewer from './SongViewer'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import Hero from './Hero'
import chordproParser from '../parsers/chordpro-parser'
import Parser from '../parsers/song-parser'

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	form: theme.mixins.gutters({
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
	}),
	formFooter: {
		marginTop: theme.spacing(2),
	},
	control: {
		padding: theme.spacing(2),
	},
	addPaddingBottom: {
		paddingBottom: theme.spacing(),
	},
	songPreview: {
		overflow: 'hidden',
		width: '100%',
		padding: theme.spacing(2),
		paddingRight: theme.spacing(4),
		zoom: '0.6',
	},
	textEditor: {
		border: 'none',
		fontFamily: 'monospace',
		fontSize: theme.typography.h6.fontSize,
		minHeight: '80vh',
		padding: '24px',
		resize: 'none',
		width: '100%',
		backgroundColor: theme.palette.backgroundColor, //TODO: JL: not sure why these don't work
		color: theme.palette.color,
	},
	textEditorWrapper: {
		display: 'flex',
		overflow: 'hidden',
		width: '100%',
		marginBottom: theme.spacing(4),
	},
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
		updateSong: PropTypes.func.isRequired,
	}

	state = {
		author: '',
		content: '',
		isLoading: false,
		key: '',
		title: '',
		parserType: 'chords-above-words',
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
			this.props.history.push('/songs')
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
			title,
		}

		if (isNew) {
			this.props.addSong(newSong)
		} else {
			this.props.updateSong(song.id, newSong)
		}

		if (song && song.id) {
			this.props.history.push(`/songs/${song.id}`)
		} else {
			this.props.history.push('/songs')
		}
	}

	updateSongState = () => {
		const { song } = this.props
		if (song) {
			this.setState({
				author: song.author,
				content: song.content,
				key: song.key,
				title: song.title,
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
		const previewSong = {
			author,
			content: parsedContent,
			key,
			lines: parser.parse(parsedContent),
			title,
		}

		return (
			<Hero>
				<ContentLimiter>
					<Grid container className={classes.root} spacing={3}>
						<Grid item xs={12} sm={8}>
							<Grid item>
								<Paper
									className={classes.form}
									component={'form'}
								>
									<Grid container spacing={1}>
										<Grid item xs={12}>
											<TextField
												id={'title'}
												label={'Song title'}
												className={classes.textField}
												fullWidth
												onChange={this.onTitleInput}
												margin={'normal'}
												value={title}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												id={'author'}
												label={
													'Authors (comma separated)'
												}
												className={classes.textField}
												fullWidth
												onChange={this.onAuthorInput}
												margin={'normal'}
												value={author}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												id={'key'}
												label={'Key'}
												className={classes.textField}
												fullWidth
												onChange={this.onKeyInput}
												margin={'normal'}
												value={key}
											/>
										</Grid>

										<Grid item xs={12}>
											<Grid
												container
												justify={'flex-end'}
											>
												<Grid item>
													{!isNew && (
														<Button
															onClick={
																this
																	.onDeleteSong
															}
															color={'primary'}
														>
															Delete
														</Button>
													)}

													<Button
														onClick={
															this.handleCancel
														}
													>
														Cancel
													</Button>

													<Button
														onClick={
															this.onSaveSong
														}
														color={'primary'}
														variant={'contained'}
													>
														Save
													</Button>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid item sm={12}>
								<Grid container>
									<Grid item>
										<select
											onChange={this.handleParserChange}
											value={parserType}
										>
											<option
												value={'chords-above-words'}
											>
												Chords above words
											</option>
											<option value={'chordpro'}>
												Onsong
											</option>
										</select>
									</Grid>
								</Grid>

								<Paper className={classes.textEditorWrapper}>
									<Textarea
										className={classes.textEditor}
										onChange={this.onContentInput}
										placeholder={
											'Type words and chords here. Add colons after section headings eg. Verse 1:'
										}
										value={parsedContent}
									/>
								</Paper>
							</Grid>
						</Grid>
						<Hidden smDown>
							<Grid item xs={12} sm={4}>
								<Paper className={classes.songPreview}>
									<Typography
										className={classes.addPaddingBottom}
									>
										Song Preview
									</Typography>

									<SongViewer isPreview song={previewSong} />
								</Paper>
							</Grid>
						</Hidden>
					</Grid>
				</ContentLimiter>
			</Hero>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	song: state.songs.byId[ownProps.id],
})

export default connect(
	mapStateToProps,
	actions
)(withRouter(withStyles(styles)(SongEditor)))
