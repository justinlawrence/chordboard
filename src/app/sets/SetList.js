import {Link} from 'react-router-dom';
import SetLink from './SetLink';

import './SetList.scss';

class SetList extends PreactComponent {
	state = {
		searchText: ''
	};

	filterSets = set => {

		return set.title.toLowerCase().includes( this.state.searchText );

	};

	handleSearchInput = event => {

		this.setState( {
			searchText: event.target.value
		} );

	};

	render( { sets = [] }, { searchText } ) {

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
									<Link to="/sets/new" class="button is-primary">
										New set
									</Link>
								</p>

							</div>

							<table className="table is-bordered is-striped is-fullwidth">

								<tbody>

								{sets.filter( this.filterSets ).map( set => (
									<tr>
										<td>
											<SetLink set={set}>
												{set.title}
											</SetLink>
										</td>
										<td>
											{set.author}
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
