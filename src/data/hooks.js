import { useCallback, useEffect, useMemo, useState } from 'react'
import { firestore } from '../firebase'
import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
} from 'firebase/firestore'
import slugify from 'slugify'
import { noop } from '../utils'

export const useAddSong = () => {
	const [isLoading, setIsLoading] = useState(false)

	const songsCollection = collection(firestore, 'songs')

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

export const useSet = setId => {
	const [isLoading, setIsLoading] = useState(true)
	const [set, setSet] = useState(null)

	useEffect(() => {
		if (!setId) {
			setSet(null)
			return
		}
		return onSnapshot(doc(firestore, 'sets', setId), doc => {
			if (doc.exists()) {
				setSet(doc.data())
			} else {
				// doc.data() will be undefined in this case
				setSet(null)
			}
			setIsLoading(false)
		})
	}, [setId])

	return useMemo(() => ({ data: set, isLoading }), [isLoading, set])
}

export const useSongs = (songIds = []) => {
	const [songs, setSongs] = useState([])

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

export const useSyncSet = (
	setId,
	{ isEnabled: isEnabledOption = false, onSync: onSyncOption = noop } = {}
) => {
	const syncRef = useMemo(() => doc(firestore, 'set-sync', setId), [setId])
	const [songId, setSongId] = useState(null)
	const [isEnabled, setIsEnabled] = useState(false)
	const [onSync, setOnSync] = useState(noop)

	useEffect(() => {
		setIsEnabled(isEnabledOption)
		setOnSync(() => onSyncOption)
	}, [isEnabledOption, onSyncOption])

	useEffect(() => {
		if (isEnabled && songId) {
			return onSnapshot(syncRef, doc => {
				getDoc(doc.data().song).then(doc => {
					if (
						setId &&
						doc.id &&
						songId !== doc.id &&
						doc.id != null
					) {
						onSync({ setId, songId: doc.id })
					}
				})
			})
		}
	}, [setId, isEnabled, onSync, songId, syncRef])

	return useCallback(
		songId => {
			if (!isEnabled || !songId) {
				return
			}
			setSongId(songId)
			setDoc(
				syncRef,
				{ song: doc(firestore, 'songs', songId) },
				{ merge: true }
			)
		},
		[isEnabled, syncRef]
	)
}
