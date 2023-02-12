import React, { Component } from 'react'
import { styled } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { format } from 'date-fns'

import { Button, Grid, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

const PREFIX = 'SetFormContainer'

const classes = {
	deleteButton: `${PREFIX}-deleteButton`,
}

const Root = styled('form')(({ theme }) => ({
	[`& .${classes.deleteButton}`]: {
		color: theme.palette.error.main,
	},
}))

const modes = {
	NEW: 'new',
	EDIT: 'edit',
}

class SetFormContainer extends Component {
	static defaultProps = {
		initialValues: {
			author: '',
			setDate: null,
			title: '',
			venue: '',
		},
	}

	static propTypes = {
		initialValues: PropTypes.shape({
			author: PropTypes.string,
			setDate: PropTypes.object,
			title: PropTypes.string,
			venue: PropTypes.string,
		}),
		isEdit: PropTypes.bool,
		onCancel: PropTypes.func.isRequired,
		onDelete: PropTypes.func,
		onSubmit: PropTypes.func.isRequired,
	}

	state = {
		mode: this.props.isEdit ? modes.EDIT : modes.NEW,
		newSet: {
			author: this.props.initialValues.author,
			setDate: this.props.initialValues.setDate || new Date(),
			title: this.props.initialValues.title,
			venue: this.props.initialValues.venue,
		},
	}

	handleChange = event => {
		const value = event.target.value
		const name = event.target.name
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, [name]: value },
		}))
	}

	handleDateChange = date =>
		this.setState(prevState => ({
			newSet: { ...prevState.newSet, setDate: date },
		}))

	handleClearForm = event => {
		event.preventDefault()
		this.setState({
			newSet: {
				author: '',
				setDate: '',
				title: '',
				venue: '',
			},
		})
	}

	handleFormCancel = event => {
		this.handleClearForm(event)
		this.props.onCancel()
	}

	handleFormDelete = event => {
		this.handleClearForm(event)
		this.props.onDelete()
	}

	handleFormSubmit = event => {
		event.preventDefault()
		const setData = this.state.newSet
		// TODO: set validation
		this.props.onSubmit(setData)
	}

	render() {
		const { newSet } = this.state
		const currentDate = format(new Date(), 'd MMM yyyy')

		return (
			<Root onSubmit={this.handleFormSubmit}>
				<Grid container spacing={1}>
					<Grid item xs={12} lg={6}>
						<TextField
							name={'title'}
							label={'Agregar titulo'}
							fullWidth
							margin={'normal'}
							onChange={this.handleChange}
							value={newSet.title}
						/>
					</Grid>

					<Grid item xs={12} lg={6}>
						<DatePicker
							inputFormat={'d MMM yyyy'}
							// invalidDateMessage={`Invalid Date Format (eg. ${currentDate})`}
							onChange={this.handleDateChange}
							value={newSet.setDate}
							renderInput={props => (
								<TextField
									fullWidth
									label={'Agregar fecha'}
									margin={'normal'}
									{...props}
								/>
							)}
						/>
					</Grid>

					<Grid item xs={12} lg={6}>
						<TextField
							name={'author'}
							label={'Agregar autor'}
							fullWidth
							margin={'normal'}
							onChange={this.handleChange}
							value={newSet.author}
						/>
					</Grid>

					<Grid item xs={12} lg={6}>
						<TextField
							name={'venue'}
							label={'Extras'}
							fullWidth
							margin={'normal'}
							onChange={this.handleChange}
							value={newSet.venue}
						/>
					</Grid>
					{this.props.isEdit && (
						<Grid item xs={6} lg={10}>
							<Button
								className={classes.deleteButton}
								onClick={this.handleFormDelete}
							>
								Eliminar cancionero
							</Button>
						</Grid>
					)}

					<Grid item xs={6} lg={2}>
						<Button onClick={this.handleFormCancel}>Cancelar</Button>

						<Button
							color={'primary'}
							type={'submit'}
							variant={'contained'}
						>
							Guardar
						</Button>
					</Grid>
				</Grid>
			</Root>
		)
	}
}

export default SetFormContainer
