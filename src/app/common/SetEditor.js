import slugify from 'slugify';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import './SetEditor.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SetEditor extends PreactComponent {
	state = {
		title: ''
	};

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	onSaveSet = () => {

		const { title } = this.state;

		// First check to see if the slug already exists.
		db.find( {
			selector: {
				type: 'set',
				slug: slugify( title )
			}
		} ).then( result => {

			if ( result.docs.length ) {

				// Slug already exists
				alert( 'Slug already exists' );

				// TODO: make the slug unique by appending a number to the end
				// Note: If we wanted to allow duplicate slugs across
				// database but unique per user, we would require some kind
				// of user context in the url. Something like what GitHub
				// do with the username first.

			} else {

				db.post( {
					type:   'set',
					author: 'justin',
					slug:   slugify( title ),
					title:  title,
					songs:  []
				} ).then( () => {

					alert( 'Added new set!' );

					//TODO
					PouchDB.sync( 'chordboard',
						'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' );

				} );

			}

		} ).catch( err => {
			console.error( err );
		} );

	};

	render( {}, { title } ) {
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
						</div>
						<div class="column">
							<a class="button is-primary"
							   onClick={this.onSaveSet}>Save</a>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default SetEditor;
