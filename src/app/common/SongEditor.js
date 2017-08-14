import slugify from 'slugify';
import './SongEditor.scss';
import {parseSong} from '../sheet/Sheet.js';
import Sections from "../sheet/Sections.js";
import Song from './Song.js';
import PouchDB from 'pouchdb';

const db = new PouchDB( 'chordboard' );

class SongEditor extends PreactComponent {
	state = {
		author:  '',
		title:   '',
		content: ''
	};

	componentDidMount() {

		// This gets all docs... good for debugging
		/*db.allDocs( {
			include_docs: true
		} ).then( docs => console.log( docs ) );*/

	}

	onAuthorInput = event => {
		this.setState( { author: event.target.value } );
	};

	onContentInput = event => {
		this.setState( { content: event.target.value } );
	};

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	onSaveSong = () => {

		const { title, author, content } = this.state;

		// Check to see if the slug exists already first.
		/*db.find( {
			selector: {
				type: 'song',
				slug: slugify( title )
			}
		} ).then( function ( result ) {
			// handle result
		} ).catch( function ( err ) {
			console.error( err );
		} );*/

		db.post( {
			type:    'song',
			users:   [ 'justin' ],
			slug:    slugify( title ),
			author:   author,
			title:   title,
			content: content
		} )
			.then( () => {

				//TODO
				//PouchDB.sync( 'chordboard', 'http://localhost:5984/chordboard' );

			} );

	};

	render( {}, { author, title, content } ) {

		return (
			<div class="song-editor">
				<div class="song-editor__left-column">
					<input
						type="text"
						class="song-editor__title"
						onInput={this.onTitleInput}
						placeholder="Title"
						value={title}/>
					<input
						type="text"
						class="song-editor__author"
						onInput={this.onAuthorInput}
						placeholder="Author"
						value={author}/>
					<textarea
						class="song-editor__content"
						onInput={this.onContentInput}
						placeholder="Content"
						rows="25"
						>
						{content}
					</textarea>
					<button onClick={this.onSaveSong}>Save</button>
				</div>

				<div class="song-editor__right-column">
					<div class="song-editor__preview">
						<div class="song-editor__preview-title">
							{title}
						</div>
						<div class="song-editor__preview-author">
							{author}
						</div>
						<div class="song-editor__preview-content">
							{parseSong( new Song( title + "\n" + content ), [] )}
						</div>
					</div>
				</div>
			</div>
		);

	}
}

export default SongEditor;
