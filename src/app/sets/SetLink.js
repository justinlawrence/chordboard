import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';

class SetLink extends Component {
	handleClick = () => {
		this.props.setFocusedSet( this.props.set );
	};

	render( { children, set } ) {

		return (
			<Link
				onClick={this.handleClick}
				to={`/sets/${set._id}`}
			>
				{children}
			</Link>
		);

	}
};

export default SetLink;