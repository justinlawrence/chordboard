import React from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'

import SetEditor from '../components/SetEditor'
import Sets from '../components/Sets'
import SetContainer from '../containers/SetContainer'
import { useAllSets } from '../data/hooks'

const SetListContainer = () => {
	const history = useHistory()
	const { data: sets } = useAllSets()

	const handleSetCurrentSetId = setId => {
		history.push(`/sets/${setId}`)
	}

	return (
		<div>
			<Switch>
				<Route
					exact
					path={'/sets'}
					render={props => (
						<Sets
							setCurrentSetId={handleSetCurrentSetId}
							sets={sets}
							{...props}
						/>
					)}
				/>
				<Route exact path={'/sets/new'} component={SetEditor} />
				<Route
					path={'/sets/:setId'}
					render={props => (
						<SetContainer
							setId={props.match.params.setId}
							{...props}
						/>
					)}
				/>
			</Switch>
		</div>
	)
}

export default SetListContainer
