import { useCallback, useEffect, useMemo, useState } from 'react'
import { firestore } from '../firebase'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
import slugify from 'slugify'

import { noop } from '../utils'
import { getDateFromFirebase } from './utils'

const setsCollection = collection(firestore, 'sets')

export const useAddSet = () => {
	const [isLoading, setIsLoading] = useState(false)

	const addSet = useCallback(async data => {
		const newSet = {
			...data,
			songs: Array.isArray(data.songs) ? data.songs : [],
			slug: slugify(data.title),
		}

		setIsLoading(true)
		const docRef = await addDoc(setsCollection, newSet)
		setIsLoading(false)

		const setDoc = await getDoc(docRef)
		return {
			id: setDoc.id,
			...setDoc.data(),
		}
	}, [])

	return {
		addSet,
		isLoading,
	}
}

export const useAllSets = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [sets, setSets] = useState([])

	useEffect(() => {
		return onSnapshot(setsCollection, snapshot => {
			setSets(
				snapshot.docs
					.map(doc => {
						const data = doc.data()
						return {
							id: doc.id,
							...data,
							setDate: getDateFromFirebase(data.setDate),
						}
					})
					.sort((a, b) => b.setDate - a.setDate)
			)
			setIsLoading(false)
		})
	}, [])

	return useMemo(() => ({ data: sets, isLoading }), [isLoading, sets])
}

export const useDeleteSet = () => {
	const [isLoading, setIsLoading] = useState(false)

	const deleteSet = useCallback(async setId => {
		setIsLoading(true)
		await deleteDoc(doc(setsCollection, setId))
		setIsLoading(false)
	}, [])

	return {
		deleteSet,
		isLoading,
	}
}
export const useDeleteSetSong = () => {
	const [isLoading, setIsLoading] = useState(false)

	const deleteSetSong = useCallback(async (setId, songId) => {
		setIsLoading(true)
		const set = await getDoc(doc(setsCollection, setId))
		const songs = set.data().songs.filter(song => song.id !== songId)
		await updateDoc(doc(setsCollection, setId), { songs })
		setIsLoading(false)
	}, [])

	return {
		deleteSetSong,
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
				setSet({ id: doc.id, ...doc.data() })
			} else {
				// doc.data() will be undefined in this case
				setSet(null)
			}
			setIsLoading(false)
		})
	}, [setId])

	return useMemo(() => ({ data: set, isLoading }), [isLoading, set])
}

export const useSyncSet = (
	setId,
	{ isEnabled: isEnabledOption = false, onSync: onSyncOption = noop } = {}
) => {
	const syncRef = useMemo(
		() => (setId ? doc(firestore, 'set-sync', setId) : null),
		[setId]
	)
	const [songId, setSongId] = useState(null)
	const [isEnabled, setIsEnabled] = useState(false)
	const [onSync, setOnSync] = useState(noop)

	useEffect(() => {
		setIsEnabled(isEnabledOption)
		setOnSync(() => onSyncOption)
	}, [isEnabledOption, onSyncOption])

	useEffect(() => {
		if (isEnabled && songId && syncRef) {
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

export const useUpdateSet = () => {
	const [isLoading, setIsLoading] = useState(false)

	const updateSet = useCallback(async (setId, changes) => {
		const newSet = {
			...changes,
		}

		if (changes.title) {
			newSet.slug = slugify(changes.title)
		}

		if (changes.songs) {
			newSet.songs = changes.songs.map(song => ({
				id: song.id,
				key: song.key,
			}))
		}

		setIsLoading(true)
		await updateDoc(doc(setsCollection, setId), newSet)
		setIsLoading(false)
	}, [])

	return {
		updateSet,
		isLoading,
	}
}
