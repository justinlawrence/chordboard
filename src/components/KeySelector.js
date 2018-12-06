import React, { PureComponent } from 'react'
import { find, toLower } from 'lodash'

import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import getKeyDiff from '../utils/getKeyDiff'

const options = [
	{ key: 'C', label: 'C', value: 'c' },
	{ key: 'C#', label: 'C#', value: 'c#' },
	{ key: 'D', label: 'D', value: 'd' },
	{ key: 'Eb', label: 'Eb', value: 'eb' },
	{ key: 'E', label: 'E', value: 'e' },
	{ key: 'F', label: 'F', value: 'f' },
	{ key: 'F#', label: 'F#', value: 'f#' },
	{ key: 'G', label: 'G', value: 'g' },
	{ key: 'Ab', label: 'Ab', value: 'ab' },
	{ key: 'A', label: 'A', value: 'a' },
	{ key: 'Bb', label: 'Bb', value: 'bb' },
	{ key: 'B', label: 'B', value: 'b' }
]

const styles = theme => ({
	root: {
		minWidth: theme.spacing.unit * 9
	}
})

class KeySelector extends PureComponent {
	state = {
		value: 'c'
	}

	componentDidMount() {
		this.handleProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.handleProps(nextProps)
	}

	handleChange = event => {
		const value = event.target.value
		const option = find(options, { value })

		this.setState({ value })

		if (this.props.onSelect) {
			this.props.onSelect(option, getKeyDiff(this.props.songKey, option.key))
		}
	}

	handleProps = props => {
		const value = toLower(props.songKey)
		if (value !== this.state.value && find(options, { value })) {
			this.setState({ value })
		}
	}

	render() {
		const { classes, label } = this.props
		const { value } = this.state

		return (
			<TextField
				className={classes.root}
				select
				label={label}
				value={value}
				onChange={this.handleChange}
			>
				{options.map(option => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>
		)
	}
}

export default withStyles(styles)(KeySelector)
