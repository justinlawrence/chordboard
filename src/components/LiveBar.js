import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import clamp from 'lodash/clamp'
import findIndex from 'lodash/findIndex'
import first from 'lodash/first'
import map from 'lodash/fp/map'
import size from 'lodash/size'
import cx from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tooltip from '@material-ui/core/Tooltip'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {
	ArrowUpDown as ArrowUpDownIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	FormatListBulleted as SetListIcon,
} from 'mdi-material-ui'

import { setCurrentSongId, setFontSize } from '../redux/actions'
import getSongSections from '../utils/getSongSections'
import { makeGetSet } from '../redux/reducers/sets-reducer'

const getSong = (currentSet, currentSong, direction = 'next') => {
	const currentSongId = currentSong
		? currentSong.id
		: first(currentSet.songs).id

	if (currentSet) {
		const index = findIndex(currentSet.songs, { id: currentSongId })
		const clampedIndex = clamp(
			direction === 'next' ? index + 1 : index - 1,
			0,
			size(currentSet.songs) - 1
		)
		const song = currentSet.songs[clampedIndex]
		if (song) {
			return song
		} else {
			console.log(`no ${direction} song`)
		}
	}
}

const useLiveBar = () => {
	const getSet = makeGetSet()
	const dispatch = useDispatch()
	const currentSetId = useSelector(state => state.currentSet.id)
	const currentSong = useSelector(
		state => state.songs.byId[state.currentSong.id]
	)
	const currentSet = useSelector(state =>
		getSet(state, { setId: currentSetId })
	)
	const history = useHistory()

	const handleFontSizeChange = fontSize => dispatch(setFontSize(fontSize))

	const handleGoToNextSong = () => {
		const nextSong = getSong(currentSet, currentSong, 'next')
		dispatch(setCurrentSongId(nextSong.id))
		history.push({
			pathname: `/sets/${currentSetId}/songs/${nextSong.id}`,
		})
	}
	const handleGoToPreviousSong = () => {
		const prevSong = getSong(currentSet, currentSong, 'prev')
		dispatch(setCurrentSongId(prevSong.id))
		history.push({
			pathname: `/sets/${currentSetId}/songs/${prevSong.id}`,
		})
	}

	return {
		currentSetId,
		currentSong,
		goToNextSong: handleGoToNextSong,
		goToPrevSong: handleGoToPreviousSong,
		setFontSize: handleFontSizeChange,
	}
}

const useStyles = makeStyles(
	theme => ({
		root: {
			backgroundColor: theme.palette.background.hero,

			// Live bar has a fixed position so that the scroll can be natural
			// and not break the print view.
			left: 0,
			position: 'fixed',
			right: 0,
			zIndex: 1,

			'@media print': {
				display: 'none !important',
			},
			justifyContent: 'space-between',
		},
		appBar: {
			top: 'auto',
			bottom: 0,
		},
		toolbar: {
			flexWrap: 'nowrap',
		},
		form: theme.mixins.gutters({
			paddingBottom: theme.spacing(2),
			paddingTop: theme.spacing(2),
			width: 500,
		}),
		formFooter: {
			marginTop: theme.spacing(2),
		},
		deleteButton: {
			color: theme.palette.error.main,
		},
		toolbarActions: {
			display: 'flex',
			flexWrap: 'nowrap',
		},
		toolbarSections: {
			// alignItems: 'center',
			display: 'flex',
			flexGrow: 1,
			minWidth: 0,
			overflow: 'hidden',
		},
		section: {
			backgroundColor: '#eee',
			border: 2,
			color: theme.palette.common.white,
			minWidth: theme.spacing(3),
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(2),
			position: 'relative',
		},
	}),
	{ name: 'LiveBar' }
)

const LiveBar = () => {
	const {
		currentSetId,
		currentSong,
		goToNextSong,
		goToPrevSong,
		setFontSize,
	} = useLiveBar()
	const [anchorEl, setAnchorEl] = useState(null)
	const [isVisible, setIsVisible] = useState(false)
	const match = useRouteMatch({
		path: [
			//'/songs/:id',
			'/sets/:setId/songs/:songsId',
		],
	})
	const classes = useStyles()

	useEffect(() => {
		setIsVisible(Boolean(match))
	}, [match])

	const handleFontSizeChange = event => setAnchorEl(event.currentTarget)
	const handleFontSizeSelect = fontSize => () => {
		setFontSize(fontSize)
		handleMenuClose()
	}

	const handleMenuClose = () => setAnchorEl(null)

	const fontSizes = [
		{ size: 'small', label: 'Small' },
		{ size: 'medium', label: 'Medium' },
		{ size: 'large', label: 'Large' },
	]

	const sections = getSongSections(currentSong)

	return isVisible ? (
		<AppBar
			position={'fixed'}
			color={'primary'}
			className={cx(classes.appBar, classes.root)}
		>
			<Toolbar variant={'dense'} className={classes.toolbar}>
				<div className={classes.toolbarSections}>
					<Tooltip title={'Back to setlist'}>
						<IconButton
							className={classes.button}
							component={Link}
							to={`/sets/${currentSetId}`}
						>
							<SetListIcon />
						</IconButton>
					</Tooltip>

					{map(section => (
						<ButtonBase
							component={'a'}
							key={`section-${section.index}`}
							href={`#section-${section.index}`}
							className={classes.section}
							title={`Jump to ${section.title}`}
							style={{ backgroundColor: section.color }}
						>
							<Typography
								className={classes.sectionText}
								color={'inherit'}
							>
								{section.abbreviation}
							</Typography>
						</ButtonBase>
					))(sections)}
				</div>

				<div className={classes.toolbarActions}>
					<Tooltip title={'Set font size'}>
						<IconButton
							className={classes.button}
							onClick={handleFontSizeChange}
						>
							<ArrowUpDownIcon />
						</IconButton>
					</Tooltip>

					<Tooltip title={'Jump to previous song'}>
						<IconButton
							className={classes.button}
							onClick={goToPrevSong}
						>
							<ChevronLeftIcon />
						</IconButton>
					</Tooltip>

					<Tooltip title={'Jump to next song'}>
						<IconButton
							className={classes.button}
							onClick={goToNextSong}
						>
							<ChevronRightIcon />
						</IconButton>
					</Tooltip>
				</div>

				<Menu
					anchorEl={anchorEl}
					onClose={handleMenuClose}
					open={Boolean(anchorEl)}
				>
					{map(fontSize => (
						<MenuItem
							key={fontSize.size}
							onClick={handleFontSizeSelect(fontSize.size)}
						>
							{fontSize.label}
						</MenuItem>
					))(fontSizes)}
				</Menu>
			</Toolbar>
		</AppBar>
	) : null
}

export default LiveBar
