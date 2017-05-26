import {findIndex} from 'lodash';
import slugify from 'slugify';
import Sheet from '../sheet/Sheet.js';

class SongViewer extends PreactComponent {
	render( { id, songMap } ) {

		return (
			<div>
				<Sheet song={songMap[id]}/>
			</div>
		);

	}
}

export default SongViewer;