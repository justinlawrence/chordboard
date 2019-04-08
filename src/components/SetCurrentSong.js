import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { matchPath, withRouter } from 'react-router-dom'

import * as actions from '../redux/actions'

class SetCurrentSong extends Component {
	static propTypes = {
		location: PropTypes.object,
		setCurrentSongId: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this.updateCurrentSong()
	}

	componentDidUpdate(nextProps) {
		const { location } = this.props
		if (location.pathname !== nextProps.location.pathname) {
			this.updateCurrentSong()
		}
	}

	updateCurrentSong = () => {
		const { location } = this.props
		let match = matchPath(location.pathname, {
			path: '/sets/:setId/songs/:songId',
			exact: true,
		})

		if (!match) {
			match = matchPath(location.pathname, {
				path: '/songs/:songId',
				exact: true,
			})
		}

		if (match) {
			this.props.setCurrentSongId(match.params.songId)
		}
	}

	render() {
		return null
	}
}

export default withRouter(
	connect(
		null,
		actions
	)(SetCurrentSong)
)
