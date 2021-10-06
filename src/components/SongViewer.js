import React, { useEffect, useMemo, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import find from 'lodash/find'

import { styled } from '@mui/material/styles'
import {
	Box,
	Container,
	Fade,
	GlobalStyles,
	Grid,
	Tooltip,
	Typography,
} from '@mui/material'

import { setCurrentSetSongKey, setCurrentSongUserKey } from '../redux/actions'
import SongViewerMenu from './SongViewerMenu'
import ContentLimiter from './ContentLimiter'
import getKeyDiff from '../utils/getKeyDiff'
import Hero from './Hero'
import KeySelector from './KeySelector'
import Parser from '../parsers/song-parser'
import Song from './Song'
import transposeLines from '../utils/transpose-lines'
import { linesToNashville } from '../utils/convertToNashville'

export const chordSizeAtom = atom(16)
export const isNashvilleAtom = atom(false)
export const wordSizeAtom = atom(20)

const printMediaStyles = (
	<GlobalStyles
		styles={{
			body: {
				'@media print': {
					backgroundColor: 'white',
				},
			},
			'.MuiTypography-root': {
				'@media print': {
					color: 'rgba(0, 0, 0, 0.87)',
				},
			},
		}}
	/>
)

const PREFIX = 'SongViewer'

const classes = {
	root: `${PREFIX}-root`,
	capoButton: `${PREFIX}-capoButton`,
	closeButton: `${PREFIX}-closeButton`,
	paper: `${PREFIX}-paper`,
	songMenu: `${PREFIX}-songMenu`,
	control: `${PREFIX}-control`,
	select: `${PREFIX}-select`,
	noPrint: `${PREFIX}-noPrint`,
}

const StyledFade = styled(Fade)(({ theme }) => ({
	[`& .${classes.root}`]: {
		flexGrow: 1,
	},

	[`& .${classes.capoButton}`]: {
		borderRadius: 3,
		flexDirection: 'column',
		padding: theme.spacing(),
	},

	[`& .${classes.closeButton}`]: {
		position: 'absolute',
		right: theme.spacing(),
		top: theme.spacing(),
	},

	[`& .${classes.paper}`]: {
		padding: theme.spacing(2),
		height: '100%',
		color: theme.palette.text.secondary,
	},
	[`& .${classes.noPrint}`]: {
		'@media print': {
			display: 'none !important',
		},
	},
}))

const SongViewer = ({ isPreview, setKey, song = {}, user }) => {
	const dispatch = useDispatch()
	const [chordSize] = useAtom(chordSizeAtom)
	const [isNashville, setIsNashville] = useAtom(isNashvilleAtom)
	const [wordSize] = useAtom(wordSizeAtom)
	const [displayKey, setDisplayKey] = useState('')
	const [lines, setLines] = useState([])

	const songId = song?.id
	const userId = user?.id
	const capo = getKeyDiff(displayKey, setKey || song.key) //this is only for display purposes, telling the user where to put the capo
	const capoKey = useMemo(
		() => localStorage.getItem(`chordboard.${songId}.capoKey`),
		[songId]
	)
	const capoKeyDescr = capo ? `Capo ${capo}` : 'Capo key'
	const transposeAmount = getKeyDiff(song.key, displayKey) //this is how much to transpose by

	useEffect(() => {
		const songUser = find(song.users, { id: userId }) || {}
		const displayKey = capoKey || songUser.key || setKey || song.key

		const parser = new Parser()
		const lines = transposeLines(
			parser.parse(song.content),
			transposeAmount
		)
		setDisplayKey(displayKey)
		setLines(isNashville ? linesToNashville(displayKey, lines) : lines)
	}, [
		capoKey,
		isNashville,
		setKey,
		song.content,
		song.key,
		song.users,
		transposeAmount,
		userId,
	])

	const handleSelectSetKey = option => {
		dispatch(
			setCurrentSetSongKey({
				key: option.key,
				song,
			})
		)

		console.log(option.key, displayKey)

		if (displayKey === option.key && song.id) {
			localStorage.removeItem(`chordboard.${song.id}.capoKey`)
		}
	}

	const handleSelectDisplayKey = option => {
		const key = option.key === setKey ? null : option.key

		setDisplayKey(key)
		setIsNashville(option.value === 'nashville')

		if (song.id) {
			if (setKey === option.key) {
				localStorage.removeItem(`chordboard.${song.id}.capoKey`)
			} else {
				localStorage.setItem(`chordboard.${song.id}.capoKey`, key)
			}
		}
		dispatch(setCurrentSongUserKey(key))
	}

	/* 
	// TODO: use this functionality with the live bar
	const scrollToSection = section => {
		let totalVertPadding = 32
		let headerHeight = 92

		window.location.href = '#'
		window.location.href = '#section-' + section.index

		let scrollBottom =
			window.innerHeight - document.body.scrollTop + totalVertPadding

		if (headerHeight < scrollBottom) {
			// Go back 92 pixels to offset the header.
			window.scrollBy(0, -headerHeight)
		}
	} */

	/*	
	const changeKey = key => {
		if (key) {
			setDisplayKey(key)
			dispatch(setCurrentSongUserKey(key))
		}
	}

	const transposeDown = () => changeKey(transposeChord(displayKey, -1))

	const transposeUp = () => changeKey(transposeChord(displayKey, 1)) */

	return (
		<StyledFade in={Boolean(song)} appear mountOnEnter unmountOnExit>
			<Box>
				{printMediaStyles}
				<Helmet>
					<title>{song.title}</title>
				</Helmet>
				<Hero>
					<Container>
						<ContentLimiter>
							<Grid
								container
								className={classes.root}
								justifyContent={'space-between'}
							>
								<Grid item xs={12} sm={7}>
									<Typography
										variant={'h4'}
										sx={{
											fontWeight: theme =>
												theme.typography.fontWeightBold,
										}}
									>
										{song.title}
									</Typography>
									<Typography variant={'subtitle1'}>
										{song.author}
									</Typography>
								</Grid>
								{!isPreview && (
									<Grid
										item
										xs={12}
										sm={5}
										className={classes.noPrint}
									>
										<form autoComplete={'off'}>
											{setKey && (
												<Tooltip
													title={
														'The key everyone will be playing in'
													}
												>
													<KeySelector
														label={'Set key'}
														onSelect={
															handleSelectSetKey
														}
														songKey={setKey}
													/>
												</Tooltip>
											)}

											<Tooltip
												title={
													'The key you will be playing in'
												}
											>
												<KeySelector
													label={capoKeyDescr}
													onSelect={
														handleSelectDisplayKey
													}
													songKey={
														displayKey || setKey
													}
													className={classes.select}
												/>
											</Tooltip>

											<SongViewerMenu
												isPreview={isPreview}
												song={song}
											/>

											{/* 
												<Tooltip title={'Edit song'}>
													<IconButton
														className={
															classes.button
														}
														href={`/songs/${song.id}/edit`}
														size={'large'}
													>
														<PencilIcon />
													</IconButton>
												</Tooltip> */}

											{/* 
												<Tooltip
													title={'Song settings'}
												>
													<IconButton
														className={
															classes.button
														}
														onClick={
															handleSongKeyDialogOpen
														}
														size={'large'}
													>
														<SettingsIcon />
													</IconButton>
												</Tooltip> */}
										</form>
									</Grid>
								)}
							</Grid>
						</ContentLimiter>
					</Container>
				</Hero>
				<Container className={'song-viewer'}>
					<ContentLimiter>
						<section className={'section'}>
							<Container maxWidth={'xl'}>
								<Typography component={'div'}>
									<Song
										chordSize={chordSize}
										lines={lines}
										wordSize={wordSize}
									/>
								</Typography>
							</Container>
						</section>
					</ContentLimiter>
				</Container>
				<Box
					sx={{
						displayPrint: 'none',
						height: theme => theme.spacing(12),
					}}
				/>
			</Box>
		</StyledFade>
	)
}

export default SongViewer
