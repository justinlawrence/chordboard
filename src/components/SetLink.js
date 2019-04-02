import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class SetLink extends PureComponent {
	static propTypes = {
		children: PropTypes.any,
		setCurrentSetId: PropTypes.func,
		set: PropTypes.object.isRequired,
	}

	handleClick = () => {
		this.props.setCurrentSetId(this.props.set.id)
	}

	render() {
		const { children, set } = this.props

		return (
			<Link onClick={this.handleClick} to={`/sets/${set.id}`}>
				{children}
			</Link>
		)
	}
}

export default SetLink
