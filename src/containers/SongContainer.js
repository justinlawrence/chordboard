import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import SongViewer from '../components/SongViewer'
import { useSet, useSong, useUser } from '../data/hooks'

const SongContainer = ({ id, currentKey }) => {
	const history = useHistory()
	const match = useRouteMatch('/sets/:setId')
	const setId = match ? match.params.setId : null
	const { data: currentSet } = useSet(setId)
	const { data: song, isLoading } = useSong(id)
	const { data: user } = useUser()

	useEffect(() => {
		if (!song && !isLoading) {
			if (match) {
				history.push(match.url)
			} else {
				history.push('/songs')
			}
		}
	}, [history, isLoading, song, match])

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
