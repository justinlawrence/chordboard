import './SongEditor.scss';
import Sheet, {parseSong} from '../sheet/Sheet.js';
import Song from './Song.js';

class SongEditor extends PreactComponent {
	state = {
		title:   '',
		content: ''
	};

	onContentInput = event => {

		this.setState( { content: event.target.value } );

	};

	onTitleInput = event => {

		this.setState( { title: event.target.value } );

	};

	onSaveSong = () => {

		const { title, content } = this.state;

		fetch( '//localhost:3000/api/songs', {
			method:  'post',
			headers: {
				'Accept':       'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body:    JSON.stringify( { title, content } )
		} )
			.then( res => console.log( res ) );

	};

	render( {}, { title, content } ) {

		return (
			<div class="song-editor">
				<div class="song-editor__left-column">
					<input type="text"
					       class="song-editor__title"
					       onInput={this.onTitleInput}
					       placeholder="Title"
					       value={title}/>
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
						{parseSong( new Song(content), "" )}
					</div>
				</div>
			</div>
		);

	}
}

export default SongEditor;
