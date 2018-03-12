import slugify from 'slugify';

import * as types from 'constants/action-types';

export const addSong = ( { author, content, key, title } ) => {
	return {
		type: types.ADD_SONG,
		author,
		content,
		key,
		slug: slugify( title ),
		title
	};
};