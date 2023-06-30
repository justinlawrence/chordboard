import { useEffect, useMemo, useState } from 'react'
import { firestore } from '../firebase'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore'
import slugify from 'slugify'
import { isEqual } from 'lodash'

const songsCollection = collection(firestore, 'songs')

export const useAddSong = () => {
	const [isLoading, setIsLoading] = useState(false)

	const addSong = async data => {
		const newSong = {
			...data,
			slug: slugify(data.title),
		}

		setIsLoading(true)
		const docRef = await addDoc(songsCollection, newSong)
		setIsLoading(false)

		const songDoc = await getDoc(docRef)
		return {
			id: songDoc.id,
			...songDoc.data(),
		}
	}

	return {
		addSong,
		isLoading,
	}
}

export const useDeleteSong = () => {
	const [isLoading, setIsLoading] = useState(false)

	const deleteSong = async songId => {
		setIsLoading(true)
		await deleteDoc(doc(songsCollection, songId))
		setIsLoading(false)
	}

	return {
		deleteSong,
		isLoading,
	}
}

export const useSong = songId => {
	const [isLoading, setIsLoading] = useState(true)
	const [song, setSong] = useState(null)

	useEffect(() => {
		if (!songId) {
			setSong(null)
			return
		}
		return onSnapshot(doc(firestore, 'songs', songId), doc => {
			if (doc.exists()) {
				setSong({ id: doc.id, ...doc.data() })
			} else {
				// doc.data() will be undefined in this case
				setSong(null)
			}
			setIsLoading(false)
		})
	}, [songId])

	return useMemo(() => ({ data: song, isLoading }), [isLoading, song])
}

export const useAllSongs = () => {
	const [songs, setSongs] = useState([])

	useEffect(() => {
		const fetchSongs = async () => {
			const querySnapshot = await getDocs(collection(firestore, 'songs'))
			const newSongs = []
			querySnapshot.forEach(doc => {
				newSongs.push({ id: doc.id, ...doc.data() })
			})
			setSongs(newSongs)
		}
		fetchSongs()
	}, [])

	return songs
}

export const useSongs = (songIdsInput = []) => {
	const [songIds, setSongIds] = useState([])
	const [songs, setSongs] = useState([])

	useEffect(() => {
		setSongIds(prev => (isEqual(prev, songIdsInput) ? prev : songIdsInput))
	}, [songIdsInput])

	useEffect(() => {
		const songDocs = songIds.map(songId =>
			getDoc(doc(firestore, 'songs', songId))
		)
		Promise.all(songDocs).then(docs => {
			setSongs(docs.map(doc => ({ id: doc.id, ...doc.data() })))
		})
	}, [songIds])

	return songs
}

export const useUpdateSong = () => {
	const [isLoading, setIsLoading] = useState(false)

	const updateSong = async (songId, changes) => {
		setIsLoading(true)
		await updateDoc(doc(songsCollection, songId), changes)
		setIsLoading(false)
	}

	return {
		updateSong,
		isLoading,
	}
}
