import React from 'react'
import { find, findIndex } from 'lodash'
import { Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useSet } from '../data/hooks'
import { setCurrentSetId, updateSet, removeSet } from '../redux/actions'
import SongContainer from './SongContainer'
import SetViewer from '../components/SetViewer'
import transposeChord from '../utils/transpose-chord'

const SetContainer = ({ setId }) => {
	const dispatch = useDispatch()
	const { data: currentSet, isLoading } = useSet(setId)
	const history = useHistory()

	const handleChangeKey = (songId, amount, songKey) => {
		const set = { ...currentSet }

		const setSongs = set.songs.slice()
		const setSong = find(setSongs, { id: songId })

		if (setSong) {
			setSong.key = transposeChord(setSong.key || songKey, amount)

			set.songs = setSongs

			if (set) {
				dispatch(setCurrentSetId(set.id))
				dispatch(updateSet(set))
			}
		}
	}

	const handleSongMove = (songId, targetIndex = 0) => {
		const set = { ...currentSet }
		const setSongs = set.songs.slice()
		const index = findIndex(setSongs, { id: songId })
		const song = setSongs[index]
		const newIndex = Math.max(Math.min(targetIndex, setSongs.length), 0)

		setSongs.splice(index, 1)
		setSongs.splice(newIndex, 0, song)

		set.songs = setSongs

		if (set) {
			dispatch(setCurrentSetId(set.id))
			dispatch(updateSet(set))
		}
	}

	const handleRemoveSong = args => {
		console.log('handleRemoveSong', { args })
	}

	const handleRemoveSet = () => {
		if (window.confirm('Are you very sure you want to delete this set?')) {
			const set = currentSet

			dispatch(removeSet(set.id))
			if (history) {
				const location = {
					pathname: '/sets',
				}

				history.replace(location)
			}
		}
	}

	if (isLoading) {
		return null //<div>Loading...</div>
	}

	return currentSet ? (
		<div>
			<Route
				exact
				path={'/sets/:setId'}
				render={props => (
					<SetViewer
						onChangeKey={handleChangeKey}
						onSongMove={handleSongMove}
						onRemoveSet={handleRemoveSet}
						onRemoveSong={handleRemoveSong}
						setId={currentSet.id}
						{...props}
					/>
				)}
			/>
			<Route
				exact
				path={'/sets/:setId/songs/:songId'}
				render={({ match }) => {
					const songId = match.params.songId

					const index = findIndex(currentSet.songs, {
						id: songId,
					})
					const currentKey =
						currentSet && currentSet.songs[index]
							? currentSet.songs[index].key
							: null

					//TODO: catch errors where the set song key is empty

					return (
						<div>
							<SongContainer
								currentKey={currentKey}
								id={songId}
							/>
						</div>
					)
				}}
			/>
		</div>
	) : null
}

export default SetContainer
