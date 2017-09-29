import {findIndex} from 'lodash';
import {Link, Route} from 'react-router-dom';

import {db, sync} from '../common/database';
import SongContainer from '../songs/SongContainer';

import SetViewer from './SetViewer';

class SetContainer extends PreactComponent {
	state = {
		set:   null,
		songs: []
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		this._getSet( props.slug );

	};

	render( props, { set, songs } ) {
		return (
			<div>
				<Route exact path="/sets/:setSlug" render={( { match } ) => (
					<SetViewer set={set} songs={songs}/>
				)}/>
				<Route exact path="/sets/:setSlug/songs/:songSlug" render={( { match } ) => {

					const songSlug = match.params.songSlug;

					const index = findIndex( songs, { slug: songSlug } );
					const prevSong = index >= 0 ? songs[ index - 1 ] : null;
					const nextSong = index >= 0 ? songs[ index + 1 ] : null;

					return (
						<div>
							{set && (
								<div class="level">
									<div class="level-left">
										<p class="level-item">{set.title}</p>

										{prevSong && (
											<Link
												class="level-item"
												to={`/sets/${set.slug}/songs/${prevSong.slug}`}
											>
												<span class="icon"><i class="fa fa-angle-left"></i></span>
												{prevSong.title}
											</Link>
										)}

										{nextSong && (
											<Link
												class="level-item"
												to={`/sets/${set.slug}/songs/${nextSong.slug}`}
											>
												{nextSong.title}
												<span class="icon"><i class="fa fa-angle-right"></i></span>
											</Link>
										)}
									</div>
								</div>
							)}
							<SongContainer slug={match.params.songSlug}/>
						</div>
					);

				}}/>
			</div>

		);
	}

	_getSet = slug => {

		// This gets all sets
		return db.find( {
			selector: {
				type: 'set',
				slug: slug
			}
		} ).then( result => {

			const set = result.docs[ 0 ];

			this.setState( { set } );
			this._getSongs( set );

		} ).catch( err => {

			console.warn( 'SetContainer._getSet - fetching set',
				err );

		} );

	};

	_getSongs = set => {

		const keys = set.songs.map( s => typeof s === 'string' ? s : s._id );

		db.allDocs( {
			include_docs: true,
			keys:         keys
		} ).then( result => {

			this.setState( {
				songs: result.rows.map( r => r.doc ) || []
			} );

		} ).catch( err => {

			console.warn( 'SetContainer._getSongs - fetching songs',
				err );

		} );

	};
}

export default SetContainer;