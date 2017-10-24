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

		db.post( {
			type:   'set',
			author: 'justin',
			slug:   slugify( title ),
			title:  title,
			songs:  []
		} ).then( doc => {

			PouchDB.sync( 'chordboard',
				'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' );

			if ( this.props.history ) {
				this.props.history.push( {
					pathname: `/sets/${doc.id}`
				} );
			}

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
