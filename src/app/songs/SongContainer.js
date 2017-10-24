import {db, sync} from '../common/database';

import SongViewer from '../SongViewer/SongViewer';

class SongContainer extends PreactComponent {
	state = {
		song: null
	};

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
			.then( song => this.setState( { song } ) );

	};

	render( { currentKey }, { song } ) {
		return song && (
			<SongViewer currentKey={currentKey} song={song}/>
		);

	}

	_getSongById = id => {

		return db.get( id )
			.catch( err => {

				console.warn( 'App.constructor - pouchdb query failed: _getSongBySlug', err );

			} );

	};
}

export default SongContainer;
