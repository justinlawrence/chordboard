import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {
	ArrowUp as ArrowUpIcon,
	ArrowDown as ArrowDownIcon,
	Delete as DeleteIcon,
	Minus as MinusIcon,
	Plus as PlusIcon
} from 'mdi-material-ui'

import * as actions from '../redux/actions'
import KeySelector from './KeySelector'

class SetSong extends PureComponent {
	static propTypes = {
		mode: PropTypes.string,
		setId: PropTypes.string,
		song: PropTypes.objext,
		songId: PropTypes.string,
		songIndex: PropTypes.number,
		songKey: PropTypes.string
	}

	removeSong = songId => {
		this.props.removeSetSong(this.props.setId, this.props.songId)
	}

	render() {
		const { mode, setId, song, songId, songIndex, songKey } = this.props

		return (
			<TableRow>
				<TableCell>
					<Typography
						component={Link}
						to={`/sets/${setId}/songs/${songId}`}
						variant="h6"
					>
						{songIndex + 1}. {song.title}
					</Typography>
				</TableCell>

				<TableCell>
					<Grid container>
						<Grid item>
							<KeySelector
								onSelect={(key, amount) => this.changeKey(songId, amount)}
								songKey={songKey}
							/>
						</Grid>

						{mode === 'edit' && (
							<Grid item>
								<IconButton
									aria-label="Transpose down"
									onClick={() => this.transposeDown(song)}
								>
									<MinusIcon />
								</IconButton>

								<IconButton
									aria-label="Transpose up"
									onClick={() => this.transposeUp(song)}
								>
									<PlusIcon />
								</IconButton>
							</Grid>
						)}
					</Grid>
				</TableCell>

				{mode === 'edit' && (
					<TableCell>
						<Grid container wrap="nowrap">
							<IconButton
								aria-label="Move song up"
								onClick={() => this.onMoveSongUp(songId)}
							>
								<ArrowUpIcon />
							</IconButton>

							<IconButton
								aria-label="Move song down"
								onClick={() => this.onMoveSongDown(songId)}
							>
								<ArrowDownIcon />
							</IconButton>

							<IconButton
								aria-label="Remove song"
								onClick={() => this.removeSong(songId)}
							>
								<DeleteIcon />
							</IconButton>
						</Grid>
					</TableCell>
				)}
			</TableRow>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	song: state.songs.byId[ownProps.songId]
})

export default connect(
	mapStateToProps,
	actions
)(SetSong)
