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
#		TODO: move across the song.create
#
#
#
#
#
#
*/

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { format } from 'date-fns'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import * as actions from '../redux/actions'
import ContentLimiter from './ContentLimiter'
import Hero from './Hero'
import SetFormContainer from '../containers/SetFormContainer'

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	form: theme.mixins.gutters({
		maxWidth: theme.spacing.keyline * 8,
		paddingBottom: theme.spacing.unit * 2,
		paddingTop: theme.spacing.unit * 2
	}),
	formFooter: {
		marginTop: theme.spacing.unit * 2
	},
	control: {
		padding: theme.spacing.unit * 2
	}
})

class SetEditor extends Component {
	static propTypes = {
		classes: PropTypes.object,
		history: PropTypes.object,
		// Redux props
		addSet: PropTypes.func.isRequired
	}

	handleFormCancel = () => {
		if (this.props.history) {
			this.props.history.goBack()
		}
	}

	handleFormSubmit = setData => {
		this.props.addSet({
			title: setData.title,
			setDate: format(setData.date, 'yyyy-MM-dd')
		})
		if (this.props.history) {
			this.props.history.push({
				pathname: '/sets'
			})
		}
	}

	render() {
		const { classes } = this.props

		return (
			<div className="set-editor">
				<Hero>
					<ContentLimiter>
						<Paper className={classes.form}>
							<SetFormContainer
								onCancel={this.handleFormCancel}
								onSubmit={this.handleFormSubmit}
							/>
						</Paper>
					</ContentLimiter>
				</Hero>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.user
})

export default connect(
	mapStateToProps,
	actions
)(withStyles(styles)(SetEditor))
