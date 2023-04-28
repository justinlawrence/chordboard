/*
#
#
#
#
#
#
#
#
#   Most of this functionality has been merged into setviewer
#		
#		Mostly just used when creating a new set now
# 		
#		TODO: move across the song.create
#
#
#
#
#
#
*/

import React, { Component } from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Paper from '@mui/material/Paper'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import SetFormContainer from '../containers/SetFormContainer'

const PREFIX = 'SetEditor'

const classes = {
	root: `${PREFIX}-root`,
	form: `${PREFIX}-form`,
	formFooter: `${PREFIX}-formFooter`,
	control: `${PREFIX}-control`,
}

const Root = styled('div')(({ theme }) => ({
	[`& .${classes.root}`]: {
		flexGrow: 1,
	},

	[`& .${classes.form}`]: theme.mixins.gutters({
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
	}),

	[`& .${classes.formFooter}`]: {
		marginTop: theme.spacing(2),
	},

	[`& .${classes.control}`]: {
		padding: theme.spacing(2),
	},
}))

class SetEditor extends Component {
	static propTypes = {
		classes: PropTypes.object,
		history: PropTypes.object,
		// Redux props
		addSet: PropTypes.func.isRequired,
	}

	handleFormCancel = () => {
		if (this.props.history) {
			this.props.history.goBack()
		}
	}

	handleFormSubmit = setData => {
		this.props.addSet(setData)
		this.props.history.goBack()

		/*
		if (this.props.history) {
			this.props.history.push({
				pathname: '/sets',
			})
		}		*/
	}

	render() {
		return (
			<Root className={'set-editor'}>
				<ContentLimiter>
					<Paper className={classes.form}>
						<SetFormContainer
							onCancel={this.handleFormCancel}
							onSubmit={this.handleFormSubmit}
						/>
					</Paper>
				</ContentLimiter>
			</Root>
		)
	}
}

const mapStateToProps = state => ({
	user: state.user,
})

export default connect(mapStateToProps, actions)(SetEditor)
