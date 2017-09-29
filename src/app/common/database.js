import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

PouchDB.plugin( PouchDBFindPlugin );

export const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type' ] }
} );

const remoteDbSettings = {
	adapter: 'http',
	auth:    {
		username: 'justinlawrence',
		password: 'cXcmbbLFO8'
	}
};
const localDB = new PouchDB( 'chordboard' );
const remoteDB = new PouchDB( 'https://couchdb.cloudno.de/chordboard',
	remoteDbSettings );

export const sync = localDB.sync( remoteDB, {
	live:  true,
	retry: true
} );

export default db;