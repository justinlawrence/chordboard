import {h, Component} from 'preact';
import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Sections from "./Sections.js";
import Title from "./lines/Title.js";
import './Sheet.scss';

class Sheet extends Component {
	constructor( props ) {
		super( props );

		// TODO: Songs should be managed outside of the sheet and the sheet
		// should only have to deal with one song.
		this.songs = requireAll(
			require.context( '../songs', false, /\.txt$/ ) );
		this.state = {
			currentIndex: 0
		};

	}

	// TODO: Move sheet changing functionality outside of sheet
	nextSheet() {

		let currentIndex = this.state.currentIndex + 1;
		currentIndex = Math.min( this.songs.length - 1, currentIndex );

		this.setState( { currentIndex } );

	}

	// TODO: Move sheet changing functionality outside of sheet
	prevSheet() {

		let currentIndex = this.state.currentIndex - 1;
		currentIndex = Math.max( 0, currentIndex );

		this.setState( { currentIndex } );

	}

	scrollToSection( section ) {

		let totalVertPadding = 32;
		let headerHeight = 92;

		location.href = "#";
		location.href = "#section-" + section.index;

		let scrollBottom = window.innerHeight - document.body.scrollTop + totalVertPadding;

		if ( headerHeight < scrollBottom ) {

			// Go back 92 pixels to offset the header.
			window.scrollBy( 0, -headerHeight );

		}

	}

	render( props, { currentIndex } ) {

		let sections = [];

		return (
			<div>
				<a class="prev-button"
				   onClick={this.prevSheet.bind( this )}>&lt;</a>
				<div class="sheet">
					<Sections sections={sections}
					          onClick={this.scrollToSection.bind( this )}/>
					{parseSong( this.songs[ currentIndex ], sections )}
				</div>
				<a class="next-button"
				   onClick={this.nextSheet.bind( this )}>&gt;</a>
			</div>
		);

	}
}

export default Sheet;

//-----------------------------------------------------

function parseSong( song, sections ) {

	let lines = parseLines( song );
	let children = [];
	let result = [];
	let section = "";
	let sectionIndex = 0;

	for ( let i = 0; i < lines.length; i++ ) {

		let line = lines[ i ];

		switch ( lines[ i ].type ) {

			case "chord-line":
				children.push( <ChordLine text={line.text}/> );
				break;

			case "chord-pair":
				children.push(
					<ChordPair chords={line.chords} text={line.text}/> );
				break;

			case "empty":
				children.push( <div class="empty-line"></div> );
				break;

			case "line":
				children.push( <Line text={line.text}/> );
				break;

			case "section":

				if ( section ) {

					// Finish off last section
					result.push( <section id={"section-" + sectionIndex}
					                      class="section"
					                      data-section={section}>{children}</section>);
					children = [];

				} else {

					result = result.concat( children );

				}

				section = line.text;
				sections.push( {
					title: line.text,
					index: sectionIndex
				} );

				sectionIndex++;

				break;

			case "title":
				children.push( <Title text={line.text} artist={line.artist}/> );
				children.push( <div id="sections"></div> );
				break;

		}

	}

	if ( section ) {

		result.push( <section id={"section-" + sectionIndex}
		                      class="section"
		                      data-section={section}>{children}</section> );

	}

	return result;

}

function parseLines( input ) {

	let ENDS_WITH_COLON = /:$/;
	let SQUARE_BRACKET = /^\[(.*)\]$/;
	let lines = input.split( "\n" );
	let prevLine = "";
	let output = [];

	for ( let i = 0; i < lines.length; i++ ) {

		let line = lines[ i ];

		if ( line.trim() === "" ) {

			output.push( {
				type: "empty",
				text: line
			} );

		} else if ( prevLine && isChords( prevLine ) && !isChords( line ) ) {

			// Remove previous line from output because we want it to be
			// attached to the current line.
			output.pop();
			output.push( {
				type:   "chord-pair",
				chords: prevLine,
				text:   line
			} );

		} else {

			if ( i === 0 ) {

				output.push( {
					type: "title",
					text: line
				} );

			} else if ( i === 1 ) {

				output[ 0 ].artist = line;

			} else if ( ENDS_WITH_COLON.test( line ) ) {

				output.push( {
					type: "section",
					text: line.replace( ENDS_WITH_COLON, "" )
				} );

			} else if ( SQUARE_BRACKET.test( line ) ) {

				output.push( {
					type: "section",
					text: line.replace( SQUARE_BRACKET, "$1" )
				} );

			} else if ( isChords( line ) ) {

				output.push( {
					type: "chord-line",
					text: line
				} );

			} else {

				output.push( {
					type: "line",
					text: line
				} );

			}

		}

		prevLine = line;

	}

	return output;

}

function isChords( input ) {

	let output = input.replace(
		/(\s|[A-G](#|b)?m?|(sus|maj|min|aug|dim|add)\d?|\/|-|\|)/g,
		"" );

	return !(output);

}

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}

