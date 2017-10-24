import {isNil} from 'lodash';
import slugify from 'slugify';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';
import {parseSong} from '../SongViewer/SongViewer.js';
import Song from '../common/Song.js';
import '../SongEditor/SongEditor.scss';
import {Link} from 'react-router-dom';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SongEditor extends PreactComponent {
	state = {
		author:    '',
		isLoading: false,
		title:     '',
		key:       '',
		content:   '',
		song:      null
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		this.setState( {
			isLoading: true
		} );

		if ( props.id ) {

			db.get( props.id )
				.then( doc => {

					const song = new Song( doc );

					this.setState( {
						author:    song.author,
						isLoading: false,
						title:     song.title,
						key:       song.key,
						content:   song.content,
						song:      song
					} );

				} )
				.catch( err => {

					console.error( 'SongViewer.handleProps -', err );

					this.setState( {
						author:    '',
						isLoading: false,
						title:     '',
						key:       '',
						content:   '',
						song:      null
					} );

				} );

		}

	};

	onAuthorInput = event => {
		this.setState( { author: event.target.value } );
	};

	onContentInput = event => {
		const content = event.target.value;
		const song = Object.assign( {}, this.state.song, { content } );
		this.setState( { content, song } );
	};

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	onKeyInput = event => {
		this.setState( { key: event.target.value } );
	};

	onDeleteSong = () => {

		if ( confirm( 'Are you very sure you want to delete this set?' ) ) {

			//1 delete from pouchDb
			db.remove( this.state.song._id, this.state.song._rev )
				.then( () => {

					//TODO redirect to /songs
					//route( '/songs' );

				} )
				.catch( err => {

					alert( 'Unable to delete song' );
					console.warn( err );

				} );

		}
	};


	onSaveSong = () => {

		const { author, content, title, key, song } = this.state;
		const isNew = isNil( song._id );

		if ( isNew ) {

			// First check to see if the slug already exists.
			db.get( {
				selector: {
					type: 'song',
					slug: slugify( title )
				}
			} ).then( result => {

				if ( result.docs.length ) { //new but slug already exists

					// Slug already exists
					alert( 'A song with this exact title exists. Give it a unique name please.' );

					// TODO: make the slug unique by appending a number to the
					// end Note: If we wanted to allow duplicate slugs across
					// database but unique per user, we would require some kind
					// of user context in the url. Something like what GitHub
					// do with the username first.

				} else { //new and slug does not already exist

					db.post( {
						type:    'song',
						users:   [ 'justin' ], //TODO
						slug:    slugify( title ),
						author:  author,
						title:   title,
						key:     key,
						content: content
					} ).then( () => {


						//TODO
						PouchDB.sync( 'chordboard',
							'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' );

						//TODO: route to /songs/title
						//route( `/songs/` + slugify(title) );

					} );

				}

			} ).catch( err => {

				console.error( err );
				alert( 'Something went wrong while adding :(' );

			} );

		} else { //existing

			const data = Object.assign( {}, song );

			data.author = author;
			data.content = content;
			data.slug = slugify( title );
			data.title = title;
			data.key = key;

			console.log( 'existing: id', song._id, 'rev', song._rev );
			console.log( this.props );
			db.put( data ).then( ( data ) => {

				this.setState( {
					song: Object.assign( {}, this.state.song,
						{
							_rev: data.rev
						} )
				} );

				PouchDB.sync( 'chordboard',
					'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' )
					.catch( err => {

						console.warn( 'Could not sync to remote database',
							err );

					} );

				//TODO: add toast updated message
				//alert( 'Updated successfully!' );

				if ( this.props.history ) {
					this.props.history.goBack();
				}


			} ).catch( err => {
				console.error( err );
			} );

		}

	};

	render( {}, { author, title, key, content, song } ) {

		return (
			<section class="section">
				<div class="container">
					<div class="columns">
						<div class="column is-three-quarters">

							<div class="field">

								<p class="control has-icons-left">
									<input
										type="text"
										class="input"
										onInput={this.onTitleInput}
										placeholder="Title"
										value={title}/>

									<span class="icon is-small is-left">
						                <i class="fa fa-chevron-right"></i>
						            </span>

								</p>
							</div>

							<div class="field">

								<p class="control has-icons-left">
									<input
										type="text"
										class="input"
										onInput={this.onAuthorInput}
										placeholder="Author"
										value={author}/>

									<span class="icon is-small is-left">
					      		<i class="fa fa-chevron-right"></i>
					    		</span>
								</p>

							</div>

							<div class="field">

								<p class="control has-icons-left">
									<input
										type="text"
										class="input"
										onInput={this.onKeyInput}
										placeholder="Key"
										value={key}/>

									<span class="icon is-small is-left">
					      		<i class="fa fa-chevron-right"></i>
					    		</span>
								</p>

							</div>

							<div class="field">

								<p class="control">
									<textarea
										class="textarea song-editor__content"
										onInput={this.onContentInput}
										placeholder="Type words and chords here."
										rows="25"
									>
										{content}
									</textarea>
								</p>

							</div>

						</div>

						<div class="column">

							<div class="level-left">
								<div class="level-item">

									<a class="button is-outlined" onClick={this.onDeleteSong}>
											 <span class="icon is-small is-left">
												 <i class="fa fa-trash"></i>
											</span>
									</a>
								</div>
								<div class="level-item">

									<a class="button is-primary"
									   onClick={this.onSaveSong}>Save</a>

								</div>
							</div>

							<div class="song-editor__preview">

								<h1 class="title">
									{title}
								</h1>
								<h2 class="subtitle">
									{author}
								</h2>

								<div class="song-editor__preview-content">
									{parseSong( new Song( song ), [] )}
								</div>

							</div>
						</div>
					</div>
				</div>
			</section>
		);

	}
}

export default SongEditor;
