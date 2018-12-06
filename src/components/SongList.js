import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import InputAdornment from '@material-ui/core/InputAdornment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Magnify as MagnifyIcon } from 'mdi-material-ui'

import ContentLimiter from './ContentLimiter'
import Hero from './Hero'

class SongList extends Component {
	state = {
		searchText: ''
	}

	addToSet = song => {
		window.alert('TODO: move to redux')
		/*db.get(this.props.setId)
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
			});*/
	}

	filterSongs = song => {
		return (
			song.title.toLowerCase().includes(this.state.searchText) ||
			song.content.toLowerCase().includes(this.state.searchText) ||
			song.author.toLowerCase().includes(this.state.searchText)
		)
	}

	handleSearchInput = event => this.setState({ searchText: event.target.value })

	render() {
		const { songs } = this.props
		const { searchText } = this.state

		const filteredSongs = songs.filter(this.filterSongs)
		//const isAddToSet = /\/add-to-set\//.test( path );
		const isAddToSet = /\/add-to-set\//.test(window.location.href)

		return (
			<div>
				<Hero>
					<ContentLimiter>
						<Grid container justify="space-between">
							<Grid item>
								<Typography color="inherit" variant="display1">
									Songs
								</Typography>
							</Grid>

							<Grid item>
								<Grid container alignItems="center" spacing={16}>
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
										<Button
											to="/songs/new"
											component={Link}
											color="primary"
											variant="contained"
										>
											New song
										</Button>
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
						{filteredSongs.map(song => (
							<TableRow key={song.id}>
								<TableCell>
									<Typography variant="title" gutterBottom>
										<a href={`/songs/${song.id}`}>{song.title}</a>
									</Typography>
								</TableCell>

								<Hidden only="xs">
									<TableCell>{song.author}</TableCell>
								</Hidden>

								{isAddToSet && (
									<TableCell>
										<Button
											onClick={() => this.addToSet(song)}
											variant="outlined"
										>
											Add
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		)
	}
}

export default SongList
