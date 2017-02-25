const ENDS_WITH_COLON = /:$/;

const artist = {
	type:      "artist",
	formatter: line => line.replace( /{(?:st|subtitle):\s?(.+?)}/g, "$1" ),
	test:      ( line, prevLine, i ) => i === 1
};

const chordLine = {
	type: "chord-line",
	test: line => isChords( line )
};

const chordMix = {
	type: "chord-mix",
	test: line => containsChords( line )
};

const chordPair = {
	type: "chord-pair",
	test: ( line, prevLine ) => {

		return prevLine && isChords( prevLine ) && !isChords( line );

	}
};

const empty = {
	type: "empty",
	test: line => line.trim() === ""
};

const line = {
	type: "line",
	test: line => !!line
};

const section = {
	type:      "section",
	formatter: line => line.replace( ENDS_WITH_COLON, "" ),
	test:      line => ENDS_WITH_COLON.test( line )
};

const title = {
	type:      "title",
	formatter: line => line.replace( /{(?:t|title):\s?(.+?)}/g, "$1" ),
	test:      ( line, prevLine, i ) => i === 0
};

class Parser {
	constructor() {

		this.checks = [
			empty,
			title,
			artist,
			chordPair,
			chordMix,
			section,
			chordLine,
			line
		];

	}

	clean( line ) {

		// White-list a bunch of characters so we can clean out any invisible
		// characters.
		return line.replace(
			/[^a-zA-Z0-9+-._,:<>/?'"+=%@#!$%*&();\s\r\n\t{}\[\]\\]/g, "" );

	}

	parse( file ) {

		let cleanFile = this.clean( file );
		let prevLine = null;
		let lines = cleanFile.split( "\n" );
		let output = [];

		lines.forEach( ( line, i ) => {

			for ( let j = 0, len = this.checks.length; j < len; j++ ) {

				let check = this.checks[ j ];

				if ( check.test( line, prevLine, i ) ) {

					let text = line;
					let chords = null;

					if ( check.formatter ) {

						text = check.formatter( text );

					}

					if ( check.type === "chord-pair" ) {

						output.pop();
						chords = prevLine;

					}

					if ( check.type === "chord-mix" ) {

						let chord = false;
						let chordLine = "";
						let textLine = "";

						for ( let i = 0, len = line.length; i < len; i++ ) {

							if ( line[ i ] === "[" ) {

								chord = true;

							} else if ( line[ i ] === "]" ) {

								chord = false;

							} else if ( chord ) {

								chordLine += line[ i ];

							} else {

								textLine += line[ i ];

								if ( textLine.length > chordLine.length ) {

									chordLine += " ";

								}

							}

						}

						chords = chordLine;
						text = textLine;

						console.log( chords );
						console.log( text );


					}

					output.push( {
						chords,
						type: check.type,
						text
					} );

					break;

				}

			}

			prevLine = line;

		} );

		return output;

	}
}

export default Parser;

function containsChords( input ) {

	return /\[.*?\]/g.test( input );

}

function isChords( input ) {

	let output = input.replace(
		/(\s|[A-G](#|b)?m?|(sus|maj|min|aug|dim|add)\d?|\/|-|\|)/g, "" );

	return !(output);

}