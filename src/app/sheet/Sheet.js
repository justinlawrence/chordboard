import {h, Component} from 'preact';
import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Sections from "./Sections.js";
import Parser from "../parsers/parser.js";
import Title from "./lines/Title.js";
import './Sheet.scss';

class Sheet extends Component {
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

	render( { song } ) {

		let sections = [];

		return (
			<div class="sheet">
				<div class="sheet-header">
				<Title text={song.title} artist={song.artist}/>
				<Sections sections={sections}
				          onClick={this.scrollToSection.bind( this )}/>
				</div>
				{parseSong( song, sections )}
			</div>
		);

	}
}

export default Sheet;

//-----------------------------------------------------

function parseSong( song, sections ) {

	let lines = song.contents;
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

