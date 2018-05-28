import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import cx from 'classnames';

import * as actions from 'actions';
import SyncStatus from 'app/common/SyncStatus';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'mdi-material-ui/Menu';
import Button from '@material-ui/core/Button';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	flex: {
		flex: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	}
});


class Navbar extends React.Component {
	state = {
		isMenuVisible: false
	};

	setUserTextSize = () => {
		this.props.setCurrentUser( {
			textSize: 82
		} );
	};

	toggleNavbarMenu = () => {
		this.setState( {
			isMenuVisible: !this.state.isMenuVisible
		} );
	};

	render() {

		const {
			focusedSet,
			syncState,
			classes
		} = this.props;

		const {
			isMenuVisible,
		} = this.state;


		return (
			<div className={classes.root}>
				<AppBar color="secondary" position="static" className="no-print">
					<Toolbar>
						<IconButton aria-label="Menu" className={classes.menuButton} color="inherit">
							<MenuIcon/>
						</IconButton>
						<Typography variant="title" color="inherit" className={classes.flex}>
							Chordboard
						</Typography>

						<Button component={Link} color="inherit" to="/sets">Sets</Button>
						<Button component={Link} color="inherit" to="/songs">Songs</Button>

						{/* <Button color="inherit">Login</Button> */}

					</Toolbar>
				</AppBar>
			</div>
		);

		return (
			<nav className="navbar no-print">
				<div className="container">
					<div className="navbar-brand">
						<Link className="navbar-item" to='/'>
							<img src="/assets/chordboard-logo-long.png"
							     alt="Chordboard: a chordsheet manager for live musicians"
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

Navbar.propTypes = {
	classes: PropTypes.object,
};

const mapStateToProps = state => ({
	syncState: state.syncState
});

//TODO: Brett please check this is right, thanks
//export default withRouter( connect( mapStateToProps, actions )( Navbar ) );
export default withStyles( styles )( Navbar );
