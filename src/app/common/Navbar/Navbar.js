import {Link, Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'preact-redux'
import cx from 'classnames';

import SyncStatus from 'app/common/SyncStatus';

import './navbar.scss';

class Navbar extends PreactComponent {
	state = {
		isMenuVisible: false
	};

	toggleNavbarMenu = () => {

		this.setState( {
			isMenuVisible: !this.state.isMenuVisible
		} );

	};

	render() {

		const {
			focusedSet,
			syncState
		} = this.props;

		const {
			isMenuVisible,
		} = this.state;

		return (
			<nav className="navbar">
				<div className="container">
					<div className="navbar-brand">
						<Link class="navbar-item" to='/'>
							<img src="/assets/chordboard-logo-long.png"
							     alt="Chordboard: a chord manager for live musicians"
							     width="142"/>
						</Link>
						<div
							className="navbar-burger"
							onClick={this.toggleNavbarMenu}>
							<span></span><span></span><span></span>
						</div>

					</div>

					<div className={cx( 'navbar-menu', { 'is-active': isMenuVisible } )}>
						<div className="navbar-start">

							<Link class="navbar-item" to="/sets">Sets</Link>
							<Link class="navbar-item" to="/songs">Songs</Link>

							{focusedSet && (
								<Link
									class="navbar-item"
									to={`/sets/${focusedSet._id}`}
								>Live</Link>
							)}
						</div>
						<div className="navbar-end">
							<p className="navbar-item">
								<SyncStatus
									className="is-size-7 has-text-grey-light"
									status={syncState}/>
							</p>
						</div>
					</div>
				</div>
			</nav>
		);

	}
}

const mapStateToProps = state => ({
	syncState: state.syncState
});

export default withRouter( connect( mapStateToProps, null )( Navbar ) );
