import {h} from "preact";

export default ( { onClick, sections } ) => {

	let children = [];

	sections.forEach( ( section, index ) => {

		children.push(
			<a onClick={onClick.bind( this, section )}>
				{section.title}
			</a>
		);

		if ( index < sections.length - 1 ) {
			children.push( <span class="separator">&nbsp;</span> );
		}


	} );

	return <div class="sections">{ children }</div>;

};
