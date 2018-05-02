import React, { Component } from 'react';
import { connect } from 'react-redux';
import slugify from 'slugify';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import './SetEditor.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SetEditor extends Component {
	state = {
		title: ''
	};

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	onSaveSet = () => {

		const { user } = this.props;
		const { title } = this.state;

		db.post( {
			type: 'set',
			author: user.name,
			slug: slugify( title ),
			title: title,
			songs: []
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

	render() {

		//JL TODO: props was {}, not sure whether it should be below
		const { title } = this.state;

		return (
			<section className="section">
				<div className="container">
					<div className="columns">
						<div className="column is-three-quarters">
							<div className="field">
								<p className="control has-icons-left">

									<input
										type="text"
										className="input"
										onInput={this.onTitleInput}
										placeholder="Title"
										value={title}/>

									<span className="icon is-small is-left">
						                <i className="fa fa-chevron-right"/>
						            </span>

								</p>
							</div>
						</div>
						<div className="column">
							<a className="button is-primary"
							   onClick={this.onSaveSet}>Save</a>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect( mapStateToProps )( SetEditor );
