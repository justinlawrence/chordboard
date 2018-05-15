import React, {Component} from 'react';
import {uniqBy} from 'lodash';

import {db} from 'database';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

class SongList extends Component {
	state = {
		searchText: ''
	};

	addToSet = song => {

		db.get( this.props.setId ).then( doc => {

			const data = Object.assign( {}, doc );

			data.songs = data.songs || [];
			data.songs.push( {
				_id: song._id,
				key: song.key
			} );
			data.songs = uniqBy( data.songs, '_id' );

			db.put( data ).then( () => {

				if ( this.props.history ) {

					const location = {
						pathname: `/sets/${doc._id}`
					};

					this.props.history.push( location );
				}

			} ).catch( err => {

				if ( err.name === 'conflict' ) {

					console.error( 'SongList.addToSet: conflict -', err );

				} else {

					console.error( 'SongList.addToSet -', err );

				}

			} );

		} ).catch( err => {
			console.error( err );
		} );

	};

	filterSongs = song => {

		return song.title.toLowerCase().includes(
			this.state.searchText ) || song.content.toLowerCase().includes(
			this.state.searchText ) || song.author.toLowerCase().includes(
			this.state.searchText );

	};

	handleSearchInput = event => {

		this.setState( {
			searchText: event.target.value
		} );

	};

	render() {

		const { songs } = this.props;
		const { searchText } = this.state;



		//const isAddToSet = /\/add-to-set\//.test( path );
		const isAddToSet = /\/add-to-set\//.test( window.location.href );

		return (
			<section className="section">
				<div className="container">
					<div className="columns">

						<div className="column">


							<div className="field has-addons has-addons-right">

								<p className="control has-icons-left">
									<input
										type="text"
										className="input"
										onInput={this.handleSearchInput}
										placeholder="Titles, words, authors"
										value={searchText}/>

									<span className="icon is-small is-left">
					                <i className="fa fa-search"></i>
					            </span>
								</p>
								<p className="control">
									&nbsp;
								</p>

								<p className="control">
									<a href="/songs/new" className="button is-primary">
										New song
									</a>
								</p>

							</div>

							<Table>

								<TableHead>
									<TableRow>
										<TableCell>Song</TableCell>
										<TableCell className="is-hidden-mobile">Author</TableCell>
										<TableCell className="is-hidden-mobile">Key</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>

								{songs.filter( this.filterSongs ).map(
									( song, i ) => (
										<TableRow key={song._id}>


											<TableCell>
												<Typography variant="title" gutterBottom>
													<a href={`/songs/${song._id}`}> {song.title}</a>
												</Typography>
											</TableCell>


											<TableCell className="is-hidden-mobile">
													{song.author}
											</TableCell>



											<TableCell className="is-hidden-mobile">
												<Typography variant="title" gutterBottom>
													{song.key}
												</Typography>
											</TableCell>

											{isAddToSet &&
											<TableCell>
												<button className="button is-primary is-outlined"
												        onClick={() => this.addToSet( song )}>
													<span>Add to set</span>
													<span className="icon is-small">
														<i className="fa fa-chevron-right"></i>
												    </span>
												</button>
											</TableCell>
											}
										</TableRow>
									) )}

								</TableBody>

							</Table>

						</div>

					</div>
				</div>
			</section>
		);

	}
}

export default SongList;
