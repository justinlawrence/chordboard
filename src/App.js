import React from 'react'

import { Redirect, Route, Switch } from 'react-router-dom'

import { CssBaseline, Grid } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import LiveBar from './components/LiveBar'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import SetCurrentSong from './components/SetCurrentSong'
import SongListContainer from './containers/SongListContainer'
import SongEditor from './components/SongEditor'
import SongContainer from './containers/SongContainer'
import SetListContainer from './containers/SetListContainer'
import Privacy from './pages/Privacy'
import { useAppTheme } from './themes/useAppTheme'

const PREFIX = 'App'

const classes = {
	root: `${PREFIX}-root`,
	content: `${PREFIX}-content`,
}

const App = () => {
	const theme = useAppTheme()

	return (
		<ThemeProvider theme={theme}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<Grid
					container
					className={classes.root}
					direction={'column'}
					wrap={'nowrap'}
				>
					<CssBaseline />
					<SetCurrentSong />
					<Navbar />

					<Grid className={classes.content} item xs>
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
								component={SongEditor}
							/>

							<Route
								exact
								path={'/songs/:id/edit'}
								render={props => (
									<SongEditor
										id={props.match.params.id}
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
					</Grid>
					<LiveBar />
				</Grid>
			</LocalizationProvider>
		</ThemeProvider>
	)
}

export default App
