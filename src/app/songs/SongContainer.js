import React, { Component } from 'react';
import { db, sync } from 'database';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import SongViewer from '../SongViewer/SongViewer';

class SongContainer extends Component {

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.id !== nextProps.id ) {
			this.handleProps( nextProps );
		}
	}

	handleProps = props => {

		this._getSongById( props.id )
			.then( song => this.props.setCurrentSong( song ) );

	};

	render() {

		const { currentKey } = this.props;

		return (
			<SongViewer setKey={currentKey}/>
		);

	}

	_getSongById = id => {

		return db.get( id )
			.catch( err => {

				console.warn( 'App.constructor - pouchdb query failed: _getSongById', err );

			} );

	};
}

export default connect( null, actions )( SongContainer );
