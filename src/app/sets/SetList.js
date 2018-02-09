import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SetLink from './SetLink';

import './SetList.scss';

class SetList extends Component {
	state = {
		searchText: ''
	};

	componentDidMount() {

		//Set the page title to make it easier to locate
		document.title = 'Setlist';

	}

	filterSets = set => {

		return set.title.toLowerCase().includes( this.state.searchText );

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

							<table className="table is-bordered is-striped is-fullwidth">

								<tbody>

								{sets.filter( this.filterSets ).map( set => (

									<tr key={set._id}>
										<td>
											{set.author}
										</td>
										<td>
											<SetLink setFocusedSet={setFocusedSet} set={set}>
												{set.title}
											</SetLink>
										</td>
									</tr>
								) )}

								</tbody>

							</table>

						</div>

					</div>
				</div>
			</section>
		);

	}
}

export default SetList;
