import React, { Component } from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Textarea from 'react-textarea-autosize'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SongViewer from './SongViewer'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import Hero from './Hero'
import KeySelector from './KeySelector'
import chordproParser from '../parsers/chordpro-parser'
import Parser from '../parsers/song-parser'

const PREFIX = 'SongEditor'

const classes = {
	root: `${PREFIX}-root`,
	form: `${PREFIX}-form`,
	formFooter: `${PREFIX}-formFooter`,
	control: `${PREFIX}-control`,
	addPaddingBottom: `${PREFIX}-addPaddingBottom`,
	songPreview: `${PREFIX}-songPreview`,
	textEditor: `${PREFIX}-textEditor`,
	textEditorWrapper: `${PREFIX}-textEditorWrapper`,
}

const StyledHero = styled(Hero)(({ theme }) => ({
	[`& .${classes.root}`]: {
		flexGrow: 1,
	},

	[`& .${classes.form}`]: theme.mixins.gutters({
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
	}),

	[`& .${classes.formFooter}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.control}`]: {
		padding: theme.spacing(2),
	},

	[`& .${classes.addPaddingBottom}`]: {
		paddingBottom: theme.spacing(),
	},

	[`& .${classes.songPreview}`]: {
		overflow: 'hidden',
		width: '100%',
		padding: theme.spacing(2),
		paddingRight: theme.spacing(4),
		zoom: '0.6',
	},

	[`& .${classes.textEditor}`]: {
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

	[`& .${classes.textEditorWrapper}`]: {
		display: 'flex',
		overflow: 'hidden',
		width: '100%',
		marginBottom: theme.spacing(4),
	},
}))

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

	handleSelectSongKey = option => {
		this.setState({ key: option.key })
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
		const { match } = this.props
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
			<StyledHero>
				<ContentLimiter>
					<Grid container className={classes.root} spacing={3}>
						<Grid item xs={12} sm={8}>
							<Grid item>
								<Paper
									className={classes.form}
									component={'form'}
								>
									<Grid
										container
										//alignItems={'center'}
										spacing={1}
									>
										<Grid item xs={12}>
											<TextField
												id={'title'}
												label={'Titulo de la cancion'}
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
													'Autores (separados por coma)'
												}
												className={classes.textField}
												fullWidth
												onChange={this.onAuthorInput}
												margin={'normal'}
												value={author}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											{/* <TextField
												id={'key'}
												label={'Key'}
												className={classes.textField}
												fullWidth
												onChange={this.onKeyInput}
												margin={'normal'}
												value={key}
											/> */}
											<KeySelector
												label={'Tonalidad'}
												onSelect={
													this.handleSelectSongKey
												}
												margin={'normal'}
												size={'large'}
												songKey={key}
											/>
										</Grid>

										<Grid item xs={12}>
											<Grid
												container
												justifyContent={'flex-end'}
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
															Eliminar
														</Button>
													)}

													<Button
														onClick={
															this.handleCancel
														}
													>
														Cancelar
													</Button>

													<Button
														onClick={
															this.onSaveSong
														}
														color={'primary'}
														variant={'contained'}
													>
														Guardar
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
						<Hidden mdDown>
							<Grid item xs={12} sm={4}>
								<Paper className={classes.songPreview}>
									<Typography
										className={classes.addPaddingBottom}
									>
										Vista previa de la cancion
									</Typography>

									<SongViewer isPreview song={previewSong} />
								</Paper>
							</Grid>
						</Hidden>
					</Grid>
				</ContentLimiter>
			</StyledHero>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	song: state.songs.byId[ownProps.id],
})

export default connect(mapStateToProps, actions)(withRouter(SongEditor))
