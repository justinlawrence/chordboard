import { useEffect } from 'react'
import { atom, useAtom, useSetAtom } from 'jotai'
import { darkTheme } from './theme-dark'
import { lightTheme } from './theme-light'

export const themesOrder = ['light', 'dark']

export const themes = {
	dark: {
		id: 'dark',
		muiTheme: darkTheme,
		name: 'Dark matter',
	},
	light: {
		id: 'light',
		muiTheme: lightTheme,
		name: 'Flat white',
	},
}

const defaultTheme = darkTheme

export const appThemeAtom = atom(defaultTheme)

export const useAppTheme = () => {
	const [theme, setTheme] = useAtom(appThemeAtom)

	useEffect(() => {
		const savedThemeId = localStorage.getItem('theme')
		setTheme(savedThemeId === 'dark' ? darkTheme : lightTheme)
	}, [setTheme])

	return theme
}

export const useUpdateAppTheme = () => {
	const setTheme = useSetAtom(appThemeAtom)

	return themeId => {
		setTheme(themes[themeId].muiTheme)
		localStorage.setItem('theme', themeId)
	}
}
