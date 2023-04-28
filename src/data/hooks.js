import { useEffect, useMemo, useState } from 'react'
import { firestore } from '../firebase'
import { addDoc, collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import slugify from 'slugify'

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
