import React, { PureComponent } from 'react'
import { styled } from '@material-ui/core/styles';
import { find, toLower } from 'lodash'

import withStyles from '@mui/styles/withStyles';
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

import getKeyDiff from '../utils/getKeyDiff'

const PREFIX = 'KeySelector';

const classes = {
    root: `${PREFIX}-root`
};

const StyledTextField = styled(TextField)((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
		minWidth: theme.spacing(9),
	}
}));

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
	{ key: 'B', label: 'B', value: 'b' },
]

class KeySelector extends PureComponent {
	state = {
		value: 'c',
	}

	componentDidMount() {
		this.handleProps(this.props)
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.handleProps(nextProps)
	}

	handleChange = event => {
		const value = event.target.value
		const option = find(options, { value })

		this.setState({ value })

		if (this.props.onSelect) {
			this.props.onSelect(
				option,
				getKeyDiff(this.props.songKey, option.key)
			)
		}
	}

	handleProps = props => {
		const value = toLower(props.songKey)
		if (value !== this.state.value && find(options, { value })) {
			this.setState({ value })
		}
	}

	render() {
		const {  label } = this.props
		const { value } = this.state

		return (
            <StyledTextField
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
			</StyledTextField>
        );
	}
}

export default (KeySelector)
