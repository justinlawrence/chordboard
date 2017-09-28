import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import './SetViewer.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SetViewer extends PreactComponent {
	state = {
		isLoading: false,
		set:       null,
		songs:     []
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		if ( props.slug ) {

			this.setState( {
				isLoading: true
			} );

			db.find( {
				selector: {
					type: 'set',
					slug: props.slug
				}
			} ).then( result => {

				const set = result.docs[ 0 ];

				if ( set.songs && set.songs.length ) {

					this.setState( {
						isLoading: true
					} );

					db.allDocs( {
						include_docs: true,
						keys:         set.songs
					} ).then( result => {

						this.setState( {
							isLoading: false,
							songs:     result.rows.map(r => r.doc) || []
						} );

					} ).catch( err => {

						console.error( 'SetViewer.handleProps - fetching songs',
							err );

						this.setState( {
							isLoading: false,
							set:       null
						} );

					} );

				}

				this.setState( {
					isLoading: false,
					set:       set
				} );

			} ).catch( err => {

				console.error( 'SetViewer.handleProps -', err );

				this.setState( {
					isLoading: false,
					set:       null
				} );

			} );

		}

	};

	onDeleteSet = () => {
		alert("Sorry, you can't delete sets yet.");
		/*
		if (alert("Are you very sure you want to delete this song?")) {
			//TODO: delete from pouchDb and refresh to song list with a message saying song deleted
		};

		href={`/sets`}
		*/
	};

	onMoveSongUp = () => {
		alert("going up!");
	}
/*
	Array.prototype.move = function (old_index, new_index) {
	    if (new_index >= this.length) {
	        var k = new_index - this.length;
	        while ((k--) + 1) {
	            this.push(undefined);
	        }
	    }
	    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	    return this; // for testing purposes
	};
*/

	render( {}, { songs, set } ) {
		return (
			<section class="set-viewer section">
				<div class="container">
					<div class="columns">
						<div class="column is-three-quarters">

							<nav class="level">

								<div class="level-left">

									<div class="level-item">
										<p class="subtitle is-5">
											<strong>{set && set.title}</strong>
										</p>
									</div>
								</div>

								<div class="level-right">
									<p class="level-item">
										{set &&
										<a class="button is-primary"
										   href={`/songs/add-to-set/${set.slug}`}>Add songs</a>}
									</p>
									<p class="level-item">
										{set &&
										<a class="button is-outlined" onClick={this.onDeleteSet}>
											 <span class="icon is-small is-left">
		 						                <i class="fa fa-trash"></i>
		 						      </span>

										 </a>}
									</p>
								</div>
							</nav>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>
									{songs.length ?
										songs.map( song => (
											<tr>
												<td>
													<a href={`/songs/${song.slug}`}>
														{song.title}
													</a>
												</td>
												<td>
													<a onClick={this.onMoveSongUp} >
														<span class="icon is-small is-left">
		 		 						                <i class="fa fa-arrow-up"></i>
		 		 						      </span>
													</a>
												</td>
											</tr>
										) )
										:
										<div>
										<h1>This set has no songs</h1>
										<p>Add some by clicking Add Songs above</p>
										</div>
									}
								</tbody>

							</table>

						</div>

					</div>
				</div>
			</section>
		);
	}
}

export default SetViewer;
