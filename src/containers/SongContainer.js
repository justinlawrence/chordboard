import React from 'react'
import { useRouteMatch } from 'react-router-dom'

import SongViewer from '../components/SongViewer'
import { useSet, useSong, useUser } from '../data/hooks'

const SongContainer = ({ id, currentKey }) => {
	const setId = useRouteMatch('/sets/:setId').params.setId
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
