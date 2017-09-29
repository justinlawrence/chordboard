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
		if ( this.props.slug !== nextProps.slug ) {
			this.handleProps( nextProps );
		}
	}

	handleProps = props => {
		this._getSongBySlug( props.slug )
			.then( song => {

				this.setState( { song } );

			} );

	};

	render( { currentKey }, { song } ) {
		return song && (
			<SongViewer currentKey={currentKey} song={song}/>
		);

	}

	_getSongBySlug = slug => {

		return db.find( {
			selector: {
				type: 'song',
				slug: slug
			}
		} )
			.then( result => result.docs[ 0 ] )
			.catch( err => {

				console.warn(
					'App.constructor - pouchdb query failed: _getSongBySlug',
					err );

			} );

	};
}

export default SongContainer;