import { parse } from 'date-fns'

export const getDateFromFirebase = firebaseDate =>
	firebaseDate.seconds
		? new Date(firebaseDate.seconds * 1000)
		: parse(firebaseDate, 'yyyy-MM-dd', new Date())
