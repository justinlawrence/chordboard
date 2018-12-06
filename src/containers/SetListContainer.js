import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import reduce from 'lodash/fp/reduce'

import * as actions from '../redux/actions'
import SetEditor from '../components/SetEditor'
import SetList from '../components/SetList'
import SetContainer from '../containers/SetContainer'

class SetListContainer extends Component {
	render() {
		const { setFocusedSet, sets } = this.props
		return (
			<div>
				<Switch>
					<Route
						exact
						path="/sets"
						render={props => (
							<SetList setFocusedSet={setFocusedSet} sets={sets} {...props} />
						)}
					/>
					<Route exact path="/sets/new" component={SetEditor} />
					<Route
						path="/sets/:setId"
						render={props => (
							<SetContainer setId={props.match.params.setId} {...props} />
						)}
					/>
				</Switch>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	sets: reduce((acc, song) => {
		acc.push(song)
		return acc
	})([])(state.sets.byId)
})

export default connect(
	mapStateToProps,
	actions
)(SetListContainer)
