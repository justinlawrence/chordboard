const SAMPLE = `Intro
[A /// //// D /// ////]
[A /// //// D /// ////]

Verse 1
[A]  There's nothing worth more, that will ever come [D]close
No thing can compare, You're our living [A]hope
Your Presence [D]Lord

Verse 2
[A]  I've tasted and seen, of the sweetest of [D]loves
Where my heart becomes free, and my shame is und[A]one
In Your Presence [D]Lord

Chorus 
[A]Holy Spirit You are welcome here
Come [D]flood this place and fill the [Bm]atmosphere
Your [A]Glory God is what our hearts long for
To be [D]overcome by Your [Bm]Presence Lord

Interlude
[A /// //// D /// Bm ///]

REPEAT VERSE 1
REPEAT VERSE 2
REPEAT CHORUS 2X

Interlude
[A /// //// D /// Bm ///]
[A /// //// D /// Bm ///]

Bridge
[A]Let us become more aware of Your Presence
Let us experience the Glory of Your Goodness

[D]  Let us be[A/C#]come more a[Bm]ware of Your [A/C#]Presence
[D]  Let us exp[A/C#]erience the [Bm]Glory of Your [A/C#]Goodness
 X3 
[D]Lord

REPEAT CHORUS DOWN`;

export default function chordproParser( text ) {

	const lines = text ? text.split( /\n/ ) : [];
	let result = '';

	lines.forEach( line => {

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

		result += `${chordLine}\n`;
		result += `${textLine}\n`;

	} );

	return result;

}

/*if ( module.hot ) {

	console.log( SAMPLE );
	console.log( '--------------------------------------------------------------------------' );
	console.log( chordproParser( SAMPLE ) );

}*/

