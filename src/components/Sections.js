import React from 'react';

export default ( { onClick, sections } ) => {

	let children = [];

	sections.forEach( ( section, index ) => {

		children.push(

			<a onClick={onClick.bind( this, section )}>
				{section.title}
			</a>

		);

		if ( index < sections.length - 1 ) {
			children.push( <span className="separator">&nbsp;</span> );
		}


	} );

	return <div className="level-item">{ children }</div>;

};
