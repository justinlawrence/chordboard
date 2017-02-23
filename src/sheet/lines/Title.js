import {h} from "preact";

export default ( { artist, text } ) => {

	return (
		<div class="title">
			{ text }
			<span class="artist">{ artist }</span>
		</div>
	);

};