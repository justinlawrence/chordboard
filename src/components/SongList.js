import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import includes from 'lodash/fp/includes'
import toLower from 'lodash/fp/toLower'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import { lighten } from '@material-ui/core/styles/colorManipulator'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import ContentLimiter from './ContentLimiter'
import Hero from './Hero'
import SearchBox from './SearchBox'

const styles = theme => ({
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			  }
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark
			  },
	tableRow: {
		cursor: 'pointer'
	}
})

class SongList extends Component {
	state = {
		searchText: ''
	}

	handleSongClick = song => {
		window.alert('TODO: redirect to the song URL')
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
		const contains = includes(toLower(this.state.searchText))
		return (
			contains(toLower(song.title)) ||
			contains(toLower(song.content)) ||
			contains(toLower(song.author))
		)
	}

	handleSearch = searchText => this.setState({ searchText })

	render() {
		const { songs } = this.props

		const filteredSongs = songs.filter(this.filterSongs)
		//const isAddToSet = /\/add-to-set\//.test( path );
		const isAddToSet = /\/add-to-set\//.test(window.location.href)

		return (
			<div>
				<Hero>
					<ContentLimiter>
						<Grid container alignItems="center" justify="space-between">
							<Grid item>
								<Typography variant="h4">Songs</Typography>
							</Grid>

							<Grid item>
								<Grid container alignItems="center" spacing={16}>
									<Grid item>
										<SearchBox
											onSearch={this.handleSearch}
											placeholder="Titles, words, authors"
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
							<TableRow hover key={song.id} classes={styles.tableRow}>
								<TableCell>
									<Typography variant="h6" gutterBottom>
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

// export default SongList
export default withStyles(styles)(SongList)
