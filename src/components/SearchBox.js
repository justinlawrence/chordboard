import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/fp/debounce'

import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import { Magnify as MagnifyIcon } from 'mdi-material-ui'

class SearchBox extends PureComponent {
	static defaultProps = {
		placeholder: ''
	}

	static propTypes = {
		onSearch: PropTypes.func.isRequired,
		placeholder: PropTypes.string
	}

	state = {
		query: ''
	}

	handleChange = event => {
		const query = event.target.value
		this.setState({ query })
		this.triggerSearchEvent(query)
	}

	triggerSearchEvent = debounce(200)(this.props.onSearch)

	render() {
		const { placeholder } = this.props
		return (
			<TextField
				onChange={this.handleChange}
				placeholder={placeholder}
				value={this.state.query}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<MagnifyIcon />
						</InputAdornment>
					)
				}}
			/>
		)
	}
}

export default SearchBox
