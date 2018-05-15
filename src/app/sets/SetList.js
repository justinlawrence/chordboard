import React, {Component} from 'react';
import DateSignifier from '../../components/DateSignifier';
import {Link} from 'react-router-dom';
import SetLink from './SetLink';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { withStyles } from 'material-ui/styles';

class SetList extends Component {
	state = {
		searchText: ''
	};

	componentDidMount() {

		//Set the page title to make it easier to locate
		document.title = 'Setlists';

	}

	filterSets = set => {

		return set.title.toLowerCase().includes( this.state.searchText ) || set.author.toLowerCase().includes( this.state.searchText );

	};

	handleSearchInput = event => {

		this.setState( {
			searchText: event.target.value
		} );

	};

	render() {

		const { setFocusedSet, sets = [] } = this.props;
		const { searchText } = this.state;

		return (
			<section className="section">
				<div className="container">
					<div className="columns">

						<div className="column is-three-quarters">

							<div className="field has-addons has-addons-right">
								<p className="control has-icons-left">
									<input
										type="text"
										className="input"
										onInput={this.handleSearchInput}
										placeholder="Titles, authors"
										value={searchText}/>

									<span className="icon is-small is-left">
							            <i className="fa fa-search"/>
							        </span>
								</p>

								<p className="control">
									&nbsp;
								</p>

								<p className="control">
									<Link to="/sets/new" className="button is-primary">
										New set
									</Link>
								</p>

							</div>

							<Table>
								
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Set</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>

								{sets.filter( this.filterSets ).map( set => (

									<TableRow key={set._id}>

										<TableCell>
											<DateSignifier date={set.setDate}/>
										</TableCell>

										<TableCell>

											<SetLink setFocusedSet={setFocusedSet} set={set}>

												<Typography variant="title" gutterBottom>
														{set.title}
												</Typography>

												<Typography gutterBottom>
													{set.author}
												</Typography>

											</SetLink>

										</TableCell>

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

export default SetList;
