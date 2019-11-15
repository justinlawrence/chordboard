import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { VariableSizeList } from 'react-window'
import cx from 'classnames'
import filter from 'lodash/fp/filter'
import first from 'lodash/fp/first'
import flow from 'lodash/fp/flow'
import groupBy from 'lodash/fp/groupBy'
import includes from 'lodash/fp/includes'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import toLower from 'lodash/fp/toLower'
import size from 'lodash/fp/size'
import sortBy from 'lodash/fp/sortBy'
import startsWith from 'lodash/fp/startsWith'
import upperCase from 'lodash/fp/upperCase'

import { withStyles } from '@material-ui/styles'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import Button from '@material-ui/core/Button'
import ButtonBase from '@material-ui/core/ButtonBase'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
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
import {
	Alphabetical as AlphabeticalIcon,
	ArrowLeft as BackIcon,
	Magnify as SearchIcon,
} from 'mdi-material-ui'

const mapWithKey = map.convert({ cap: false })

const styles = theme => ({
	root: {},
	checkbox: {
		padding: theme.spacing(),
	},
	scrollPaper: {
		alignItems: 'flex-start',
	},
	input: {
		marginLeft: theme.spacing(),
		flex: 1,
	},
	iconButton: {
		padding: theme.spacing(),
	},
	content: {
		flexGrow: 1,
		paddingLeft: 0,
		paddingRight: 0,
	},
	searchBar: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	sectionButton: {
		alignItems: 'center',
		borderRadius: theme.shape.borderRadius,
		display: 'flex',
		height: theme.spacing(4),
		justifyContent: 'center',
		transition: theme.transitions.create(),
		width: theme.spacing(4),
	},
	sectionButtonSelected: {
		backgroundColor: theme.palette.action.selected,
	},
	sectionLabels: {
		marginTop: theme.spacing(),
	},
})

class SongSelectorDialog extends PureComponent {
	static defaultProps = {
		songs: [],
	}

	static propTypes = {
		classes: PropTypes.object,
		onClose: PropTypes.func.isRequired,
		open: PropTypes.bool.isRequired,
		width: PropTypes.string,
		// Redux props
		songs: PropTypes.array,
	}

	state = {
		sectionFilter: '',
		setSongs: [],
		searchValue: '',
		showFilters: false,
	}

	listRef = null

	get listSize() {
		// TODO: Figure out how to get the correct dimensions
		return { height: 500, width: 600 }
	}

	get filteredSongs() {
		const searchFilter = filter(song =>
			includes(toLower(this.state.searchValue))(
				toLower(song.title) +
					' ' +
					toLower(song.author) +
					' ' +
					toLower(song.content)
			)
		)

		const sectionFilter = filter(song =>
			this.state.sectionFilter
				? startsWith(toLower(this.state.sectionFilter))(
						toLower(song.title)
				  )
				: true
		)

		return flow(
			searchFilter,
			sectionFilter,
			sortBy('title')
		)(this.props.songs)
	}

	getItemSize = index => 50

	handleClose = () => this.props.onClose([])

	handleCheckboxClick = value => event => {
		event.stopPropagation()
		this.setState(prevState => ({
			setSongs: [...prevState.setSongs, value],
		}))
	}

	handleListItemClick = value => () => this.props.onClose([value])

	handleSave = () => this.props.onClose(this.state.setSongs)

	handleSearchChange = event =>
		this.setState({ searchValue: event.target.value })

	handleSectionClick = key => event => {
		if (this.state.sectionFilter === key) {
			this.setState({ sectionFilter: '' })
		} else {
			this.setState({ sectionFilter: key })
		}
	}

	toggleSectionFilter = () =>
		this.setState(prevState => ({
			sectionFilter: !prevState.showFilters
				? prevState.sectionFilter
				: '',
			showFilters: !prevState.showFilters,
		}))

	setListRef = node => (this.listRef = node)

	renderItem = filteredSongs => ({ index, style }) => {
		const { classes } = this.props
		const { setSongs } = this.state
		const song = filteredSongs[index]
		return (
			<ListItem
				button
				onClick={this.handleListItemClick(song)}
				key={song.id}
				style={style}
			>
				<Grid container spacing={1} wrap="nowrap">
					<Grid item>
						<Checkbox
							className={classes.checkbox}
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
		)
	}

	render() {
		const { classes, open, songs } = this.props
		const { searchValue, sectionFilter, showFilters } = this.state

		const firstLetter = song => upperCase(first(song.title))
		const sections = flow(
			groupBy(firstLetter),
			mapWithKey((songs, key) => ({
				key,
				isSelected: sectionFilter === key,
			})),
			sortBy('key')
		)(songs)

		return (
			<Dialog
				aria-labelledby="song-selector-dialog"
				classes={{
					scrollPaper: classes.scrollPaper,
				}}
				onClose={this.handleClose}
				fullScreen={!isWidthUp('sm', this.props.width)}
				fullWidth
				open={open}
			>
				<DialogTitle id="song-selector-dialog">
					<Paper className={classes.searchBar} elevation={1}>
						<IconButton
							className={classes.iconButton}
							aria-label="Back"
						>
							<BackIcon />
						</IconButton>
						<InputBase
							className={classes.input}
							onChange={this.handleSearchChange}
							placeholder="Search titles, authors & words"
							value={searchValue}
						/>
						{/*<IconButton
							className={classes.iconButton}
							aria-label="Search"
						>
							<SearchIcon />
						</IconButton>*/}
						<IconButton
							className={classes.iconButton}
							onClick={this.toggleSectionFilter}
						>
							<AlphabeticalIcon />
						</IconButton>
					</Paper>

					<Collapse in={showFilters}>
						<div className={classes.sectionLabels}>
							<Grid container spacing={1}>
								{map(section => (
									<Grid item key={section.key}>
										<ButtonBase
											className={cx(
												classes.sectionButton,
												{
													[classes.sectionButtonSelected]:
														section.isSelected,
												}
											)}
											onClick={this.handleSectionClick(
												section.key
											)}
										>
											<Typography variant="subtitle1">
												{section.key}
											</Typography>
										</ButtonBase>
									</Grid>
								))(sections)}
							</Grid>
						</div>
					</Collapse>
				</DialogTitle>
				<DialogContent className={classes.content}>
					<List>
						<div ref={this.setListRef}>
							<VariableSizeList
								estimatedItemSize={50}
								height={this.listSize.height}
								itemCount={size(this.filteredSongs)}
								itemSize={this.getItemSize}
								width={this.listSize.width}
							>
								{this.renderItem(this.filteredSongs)}
							</VariableSizeList>
						</div>
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
	})([])(state.songs.byId),
})

export default compose(
	connect(mapStateToProps),
	withStyles(styles),
	withWidth()
)(SongSelectorDialog)
