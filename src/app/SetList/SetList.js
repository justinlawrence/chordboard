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
									<a href="/sets/new" class="button is-primary">
										New set
									</a>
								</p>

							</div>

							<table class="table is-bordered is-striped is-fullwidth">

								<tbody>

								{sets.filter( this.filterSets ).map( set => (
									<tr>
										<td>
											<a href={`/sets/${set.slug}`}>
												{set.title}
											</a>
										</td>
										<td>
											{set.author}
										</td>
										<td>
											{set.key}
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
