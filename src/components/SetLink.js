import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class SetLink extends PureComponent {
	static propTypes = {
		children: PropTypes.any,
		setFocusedSet: PropTypes.func,
		set: PropTypes.object.isRequired
	}

	handleClick = () => {
		this.props.setFocusedSet(this.props.set)
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
