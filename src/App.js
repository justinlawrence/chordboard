import React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { CssBaseline, GlobalStyles, Stack } from '@mui/material'
import { styled, ThemeProvider } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import LiveBar from './components/LiveBar'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import SongListContainer from './containers/SongListContainer'
import SongEditor from './components/SongEditor'
import SongEditPage from './components/SongEditPage'
import SongContainer from './containers/SongContainer'
import SetListContainer from './containers/SetListContainer'
import Privacy from './pages/Privacy'
import { useAppTheme } from './themes/useAppTheme'

const PREFIX = 'App'

const classes = {
	content: `${PREFIX}-content`,
}

const StyledStack = styled(Stack, { name: PREFIX })(({ theme }) => ({
	height: '100%',

	[`& .${classes.content}`]: {
		flexGrow: 1,
	},
}))

const documentStyles = (
	<GlobalStyles
		styles={{
			'html, body, #root': {
				height: '100%',
			},
		}}
	/>
)

const App = () => {
	const theme = useAppTheme()

	return (
		<ThemeProvider theme={theme}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<StyledStack wrap={'nowrap'}>
					<CssBaseline />
					{documentStyles}

					<Navbar />

					<div className={classes.content}>
						<Switch>
							<Route
								exact
								path={'/privacy'}
								component={Privacy}
							/>
							<Route exact path={'/login'} component={Login} />
							<Route path={'/sets'}>
								<SetListContainer />
							</Route>

							{/* {!user.name && <Redirect to={'/login'} />} */}

							<Route
								exact
								path={'/songs'}
								component={SongListContainer}
							/>

							<Route
								exact
								path={'/songs/add-to-set/:setId'}
								render={props => (
									<SongListContainer
										setId={props.match.params.setId}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path={'/songs/new'}
								component={SongEditPage}
							/>

							<Route
								exact
								path={'/songs/:id/edit'}
								render={props => (
									<SongEditPage
										songId={props.match.params.id}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path={'/songs/:id'}
								render={({ match }) => (
									<SongContainer id={match.params.id} />
								)}
							/>

							<Redirect to={'/sets'} />
						</Switch>
					</div>
					<LiveBar />
				</StyledStack>
			</LocalizationProvider>
		</ThemeProvider>
	)
}

export default App
