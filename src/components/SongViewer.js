import React, { useEffect, useState } from 'react'
import { atom, useAtom, useSetAtom } from 'jotai'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'
import omit from 'lodash/omit'
import set from 'lodash/set'

import { styled } from '@mui/material/styles'
import { Box, Container, GlobalStyles, Grid, Typography } from '@mui/material'

import { currentSetSongKeyAtom } from '../sets'
import { currentSongUserKeyAtom } from '../songs'
import SongViewerMenu from './SongViewerMenu'
import ContentLimiter from './ContentLimiter'
import getKeyDiff from '../utils/getKeyDiff'
import Hero from './Hero'
import KeySelector from './KeySelector'
import Parser from '../parsers/song-parser'
import Song from './Song'
import transposeLines from '../utils/transpose-lines'
import { linesToNashville } from '../utils/convertToNashville'
import { loadLocalStorage, saveLocalStorage } from '../utils/localStorage'

export const chordSizeAtom = atom(16)
export const isNashvilleAtom = atom(false)
export const wordSizeAtom = atom(20)

const STORAGE_KEY = 'chordboard.capoKey'

const loadCapoKey = (setId, songId) => {
	const data = loadLocalStorage(STORAGE_KEY)
	return get(data, [setId, songId])
}

const removeCapoKey = (setId, songId) => {
	const prevData = loadLocalStorage(STORAGE_KEY) || {}
	const nextData = omit(prevData, [[setId, songId]])
	saveLocalStorage(STORAGE_KEY, nextData)
}

const saveCapoKey = (setId, songId, capoKey) => {
	const prevData = loadLocalStorage(STORAGE_KEY) || {}
	const nextData = set(prevData, [setId, songId], capoKey)
	saveLocalStorage(STORAGE_KEY, nextData)
}

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

const StyledContainer = styled('div', { name: PREFIX })(({ theme }) => ({
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

const SongViewer = ({
	className,
	currentSet,
	isPreview,
	setKey,
	song = {},
}) => {
	const [chordSize] = useAtom(chordSizeAtom)
	const [isNashville, setIsNashville] = useAtom(isNashvilleAtom)
	const [wordSize] = useAtom(wordSizeAtom)
	const [capoKey, setCapoKey] = useState(setKey)
	const [lines, setLines] = useState([])
	const setCurrentSongUserKey = useSetAtom(currentSongUserKeyAtom)
	const setCurrentSetSongKey = useSetAtom(currentSetSongKeyAtom)

	const setId = currentSet?.id
	const songId = song?.id
	const capoDiff = getKeyDiff(capoKey, setKey || song.key) //this is only for display purposes, telling the user where to put the capo
	const capoKeyDescr = capoDiff ? `Capo ${capoDiff}` : 'Capo key'
	const transposeAmount = getKeyDiff(song.key, capoKey) //this is how much to transpose by

	useEffect(() => {
		const savedCapoKey = loadCapoKey(setId, songId)
		setCapoKey(savedCapoKey ? savedCapoKey : setKey)
	}, [setId, setKey, songId])

	useEffect(() => {
		const parser = new Parser()
		const lines = transposeLines(
			parser.parse(song.content),
			transposeAmount
		)
		setLines(isNashville ? linesToNashville(capoKey, lines) : lines)
	}, [capoKey, isNashville, song.content, transposeAmount])

	const handleSelectSetKey = option => {
		setCurrentSetSongKey({ key: option.key, song })

		if (capoKey === option.key && song.id) {
			removeCapoKey(setId, song.id)
		}
	}

	const handleSelectCapoKey = option => {
		const key = option.key === setKey ? null : option.key

		setCapoKey(key)
		setIsNashville(option.value === 'nashville')

		if (songId) {
			if (setKey === option.key) {
				removeCapoKey(setId, songId)
			} else {
				saveCapoKey(setId, songId, key)
			}
		}
		setCurrentSongUserKey(key)
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
			setCurrentSongUserKey(key)
		}
	}

	const transposeDown = () => changeKey(transposeChord(displayKey, -1))

	const transposeUp = () => changeKey(transposeChord(displayKey, 1)) */

	return song ? (
		<StyledContainer>
			<div className={className}>
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
												<KeySelector
													label={'Set Key'}
													onSelect={
														handleSelectSetKey
													}
													songKey={setKey}
												/>
											)}

											<KeySelector
												label={capoKeyDescr}
												onSelect={handleSelectCapoKey}
												songKey={capoKey}
											/>

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
			</div>
		</StyledContainer>
	) : null
}

export default SongViewer
