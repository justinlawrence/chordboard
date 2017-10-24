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
			<section class="section">
				<div class="container">
					<div class="columns">

						<div class="column is-three-quarters">

							<div class="field has-addons has-addons-right">
								<p class="control has-icons-left">
									<input
										type="text"
										class="input"
										onInput={this.handleSearchInput}
										placeholder="Titles, authors"
										value={searchText}/>

									<span class="icon is-small is-left">
							            <i class="fa fa-search"></i>
							        </span>
								</p>

								<p class="control">
									&nbsp;
								</p>

								<p class="control">
									<Link to="/sets/new" class="button is-primary">
										New set
									</Link>
								</p>

							</div>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>

								{sets.filter( this.filterSets ).map( set => (
									<tr>
										<td>
											<Link to={`/sets/${set._id}`}>
												{set.title}
											</Link>
										</td>
										<td>
											{set.author}
										</td>
										<td>
											<SetLink set={set}>Live</SetLink>
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
