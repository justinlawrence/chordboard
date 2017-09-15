import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import './set-viewer.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SetViewer extends PreactComponent {
	state = {
		isLoading: false,
		set:       null,
		songs:     []
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		if ( props.slug ) {

			this.setState( {
				isLoading: true
			} );

			db.find( {
				selector: {
					type: 'set',
					slug: props.slug
				}
			} ).then( result => {

				const set = result.docs[ 0 ];

				if ( set.songs && set.songs.length ) {

					this.setState( {
						isLoading: true
					} );

					db.allDocs( {
						include_docs: true,
						keys:         set.songs
					} ).then( result => {

						this.setState( {
							isLoading: false,
							songs:     result.rows.map(r => r.doc) || []
						} );

					} ).catch( err => {

						console.error( 'SetViewer.handleProps - fetching songs',
							err );

						this.setState( {
							isLoading: false,
							set:       null
						} );

					} );

				}

				this.setState( {
					isLoading: false,
					set:       set
				} );

			} ).catch( err => {

				console.error( 'SetViewer.handleProps -', err );

				this.setState( {
					isLoading: false,
					set:       null
				} );

			} );

		}

	};

	render( {}, { songs, set } ) {
		return (
			<section class="set-viewer section">
				<div class="container">
					<div class="columns">
						<div class="column is-three-quarters">
							{set && set.title}

							{songs.length ?
								songs.map( song => (
									<div>{song.title}</div>
								) )
								:
								<div>This set has no songs</div>
							}
						</div>
						<div class="column">
							{set &&
							<a class="button is-primary"
							   href={`/songs/add-to-set/${set.slug}`}>Add songs</a>}
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default SetViewer;