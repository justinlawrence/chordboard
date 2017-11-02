import './song-key.scss';

/*

TODO: brett please could you add a selected element so that the correct key is shown here. thanks!
*/
const SongKey = ({ value }) => (

	<div class="control is-primary">
		<div class="select">
			<select>
				<option value = "Ab">Ab</option>
				<option value = "A">A</option>
				<option value = "A#">A#</option>
				<option value = "Bb">Bb</option>
				<option value = "B">B</option>
				<option value = "C">C</option>
				<option value = "C#">C#</option>
				<option value = "Db">Db</option>
				<option value = "D">D</option>
				<option value = "D#">D#</option>
				<option value = "Eb">Eb</option>
				<option value = "E">E</option>
				<option value = "F">F</option>
				<option value = "F#">F#</option>
				<option value = "Gb">Gb</option>
				<option value = "G">G</option>
				<option value = "G#">G#</option>
			</select>
		</div>

		<div className="song-key">
			{value}
		</div>
	</div>
);

export default SongKey;
