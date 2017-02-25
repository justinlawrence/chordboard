import {h, Component} from 'preact';
import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Sections from "./Sections.js";
import Parser from "../parsers/parser.js";
import Title from "./lines/Title.js";
import './Sheet.scss';

class Sheet extends Component {
	constructor( props ) {
		super( props );

		// TODO: Songs should be managed outside of the sheet and the sheet
		// should only have to deal with one song.
		this.songs = requireAll(
			require.context( '../songs', false, /(\.txt|\.onsong)$/ ) );
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

	let parser = new Parser();
	let lines = parser.parse( song );
	let children = [];
	let result = [];
	let section = "";
	let sectionIndex = 0;
	let title = null;
	let artist = null;

	for ( let i = 0; i < lines.length; i++ ) {

		let line = lines[ i ];

		if ( i > 1 && !artist ) {

			console.warn( "parseSong - expected an artist on line 2" );
			artist = "...";

		}

		switch ( lines[ i ].type ) {

			case "artist":
				artist = line.text;
				children.push( <Title text={title} artist={artist}/> );
				children.push( <div id="sections"></div> );
				break;

			case "chord-line":
				children.push( <ChordLine text={line.text}/> );
				break;

			case "chord-mix":

				children.push(
					<ChordPair chords={line.chords} text={line.text}/> );
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
					                      data-section={section}>{children}</section> );
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
				title = line.text;
				break;

		}

	}

	if ( section ) {

		result.push( <section id={"section-" + sectionIndex}
		                      class="section"
		                      data-section={section}>{children}</section> );

	}

	if ( children.length && !section ) {

		result = result.concat( children );

	}

	return result;

}

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}

