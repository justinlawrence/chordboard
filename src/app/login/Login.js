import {connect} from 'preact-redux';
import {withRouter} from 'react-router-dom';

import {setUser} from 'app/actions/user';

import './login.scss';

class Login extends PreactComponent {
	state = {
		name: ''
	};

	handleInput = event => this.setState( { name: event.target.value } );

	handleLogin = event => {

		event.preventDefault();

		localStorage.setItem( 'user', this.state.name );
		this.props.setUser( {
			name: this.state.name
		} );

		if ( this.props.history ) {
			this.props.history.push( {
				pathname: '/sets'
			} );
		}

	};

	render( props, { name } ) {
		return (
			<form onSubmit={this.handleLogin}>
				<input type="text" onInput={this.handleInput} value={name}/>
				<button>Login</button>
			</form>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setUser: user => {
		dispatch( setUser( user ) );
	}
});


export default withRouter( connect( null, mapDispatchToProps )( Login ) );