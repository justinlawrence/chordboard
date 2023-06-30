import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import SongViewer from '../components/SongViewer'
import { useSet, useSong, useUser } from '../data/hooks'

const SongContainer = ({ id, currentKey }) => {
	const match = useRouteMatch('/sets/:setId')
	const setId = match ? match.params.setId : null
	const { data: currentSet } = useSet(setId)
	const { data: song } = useSong(id)
	const { data: user } = useUser()

	return song ? (
		<SongViewer
			currentSet={currentSet}
			setKey={currentKey}
			song={song}
			user={user}
		/>
	) : null
}

export default SongContainer
