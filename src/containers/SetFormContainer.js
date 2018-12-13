import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { InlineDatePicker } from 'material-ui-pickers'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon
} from 'mdi-material-ui'

const styles = theme => ({
	root: {}
})

const datePickerIcons = {
	leftArrowIcon: <ChevronLeftIcon />,
	rightArrowIcon: <ChevronRightIcon />
}

class SetFormContainer extends Component {
	static propTypes = {
		classes: PropTypes.object,
		onCancel: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired
	}

	state = {
		newSet: {
			title: '',
			date: null
		}
	}

	handleChange = event => {
		const value = event.target.value
		const name = event.target.name
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, [name]: value }
		}))
	}

	handleDateChange = date =>
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, date }
		}))

	handleClearForm = event => {
		event.preventDefault()
		this.setState({
			newSet: {
				title: '',
				date: ''
			}
		})
	}

	handleFormCancel = event => {
		this.handleClearForm(event)
		this.props.onCancel()
	}

	handleFormSubmit = event => {
		event.preventDefault()
		const setData = this.state.newSet
		// TODO: set validation
		this.props.onSubmit(setData)
	}

	render() {
		const { classes } = this.props
		const { newSet } = this.state
		return (
			<form className={classes.root} onSubmit={this.handleFormSubmit}>
				<TextField
					className={classes.textField}
					name="title"
					label="Set title"
					fullWidth
					margin="normal"
					onChange={this.handleChange}
					value={newSet.title}
				/>

				<InlineDatePicker
					label="Set date"
					format="d MMM yyyy"
					fullWidth
					margin="normal"
					value={newSet.date}
					onChange={this.handleDateChange}
					{...datePickerIcons}
				/>
				{/*<TextField
					type="date"
					className={classes.textField}
					name="date"
					label="Set date"
					fullWidth
					margin="normal"
					onChange={this.handleChange}
					InputLabelProps={{
						shrink: true
					}}
					value={newSet.date}
				/>*/}

				<Grid container justify="flex-end" spacing={8}>
					<Grid item>
						<Button onClick={this.handleFormCancel}>Cancel</Button>
					</Grid>

					<Grid item>
						<Button color="primary" type="submit" variant="contained">
							Save
						</Button>
					</Grid>
				</Grid>
			</form>
		)
	}
}

export default connect(null)(withStyles(styles)(SetFormContainer))
