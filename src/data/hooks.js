import { useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { firestore } from '../firebase'

export const useSet = setId => {
	const [isLoading, setIsLoading] = useState(true)
	const [set, setSet] = useState(null)

	useEffect(() => {
		return onSnapshot(doc(firestore, 'sets', setId), doc => {
			if (doc.exists()) {
				console.log('Document data:', doc.data())
				setSet(doc.data())
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!')
				setSet(null)
			}
			setIsLoading(false)
		})
	}, [setId])

	return useMemo(() => ({ data: set, isLoading }), [isLoading, set])
}
