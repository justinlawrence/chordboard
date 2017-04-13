import {findIndex} from 'lodash';
import slugify from 'slugify';
import Sheet from '../sheet/Sheet.js';

class SongViewer extends PreactComponent {
	constructor( props ) {
		super( props );

		const { slug, songs } = props;

		this.state = {
			index: findIndex( songs, s => slugify( s.title ) === slug )
		};

	}

	componentWillReceiveProps( { slug, songs } ) {

		this.setState( {
			index: findIndex( songs, s => slugify( s.title ) === slug )
		} );

	}

	render( {songs}, { index } ) {

		const prevSong = songs[ index - 1 ];
		const nextSong = songs[ index + 1 ];

		return (
			<div>
				{ prevSong ?
					<a href={`/song/${slugify(prevSong.title)}`}
					   class="prev-button">&lt;</a>
					: null }
				<Sheet song={songs[index]}/>
				{ nextSong ?
					<a href={`/song/${slugify(nextSong.title)}`}
					   class="next-button">&gt;</a>
					: null }
			</div>
		);

	}

}

export default SongViewer;