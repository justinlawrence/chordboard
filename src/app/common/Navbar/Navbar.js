import React, {Component} from 'react';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux'
import cx from 'classnames';

import SyncStatus from 'app/common/SyncStatus';

import './navbar.scss';

class Navbar extends Component {
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
			<nav className="navbar no-print">
				<div className="container">
					<div className="navbar-brand">
						<Link className="navbar-item" to='/'>
							<img src="/assets/chordboard-logo-long.png"
							     alt="Chordboard: a chord manager for live musicians"
							     width="142"/>
						</Link>
						<div
							className="navbar-burger"
							onClick={this.toggleNavbarMenu}>
							<span/><span/><span/>
						</div>

					</div>

					<div className={cx( 'navbar-menu', { 'is-active': isMenuVisible } )}>
						<div className="navbar-start">

							<Link className="navbar-item" to="/sets">Sets</Link>
							<Link className="navbar-item" to="/songs">Songs</Link>

							{focusedSet && (
								<Link
									className="navbar-item"
									to={`/sets/${focusedSet._id}`}
								>Live</Link>
							)}
						</div>
						<div className="navbar-end">
							<div className="navbar-item">
								<SyncStatus
									className="is-size-7 has-text-grey-light"
									status={syncState}/>
							</div>
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
