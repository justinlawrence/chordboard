import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ContentLimiter from '../../components/ContentLimiter';
import { uniqBy } from 'lodash';
import { db } from 'database';
import Grid from '@material-ui/core/Grid';
import Hero from '../../components/Hero';
import Hidden from '@material-ui/core/Hidden';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Magnify as MagnifyIcon } from 'mdi-material-ui';

class SongList extends Component {
	state = {
		searchText: ''
	};

	addToSet = song => {		
		db.get(this.props.setId)
			.then(doc => {
				const data = Object.assign({}, doc);

				data.songs = data.songs || [];
				data.songs.push({
					_id: song._id,
					key: song.key
				});
				data.songs = uniqBy(data.songs, '_id');

				db.put(data)
					.then(() => {
						if (this.props.history) {
							const location = {
								pathname: `/sets/${doc._id}`
							};

							this.props.history.push(location);
						}
					})
					.catch(err => {
						if (err.name === 'conflict') {
							console.error('SongList.addToSet: conflict -', err);
						} else {
							console.error('SongList.addToSet -', err);
						}
					});
			})
			.catch(err => {
				console.error(err);
			});
	};

	filterSongs = song => {
		return (
			song.title.toLowerCase().includes(this.state.searchText) ||
			song.content.toLowerCase().includes(this.state.searchText) ||
			song.author.toLowerCase().includes(this.state.searchText)
		);
	};

	handleSearchInput = event => {
		this.setState({
			searchText: event.target.value
		});
	};

	render() {
		const { songs } = this.props;
		const { searchText } = this.state;

		//const isAddToSet = /\/add-to-set\//.test( path );
		const isAddToSet = /\/add-to-set\//.test(window.location.href);

		return (
			<div>
				<Hero>
					<ContentLimiter>
						<Grid container justify="space-between">
							<Grid item>
								<Typography variant="display1" color="inherit">
									Songs
								</Typography>
							</Grid>

							<Grid item>
								<Grid container spacing={16} alignItems="center">
									<Grid item>
										<TextField
											color="inherit"
											label="Titles, words, authors"
											onChange={this.handleSearchInput}
											value={searchText}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<MagnifyIcon />
													</InputAdornment>
												)
											}}
										/>
									</Grid>

									<Grid item>
										<Link to="/songs/new">
											<Button color="primary" variant="contained">
												New song
											</Button>
										</Link>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</ContentLimiter>
				</Hero>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Song</TableCell>
							<Hidden only="xs">
								<TableCell>Author</TableCell>
							</Hidden>
							{isAddToSet && <TableCell>Action</TableCell>}
						</TableRow>
					</TableHead>

					<TableBody>
						{songs.filter(this.filterSongs).map((song, i) => (
							<TableRow key={song._id}>
								<TableCell>
									<Typography variant="title" gutterBottom>
										<a href={`/songs/${song._id}`}>{song.title}</a>
									</Typography>
								</TableCell>

								<Hidden only="xs">
									<TableCell>{song.author}</TableCell>
								</Hidden>

								{isAddToSet && (
									<TableCell>
										<Button variant="outlined" onClick={() => this.addToSet(song)}>
											Add
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
}

export default SongList;
