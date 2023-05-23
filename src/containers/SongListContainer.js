import React from 'react'

import SongList from '../components/SongList'

import { useAllSongs } from '../data/hooks'

const SongListContainer = () => {
	const songs = useAllSongs()
	return <SongList songs={songs} />
}

export default SongListContainer
