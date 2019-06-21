export const FETCH_THEME_FAILURE = 'FETCH_THEME_FAILURE'
export const FETCH_THEME_REQUEST = 'FETCH_THEME_REQUEST'
export const FETCH_THEME_SUCCESS = 'FETCH_THEME_SUCCESS'
export const SET_THEME = 'SET_THEME'
export const UPDATE_THEME = 'UPDATE_THEME'

export const fetchThemeFailure = reason => ( { type: FETCH_THEME_FAILURE, payload: reason } )
export const fetchThemeRequest = () => ( { type: FETCH_THEME_REQUEST } )
export const fetchThemeSuccess = themeId => ( { type: FETCH_THEME_SUCCESS, payload: themeId } )
export const setTheme = themeId => ( { type: SET_THEME, payload: themeId } )
export const updateTheme = themeId => ( { type: UPDATE_THEME, payload: themeId } )
