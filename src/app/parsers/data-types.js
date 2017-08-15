const ENDS_WITH_COLON = /:$/;
const SURROUNDED_BY_SQUARE_BRACKETS = /\]$/;

const dataTypes = {
	chordLine:       {
		type: "chord-line",
		test: line => isChords( line )
	},
	chordPair:       {
		type: "chord-pair",
		test: ( line, prevLine ) => {

			return prevLine && isChords( prevLine ) && !isChords( line );

		}
	},
	empty:           {
		type: "empty",
		test: line => line.trim() === ""
	},
	line:            {
		type: "line",
		test: line => !!line
	},
	section:         {
		type:      "section",
		formatter: line => line.replace( ENDS_WITH_COLON, "" ),
		test:      line => ENDS_WITH_COLON.test( line )
	},
	sectionbrackets: {
		type:      "section",
		formatter: line => line.replace( /\[|\]/g, "" ),
		test:      line => SURROUNDED_BY_SQUARE_BRACKETS.test( line )
	}
};

export default dataTypes;

function isChords( input ) {

	let output = input.replace(
		/(\s|[A-G](#|b)?|m|[0-9]|(sus|maj|min|aug|dim|add)\d?|\/|-|\|)/g, "" );

	return !(output);

}