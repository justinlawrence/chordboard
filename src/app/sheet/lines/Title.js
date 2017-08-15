import {h} from "preact";

export default ( { author, text } ) => {

	return (
		<div class="title">
			{text}
			<span class="author">{author}</span>
		</div>
	);

};