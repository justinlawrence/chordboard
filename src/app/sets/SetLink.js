import {Link, Route} from 'react-router-dom';

class SetLink extends PreactComponent {
	handleClick = () => {

		this.context.setFocusedSet( this.props.set );

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