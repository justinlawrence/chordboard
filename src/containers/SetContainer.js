import React from 'react'
import { find, findIndex } from 'lodash'
import { Route, useHistory } from 'react-router-dom'

import { useDeleteSet, useSet, useUpdateSet } from '../data/hooks'
import SongContainer from './SongContainer'
import SetViewer from '../components/SetViewer'
import transposeChord from '../utils/transpose-chord'

const SetContainer = ({ setId }) => {
	const { data: currentSet, isLoading } = useSet(setId)
	const { updateSet } = useUpdateSet()
	const { deleteSet } = useDeleteSet()
	const history = useHistory()

	const handleChangeKey = (songId, amount, songKey) => {
		const set = { ...currentSet }

		const setSongs = set.songs.slice()
		const setSong = find(setSongs, { id: songId })

		if (setSong) {
			setSong.key = transposeChord(setSong.key || songKey, amount)

			set.songs = setSongs

			if (set) {
				history.push(`/sets/${set.id}`)
				updateSet(set.id, set)
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
			history.push(`/sets/${set.id}`)
			updateSet(set.id, set)
		}
	}

	const handleRemoveSong = args => {
		console.log('handleRemoveSong', { args })
	}

	const handleRemoveSet = () => {
		if (window.confirm('Are you very sure you want to delete this set?')) {
			const set = currentSet

			deleteSet(set.id)
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
						currentSet={currentSet}
						onChangeKey={handleChangeKey}
						onSongMove={handleSongMove}
						onRemoveSet={handleRemoveSet}
						onRemoveSong={handleRemoveSong}
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
