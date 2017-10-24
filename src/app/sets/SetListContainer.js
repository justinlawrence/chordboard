import {Route} from 'react-router-dom';

import {db, sync} from '../common/database';
import SetEditor from './SetEditor';
import SetList from './SetList';
import SetContainer from './SetContainer';

class SetListContainer extends PreactComponent {
	state = {
		setList: []
	};

	componentDidMount() {

		// Update an initial list when the component mounts.
		this.updateListOfSets();

		// Listen for any changes on the database
		sync.on( "change", () => {
			this.updateListOfSets();
		} );

	}

	updateListOfSets = () => {

		this._getListOfSets().then( setList => {

			this.setState( { setList } );

		} );

	};

	render( props, { setList } ) {
		return (
			<div>
				<Route exact path="/sets" render={props => (
					<SetList sets={setList} {...props}/>
				)}/>
				<Route exact path="/sets/new" component={SetEditor}/>
				<Route path="/sets/:id" render={props => (
					<SetContainer id={props.match.params.id} {...props}/>
				)}/>
			</div>
		);

	}

	_getListOfSets = () => {

		// This gets all sets
		return db.find( {
			selector: {
				type: 'set'
			}
		} )
			.then( result => result.docs )
			.catch( err => {

				console.warn( 'App.constructor - pouchdb query failed: _getListOfSets', err );

			} );

	};
}

export default SetListContainer;