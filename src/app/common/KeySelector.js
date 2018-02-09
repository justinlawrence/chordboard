import React, { Component } from 'react';

import getKeyDiff from 'app/common/getKeyDiff';

class KeySelector extends Component {
	handleChange = event => {
		if ( this.props.onSelect ) {
			this.props.onSelect( event.target.value,
				getKeyDiff( this.props.value, event.target.value ) );
		}
	};

	render() {
		const { value } = this.props;

		return (
			<div className="control is-primary">
				<div className="select">
					<select onChange={this.handleChange} value={value}>
						<option value="C">C</option>
						<option value="C#">C#</option>
						<option value="Db">Db</option>
						<option value="D">D</option>
						<option value="D#">D#</option>
						<option value="Eb">Eb</option>
						<option value="E">E</option>
						<option value="F">F</option>
						<option value="F#">F#</option>
						<option value="Gb">Gb</option>
						<option value="G">G</option>
						<option value="G#">G#</option>
						<option value="Ab">Ab</option>
						<option value="A">A</option>
						<option value="A#">A#</option>
						<option value="Bb">Bb</option>
						<option value="B">B</option>
						<option value="C">C</option>
						<option value="C#">C#</option>
						<option value="Db">Db</option>
						<option value="D">D</option>
						<option value="D#">D#</option>
						<option value="Eb">Eb</option>
						<option value="E">E</option>
						<option value="F">F</option>
						<option value="F#">F#</option>
						<option value="Gb">Gb</option>
						<option value="G">G</option>
						<option value="G#">G#</option>
						<option value="Ab">Ab</option>
						<option value="A">A</option>
						<option value="A#">A#</option>
						<option value="Bb">Bb</option>
						<option value="B">B</option>
						<option value="C">C</option>
					</select>
				</div>
			</div>
		);

	}
}

export default KeySelector;
