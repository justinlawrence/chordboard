import {combineReducers} from 'redux';
import syncState from './sync-state.js';

const shoppingList = combineReducers( {
	syncState,
} );

export default shoppingList;
