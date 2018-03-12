import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { Sets, db, sync } from 'database';
import SetEditor from './SetEditor';
import SetList from './SetList';
import SetContainer from './SetContainer';

class SetListContainer extends Component {
	state = {
		setList: []
	};

	componentDidMount() {

		// Update an initial list when the component mounts.
		this.updateListOfSets();

		// Listen for any changes on the database.
		sync.on( "change", this.updateListOfSets.bind( this ) );

	}

	componentWillUnmount() {
		sync.cancel();
	}

	updateListOfSets = () => Sets.getAll().then( setList => this.setState( { setList } ) );

	render() {

		const { setFocusedSet } = this.props;
		const { setList } = this.state;

		return (
			<div>
				<Route exact path="/sets" render={props => (
					<SetList setFocusedSet={setFocusedSet} sets={setList} {...props}/>
				)}/>
				<Route exact path="/sets/new" component={SetEditor}/>
				<Route path="/sets/:setId" render={props => (
					<SetContainer setId={props.match.params.setId} {...props}/>
				)}/>
			</div>
		);

	}
}

export default SetListContainer;
