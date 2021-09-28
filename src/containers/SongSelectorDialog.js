import React, { PureComponent } from 'react'
import { styled } from '@material-ui/core/styles';
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

import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import {
	Alphabetical as AlphabeticalIcon,
	ArrowLeft as BackIcon,
} from 'mdi-material-ui'

const PREFIX = 'SongSelectorDialog';

const classes = {
    root: `${PREFIX}-root`,
    checkbox: `${PREFIX}-checkbox`,
    scrollPaper: `${PREFIX}-scrollPaper`,
    input: `${PREFIX}-input`,
    iconButton: `${PREFIX}-iconButton`,
    content: `${PREFIX}-content`,
    searchBar: `${PREFIX}-searchBar`,
    sectionButton: `${PREFIX}-sectionButton`,
    sectionButtonSelected: `${PREFIX}-sectionButtonSelected`,
    sectionLabels: `${PREFIX}-sectionLabels`
};

const StyledDialog = styled(Dialog)((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {},

    [`& .${classes.checkbox}`]: {
		padding: theme.spacing(),
	},

    [`& .${classes.scrollPaper}`]: {
		alignItems: 'flex-start',
	},

    [`& .${classes.input}`]: {
		marginLeft: theme.spacing(),
		flex: 1,
	},

    [`& .${classes.iconButton}`]: {
		padding: theme.spacing(),
	},

    [`& .${classes.content}`]: {
		flexGrow: 1,
		paddingLeft: 0,
		paddingRight: 0,
	},

    [`& .${classes.searchBar}`]: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},

    [`& .${classes.sectionButton}`]: {
		alignItems: 'center',
		borderRadius: theme.shape.borderRadius,
		display: 'flex',
		height: theme.spacing(4),
		justifyContent: 'center',
		transition: theme.transitions.create(),
		width: theme.spacing(4),
	},

    [`& .${classes.sectionButtonSelected}`]: {
		backgroundColor: theme.palette.action.selected,
	},

    [`& .${classes.sectionLabels}`]: {
		marginTop: theme.spacing(),
	}
}));

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />;

const mapWithKey = map.convert({ cap: false })

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
		const { } = this.props
		const { setSongs } = this.state
		const song = filteredSongs[index]
		return (
			<ListItem
				button
				onClick={this.handleListItemClick(song)}
				key={song.id}
				style={style}
			>
				<Grid container spacing={1} wrap={'nowrap'}>
					<Grid item>
						<Checkbox
							className={classes.checkbox}
							checked={includes(song)(setSongs)}
							onClick={this.handleCheckboxClick(song)}
						/>
					</Grid>
					<Grid item xs>
						<Grid container direction={'column'}>
							<Typography>{song.title}</Typography>
							<Typography
								color={'textSecondary'}
								variant={'caption'}
							>
								{song.author}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</ListItem>
		)
	}

	render() {
		const {  open, songs } = this.props
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
            <StyledDialog
				aria-labelledby={'song-selector-dialog'}
				classes={{
					scrollPaper: classes.scrollPaper,
				}}
				onClose={this.handleClose}
				fullScreen={!isWidthUp('sm', this.props.width)}
				fullWidth
				open={open}
			>
				<DialogTitle id={'song-selector-dialog'}>
					<Paper className={classes.searchBar} elevation={1}>
						<IconButton className={classes.iconButton} aria-label={'Back'} size="large">
							<BackIcon />
						</IconButton>
						<InputBase
							className={classes.input}
							onChange={this.handleSearchChange}
							placeholder={'Search titles, authors & words'}
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
                            size="large">
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
											<Typography variant={'subtitle1'}>
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
					<Button onClick={this.handleSave} color={'primary'}>
						Save
					</Button>
				</DialogActions>
			</StyledDialog>
        );
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
	
	withWidth()
)(SongSelectorDialog)
