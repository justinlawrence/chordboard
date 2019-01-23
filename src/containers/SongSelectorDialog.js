import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import filter from 'lodash/fp/filter'
import flow from 'lodash/fp/flow'
import includes from 'lodash/fp/includes'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { ArrowLeft as BackIcon, Magnify as SearchIcon } from 'mdi-material-ui'

const styles = theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%'
	},
	input: {
		marginLeft: 8,
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4
	},
	content: {
		paddingLeft: 0,
		paddingRight: 0
	}
})

class SongSelectorDialog extends PureComponent {
	static defaultProps = {
		songs: []
	}

	static propTypes = {
		classes: PropTypes.object,
		onClose: PropTypes.func.isRequired,
		open: PropTypes.bool.isRequired,
		// Redux props
		songs: PropTypes.array
	}

	state = {
		setSongs: []
	}

	handleClose = () => this.props.onClose([])

	handleCheckboxClick = value => event => {
		event.stopPropagation()
		this.setState(prevState => ({
			setSongs: [...prevState.setSongs, value]
		}))
	}

	handleListItemClick = value => () => this.props.onClose([value])

	handleSave = () => this.props.onClose(this.state.setSongs)

	render() {
		const { classes, songs, open } = this.props
		const { setSongs } = this.state

		const categoryFilter = filter(() => true)
		const searchFilter = filter(() => true)
		const filteredSongs = flow(
			categoryFilter,
			searchFilter
		)(songs)

		return (
			<Dialog
				onClose={this.handleClose}
				aria-labelledby="song-selector-dialog"
				open={open}
			>
				<DialogTitle id="song-selector-dialog">
					<Paper className={classes.root} elevation={1}>
						<IconButton className={classes.iconButton} aria-label="Back">
							<BackIcon />
						</IconButton>
						<InputBase
							className={classes.input}
							placeholder="Search songs and authors"
						/>
						<IconButton className={classes.iconButton} aria-label="Search">
							<SearchIcon />
						</IconButton>
					</Paper>
				</DialogTitle>
				<DialogContent className={classes.content}>
					<List>
						{map(song => (
							<ListItem
								button
								onClick={this.handleListItemClick(song)}
								key={song.id}
							>
								<Grid container spacing={8} wrap="nowrap">
									<Grid item>
										<Checkbox
											checked={includes(song)(setSongs)}
											onClick={this.handleCheckboxClick(song)}
										/>
									</Grid>
									<Grid item xs>
										<Grid container direction="column">
											<Typography>{song.title}</Typography>
											<Typography color="textSecondary" variant="caption">
												{song.author}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</ListItem>
						))(filteredSongs)}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose}>Close</Button>
					<Button onClick={this.handleSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

const mapStateToProps = state => ({
	songs: reduce((acc, song) => {
		acc.push(song)
		return acc
	})([])(state.songs.byId)
})

export default connect(mapStateToProps)(withStyles(styles)(SongSelectorDialog))
