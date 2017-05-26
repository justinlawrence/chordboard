/*
if ( check.type === "chord-mix" ) {

						let chord = false;
						let chordLine = "";
						let textLine = "";

						for ( let i = 0, len = line.length; i < len; i++ ) {

							// Onsong specific.
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

					}
 */