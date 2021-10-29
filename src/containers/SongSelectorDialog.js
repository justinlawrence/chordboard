import React, { useMemo, useState } from 'react'
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
import noop from 'lodash/noop'
import reduce from 'lodash/fp/reduce'
import toLower from 'lodash/fp/toLower'
import size from 'lodash/size'
import sortBy from 'lodash/fp/sortBy'
import startsWith from 'lodash/fp/startsWith'
import upperCase from 'lodash/fp/upperCase'
import without from 'lodash/without'

import { styled } from '@material-ui/core/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
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

const PREFIX = 'SongSelectorDialog'

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
	sectionLabels: `${PREFIX}-sectionLabels`,
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
	[`& .${classes.root}`]: {
		'& .MuiDialog-scrollPaper': {
			alignItems: 'flex-start',
		},
	},

	[`& .${classes.checkbox}`]: {
		padding: theme.spacing(),
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
	},
}))

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => WrappedComponent => props =>
	<WrappedComponent {...props} width={'xs'} />

const mapWithKey = map.convert({ cap: false })

const SongSelectorDialog = ({ onClose = noop, open, songs = [] }) => {
	const theme = useTheme()
	const isFullscreen = useMediaQuery(theme.breakpoints.down('xs'))
	const [sectionFilter, setSectionFilter] = useState('')
	const [setSongs, setSetSongs] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const [showFilters, setShowFilters] = useState(false)

	const listSize = { height: 500, width: 600 }

	const filteredSongs = useMemo(() => {
		const filterBySearch = filter(song =>
			includes(toLower(searchValue))(
				toLower(song.title) +
					' ' +
					toLower(song.author) +
					' ' +
					toLower(song.content)
			)
		)

		const filterBySection = filter(song =>
			sectionFilter
				? startsWith(toLower(sectionFilter))(toLower(song.title))
				: true
		)

		return flow(filterBySearch, filterBySection, sortBy('title'))(songs)
	}, [searchValue, sectionFilter, songs])

	const getItemSize = index => 50

	const handleClose = () => onClose([])

	const handleCheckboxClick = value => event => {
		event.stopPropagation()
		setSetSongs(prevState =>
			includes(value)(prevState)
				? without(prevState, value)
				: [...prevState, value]
		)
	}

	const handleListItemClick = value => () => onClose([value])

	const handleSave = () => onClose(setSongs)

	const handleSearchChange = event => setSearchValue(event.target.value)

	const handleSectionClick = key => event => {
		if (sectionFilter === key) {
			setSectionFilter('')
		} else {
			setSectionFilter(key)
		}
	}

	const toggleSectionFilter = () => {
		setSectionFilter(prev => (!showFilters ? prev : ''))
		setShowFilters(prev => !prev)
	}

	const renderItem =
		filteredSongs =>
		({ index, style }) => {
			const song = filteredSongs[index]
			return (
				<ListItem
					button
					onClick={handleListItemClick(song)}
					key={song.id}
					style={style}
				>
					<Grid container spacing={1} wrap={'nowrap'}>
						<Grid item>
							<Checkbox
								className={classes.checkbox}
								checked={includes(song)(setSongs)}
								onClick={handleCheckboxClick(song)}
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
			className={classes.scrollPaper}
			onClose={handleClose}
			fullScreen={isFullscreen}
			fullWidth
			open={open}
		>
			<DialogTitle id={'song-selector-dialog'}>
				<Paper className={classes.searchBar} elevation={1}>
					<IconButton
						className={classes.iconButton}
						aria-label={'Back'}
						size={'large'}
					>
						<BackIcon />
					</IconButton>
					<InputBase
						className={classes.input}
						onChange={handleSearchChange}
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
						onClick={toggleSectionFilter}
						size={'large'}
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
										className={cx(classes.sectionButton, {
											[classes.sectionButtonSelected]:
												section.isSelected,
										})}
										onClick={handleSectionClick(
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
					<div>
						<VariableSizeList
							estimatedItemSize={50}
							height={listSize.height}
							itemCount={size(filteredSongs)}
							itemSize={getItemSize}
							width={listSize.width}
						>
							{renderItem(filteredSongs)}
						</VariableSizeList>
					</div>
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Close</Button>
				<Button onClick={handleSave} color={'primary'}>
					Save
				</Button>
			</DialogActions>
		</StyledDialog>
	)
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
