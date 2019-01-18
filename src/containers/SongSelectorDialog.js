import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import flow from 'lodash/fp/flow'
import reduce from 'lodash/fp/reduce'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
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
		// Redux props
		songs: PropTypes.array
	}

	handleClose = () => this.props.onClose()
	handleListItemClick = value => this.props.onClose(value)

	render() {
		const { classes, songs, ...other } = this.props

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
				{...other}
			>
				<DialogTitle id="song-selector-dialog">Add a song</DialogTitle>
				<DialogContent className={classes.content}>
					<List>
						{map(song => (
							<ListItem
								button
								onClick={() => this.handleListItemClick(song)}
								key={song.id}
							>
								<Grid container spacing={8} wrap="nowrap">
									<Grid item>
										<Checkbox />
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
					<Button onClick={this.handleClose} color="primary">
						Close
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
