import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { IconButton, Grid, ListItem, Typography, Tooltip } from '@mui/material'
import { Delete as DeleteIcon, Drag as DragIcon } from 'mdi-material-ui'

import * as actions from '../redux/actions'
import KeySelector from './KeySelector'

class SetSong extends PureComponent {
	static defaultProps = {
		song: {
			needsFetching: true,
			title: 'Loading...',
		},
	}

	static propTypes = {
		mode: PropTypes.string,
		onChangeKey: PropTypes.func,
		provided: PropTypes.object,
		setId: PropTypes.string,
		song: PropTypes.object,
		songId: PropTypes.string,
		songIndex: PropTypes.number,
		songKey: PropTypes.string,
		// Redux props
		fetchSong: PropTypes.func.isRequired,
	}

	componentDidMount() {
		if (this.props.song.needsFetching) {
			this.props.fetchSong(this.props.songId)
		}
	}

	handleKeySelect = (key, amount) =>
		this.props.onChangeKey &&
		this.props.onChangeKey(this.props.songId, amount)

	handleTableRowClick = () =>
		this.props.history.push(
			`/sets/${this.props.setId}/songs/${this.props.songId}`
		)

	removeSong = event => {
		this.props.removeSetSong(this.props.setId, this.props.songId)
		event.stopPropagation()
	}

	stopPropagation = event => event.stopPropagation()

	render() {
		const { mode, setKey, song, songIndex } = this.props

		//FYI the header for this table is in SetViewer.js

		return (
			<ListItem button onClick={this.handleTableRowClick}>
				{mode === 'edit' && (
					<Tooltip title={'Drag to reorder song'}>
						<DragIcon />
					</Tooltip>
				)}

				<Typography variant={'h6'}>{songIndex + 1}</Typography>
				<Typography variant={'h6'}>{song.title}</Typography>

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

				{mode === 'edit' && (
					<Tooltip title={'Remove song from set'}>
						<IconButton
							aria-label={'Remove song'}
							onClick={this.removeSong}
							size={'large'}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				)}
			</ListItem>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	song: state.songs.byId[ownProps.songId],
})

export default connect(mapStateToProps, actions)(withRouter(SetSong))
