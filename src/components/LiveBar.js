import React, { useEffect, useState } from 'react'
import { styled } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import clamp from 'lodash/clamp'
import findIndex from 'lodash/findIndex'
import first from 'lodash/first'
import map from 'lodash/fp/map'
import size from 'lodash/size'
import cx from 'classnames'

import {
	ButtonBase,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from '@mui/material'
import {
	ArrowUpDown as ArrowUpDownIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	FormatFontSizeIncrease as FormatFontSizeIncreaseIcon,
} from 'mdi-material-ui'

import { setCurrentSongId, setFontSize } from '../redux/actions'
import getSongSections from '../utils/getSongSections'
import { makeGetSet } from '../redux/reducers/sets-reducer'

const PREFIX = 'LiveBar'

const classes = {
	root: `${PREFIX}-root`,
	appBar: `${PREFIX}-appBar`,
	toolbar: `${PREFIX}-toolbar`,
	form: `${PREFIX}-form`,
	formFooter: `${PREFIX}-formFooter`,
	deleteButton: `${PREFIX}-deleteButton`,
	toolbarActions: `${PREFIX}-toolbarActions`,
	toolbarSections: `${PREFIX}-toolbarSections`,
	section: `${PREFIX}-section`,
}

const StyledAppBar = styled('div')(({ theme }) => ({
	[`&.${classes.root}`]: {
		backgroundColor: theme.palette.background.hero,

		// Live bar has a fixed position so that the scroll can be natural
		// and not break the print view.
		//left: 0,
		position: 'fixed',
		right: 0,
		top: '50%',
		transform: 'translateY(-50%)',
		zIndex: 1,

		'@media print': {
			display: 'none !important',
		},
		justifyContent: 'space-between',
	},

	[`& .${classes.form}`]: theme.mixins.gutters({
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
		width: 500,
	}),

	[`& .${classes.formFooter}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.deleteButton}`]: {
		color: theme.palette.error.main,
	},

	[`& .${classes.toolbarActions}`]: {
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
	},

	[`& .${classes.toolbarSections}`]: {
		borderRadius: theme.spacing(1, 0, 0, 1),
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		minWidth: 0,
		overflow: 'hidden',
	},

	[`& .${classes.section}`]: {
		backgroundColor: '#eee',
		border: 2,
		color: theme.palette.common.white,
		height: theme.spacing(5),
		paddingLeft: theme.spacing(),
		paddingRight: theme.spacing(),
		position: 'relative',
	},
}))

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
		<StyledAppBar
			position={'fixed'}
			color={'primary'}
			className={cx(classes.appBar, classes.root)}
		>
			<div className={classes.toolbarSections}>
				{map(section => (
					<ButtonBase
						component={'a'}
						key={`section-${section.index}`}
						href={`#section-${section.index}`}
						className={classes.section}
						title={`Jump to ${section.title}`}
						style={{ backgroundColor: section.color }}
					>
						<Typography color={'inherit'} variant={'button'}>
							{section.abbreviation}
						</Typography>
					</ButtonBase>
				))(sections)}
			</div>
			{/* 
			<div className={classes.toolbarActions}>
				<Tooltip title={'Set font size'}>
					<IconButton
						className={classes.button}
						onClick={handleFontSizeChange}
						size={'large'}
					>
						<FormatFontSizeIncreaseIcon />
					</IconButton>
				</Tooltip>
				
				<Tooltip title={'Jump to previous song'}>
					<IconButton
						className={classes.button}
						onClick={goToPrevSong}
						size={'large'}
					>
						<ChevronLeftIcon />
					</IconButton>
				</Tooltip>

				<Tooltip title={'Jump to next song'}>
					<IconButton
						className={classes.button}
						onClick={goToNextSong}
						size={'large'}
					>
						<ChevronRightIcon />
					</IconButton>
				</Tooltip>
			</div> */}

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
		</StyledAppBar>
	) : null
}

export default LiveBar
