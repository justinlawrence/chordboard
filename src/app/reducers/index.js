import {combineReducers} from 'redux';

import syncState from './sync-state.js';
import user from './user.js';

const shoppingList = combineReducers( {
	syncState,
	user
} );

export default shoppingList;
