import {isNil} from 'lodash';
import {Link} from 'react-router-dom';
import slugify from 'slugify';

import {parseSong} from '../SongViewer/SongViewer.js';
import {db} from '../common/database';
import Song from '../common/Song.js';
import chordproParser from 'app/parsers/chordpro-parser.js';
import '../SongEditor/SongEditor.scss';

class SongEditor extends PreactComponent {
	state = {
		author:     '',
		isLoading:  false,
		title:      '',
		key:        '',
		content:    '',
		parserType: 'chords-above-words',
		song:       null
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleParserChange = event => {

		this.setState( {
			parserType: event.target.value
		} );

	};

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

		if ( confirm( 'Are you very sure you want to delete this song?' ) ) {

			db.remove( this.state.song._id, this.state.song._rev )
				.then( () => {

					if ( this.props.history ) {
						this.props.history.push( {
							pathname: '/songs'
						} );
					}

				} )
				.catch( err => {

					alert( 'Unable to delete song' );
					console.warn( err );

				} );

		}
	};


	onSaveSong = () => {

		const { author, parserType, title, key, song } = this.state;
		const isNew = !song || isNil( song._id );
		let content = this.state.content;

		if ( parserType === 'chordpro' ) {

			content = chordproParser( content );

		}

		if ( isNew ) {

			db.post( {
				type:    'song',
				users:   [ 'justin' ], //TODO
				slug:    slugify( title ),
				author:  author,
				title:   title,
				key:     key,
				content: content
			} ).then( () => {

				if ( this.props.history ) {
					this.props.history.goBack();
				}

			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SongEditor.onSaveSong: conflict -', err );

				} else {

					console.error( 'SongEditor.onSaveSong -', err );

				}

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
					song: Object.assign( {}, this.state.song, {
						_rev: data.rev
					} )
				} );

				//TODO: add toast updated message
				//alert( 'Updated successfully!' );

				if ( this.props.history ) {
					this.props.history.goBack();
				}


			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SongEditor.onSaveSong: conflict -', err );

				} else {

					console.error( 'SongEditor.onSaveSong -', err );

				}

			} );

		}

	};

	render( {}, { author, title, key, content, parserType, song } ) {

		const songCopy = Object.assign( {}, song );

		if ( parserType === 'chordpro' ) {

			songCopy.content = chordproParser( songCopy.content );

		}

		const previewSong = parseSong( new Song( songCopy ), [] );


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

							<div class="field has-addons has-addons-right">
								<p class="control">
									<select
										onChange={this.handleParserChange}
										value={this.state.parserType}
									>
										<option value="chords-above-words">
											Chords above words
										</option>
										<option value="chordpro">Onsong</option>
									</select>
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
									{previewSong}
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
