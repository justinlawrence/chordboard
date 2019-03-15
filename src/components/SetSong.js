import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import RootRef from '@material-ui/core/RootRef'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {
	Delete as DeleteIcon,
	Minus as MinusIcon,
	Plus as PlusIcon,
} from 'mdi-material-ui'

import * as actions from '../redux/actions'
import KeySelector from './KeySelector'

class SetSong extends PureComponent {
	static propTypes = {
		mode: PropTypes.string,
		onChangeKey: PropTypes.func,
		provided: PropTypes.object,
		setId: PropTypes.string,
		song: PropTypes.object,
		songId: PropTypes.string,
		songIndex: PropTypes.number,
		songKey: PropTypes.string,
	}

	handleKeySelect = (key, amount) =>
		this.props.onChangeKey &&
		this.props.onChangeKey(this.props.songId, amount)

	handleTableRowClick = () =>
		this.props.changeRoute(
			`/sets/${this.props.setId}/songs/${this.props.songId}`
		)

	removeSong = () =>
		this.props.removeSetSong(this.props.setId, this.props.songId)

	stopPropagation = event => event.stopPropagation()

	render() {
		const { mode, provided, setKey, song, songIndex } = this.props

		return (
			<RootRef rootRef={provided.innerRef}>
				<TableRow
					hover
					onClick={this.handleTableRowClick}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<TableCell padding={'dense'}>
						<Typography variant="h6">{songIndex + 1}</Typography>
					</TableCell>
					<TableCell padding={'none'}>
						<Typography variant="h6">{song.title}</Typography>
					</TableCell>

					<TableCell padding={'none'}>
						<Grid container>
							<Grid item onClick={this.stopPropagation}>
								<KeySelector
									onSelect={this.handleKeySelect}
									songKey={setKey}
								/>
							</Grid>

							{/*mode === 'edit' && (
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
							)*/}
						</Grid>
					</TableCell>

					{mode === 'edit' && (
						<TableCell>
							<Grid container wrap="nowrap">
								<IconButton
									aria-label="Remove song"
									onClick={this.removeSong}
								>
									<DeleteIcon />
								</IconButton>
							</Grid>
						</TableCell>
					)}
				</TableRow>
			</RootRef>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	song: state.songs.byId[ownProps.songId],
})

export default connect(
	mapStateToProps,
	actions
)(SetSong)
