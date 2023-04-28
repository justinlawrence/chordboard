import React from 'react'
import { styled } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {
	AppBar,
	Button,
	Grid,
	IconButton,
	Toolbar,
	Tooltip,
} from '@mui/material'
import {
	WbSunnyOutlined as DarkModeIcon,
	Brightness2Outlined as LightModeIcon,
} from '@mui/icons-material'

import * as actions from '../redux/actions'
import { getThemeId } from '../redux/reducers/theme'
import SetToolbar from './SetToolbar'
import chordboardLogoDark from '../chordboard-logo-light.png'
import chordboardLogoLight from '../chordboard-logo-dark.png'
import { useSetToolbar } from '../hooks'

const PREFIX = 'Navbar'

const classes = {
	root: `${PREFIX}-root`,
	flex: `${PREFIX}-flex`,
	menuButton: `${PREFIX}-menuButton`,
	logoBig: `${PREFIX}-logoBig`,
	logoWrapper: `${PREFIX}-logoWrapper`,
	tabs: `${PREFIX}-tabs`,
	tab: `${PREFIX}-tab`,
	setToolbar: `${PREFIX}-setToolbar`,
	miniButton: `${PREFIX}-miniButton`,
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	[`&.${classes.root}`]: {
		'@media print': {
			display: 'none !important',
		},
	},

	[`& .${classes.flex}`]: {
		flex: 1,
	},

	[`& .${classes.menuButton}`]: {
		marginLeft: -12,
		marginRight: 20,
	},

	[`& .${classes.logoBig}`]: {
		height: theme.spacing(2),
		verticalAlign: 'middle',
	},

	[`& .${classes.logoWrapper}`]: {
		paddingRight: theme.spacing(),
		paddingTop: theme.spacing(),
	},

	[`& .${classes.tabs}`]: {
		flexGrow: 1,
		width: '100%',
	},

	[`& .${classes.tab}`]: {
		root: {
			padding: 0,
		},
	},

	[`& .${classes.setToolbar}`]: {},

	[`& .${classes.miniButton}`]: {
		zoom: 0.8,
	},
}))

const Navbar = ({ setCurrentUser, songs, themeId, updateTheme }) => {
	const { currentSet, songId } = useSetToolbar()

	const toggleTheme = () => {
		if (themeId === 'light') {
			updateTheme('dark')
		} else {
			updateTheme('light')
		}
	}

	return (
		<StyledAppBar
			className={classes.root}
			color={'secondary'}
			position={'sticky'}
		>
			{currentSet ? (
				<SetToolbar
					currentSet={currentSet}
					songId={songId}
					songs={songs}
				/>
			) : (
				<Toolbar variant={'dense'}>
					<Grid container alignItems={'center'}>
						<Grid item xs>
							<Link to={'/'} className={classes.logoWrapper}>
								<img
									src={
										themeId === 'dark'
											? chordboardLogoDark
											: chordboardLogoLight
									}
									className={classes.logoBig}
									alt={'chordboard logo'}
								/>
							</Link>
							<Button
								component={Link}
								color={'inherit'}
								to={'/sets'}
							>
								Sets
							</Button>
							<Button
								component={Link}
								color={'inherit'}
								to={'/songs'}
							>
								Songs
							</Button>
						</Grid>

						<Grid item>
							{/* <Typography variant={'caption'}>
									v{version}
								</Typography> */}
							<Tooltip
								title={
									themeId === 'dark'
										? 'light mode'
										: 'dark mode'
								}
							>
								<IconButton
									onClick={toggleTheme}
									size={'large'}
								>
									{themeId === 'dark' ? (
										<LightModeIcon />
									) : (
										<DarkModeIcon />
									)}
								</IconButton>
							</Tooltip>
						</Grid>
					</Grid>
				</Toolbar>
			)}
		</StyledAppBar>
	)
}

const mapStateToProps = state => ({
	currentSong: state.songs.byId[state.currentSong.id],
	themeId: getThemeId(state),
})

export default connect(mapStateToProps, actions)(Navbar)
