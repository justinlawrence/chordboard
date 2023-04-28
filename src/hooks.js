import { useRouteMatch } from 'react-router-dom'

import { useSet } from './data/hooks'

export const useSetToolbar = () => {
	const match = useRouteMatch({
		path: ['/sets/:setId/songs/:songId', '/sets/:setId'],
	})
	const { data: currentSet, isLoading } = useSet(
		match ? match.params.setId : null
	)

	const songId = match ? match.params.songId : null

	return { currentSet, songId, isLoading }
}
