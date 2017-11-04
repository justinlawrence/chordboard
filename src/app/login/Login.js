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

			<div>

				<section class="hero is-dark">
					<div class="hero-body">
						<div class="container">
							<div class="columns is-vcentered">
								<div class="column">
									<h1 class="title is-1">Chordboard</h1>
									<h2 class="subtitle">The live setlist</h2>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section class="section">
					<div class="container has-text centered">
						<article class="card is-rounded">
							<div class="card-content">
								<h1 class="title">
									Login
								</h1>

								<form onSubmit={this.handleLogin}>

								<p class="control has-icons-left">
									<input class="input is-medium" type="text" placeholder="Your Name"  onInput={this.handleInput}  value={name}/>
									<span class="icon is-small is-left">
										<i class="fa fa-envelope"></i>
									</span>
								</p>

								<p class="control has-icons-left">
									<input class="input is-medium" type="password" placeholder="Password"/>
									<span class="icon is-small is-left">
										<i class="fa fa-lock"></i>
									</span>
								</p>

								<p class="control">
									<button class="button is-primary is-medium is-fullwidth">
										Login
									</button>
								</p>

							</form>

							</div>
						</article>

					</div>

				</section>

			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setUser: user => {
		dispatch( setUser( user ) );
	}
});


export default withRouter( connect( null, mapDispatchToProps )( Login ) );
