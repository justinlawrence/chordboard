import {h, Component} from 'preact';
require( './sheet.scss' );

class Sheet extends Component {
	constructor( props ) {
		super( props );

		this.songs = requireAll( require.context( '../songs', false, /\.txt$/ ) );
		this.currentIndex = 0;

	}

	render() {

		return (
			<div>HELLO</div>
		);

	}
}

export default Sheet;

/*
var songs = requireAll( require.context( '../songs', false, /\.txt$/ ) );
var currentIndex = 0;
var prevButton = document.querySelector( ".prev-button" );
var nextButton = document.querySelector( ".next-button" );

prevButton.addEventListener( "click", function () {

	currentIndex--;
	currentIndex = Math.max( 0, currentIndex );

	parseSong( songs[ currentIndex ] );

} );

nextButton.addEventListener( "click", function () {

	currentIndex++;
	currentIndex = Math.min( songs.length - 1, currentIndex );

	parseSong( songs[ currentIndex ] );

} );

parseSong( songs[ currentIndex ] );*/

//-----------------------------------------------------

function parseSong( song ) {

	var lines = parseLines( song );
	var sheetElement = document.getElementById( "sheet" );
	var html = "";
	var sections = [];
	var section = "";
	var sectionIndex = 0;

	for ( var i = 0; i < lines.length; i++ ) {

		var line = lines[ i ];

		switch ( lines[ i ].type ) {

			case "chord-line":
				html += buildChordLine( line );
				break;

			case "chord-pair":
				html += buildChordPair( line );
				break;

			case "empty":
				html += buildEmptyLine();
				break;

			case "line":
				html += buildLine( line );
				break;

			case "section":

				if ( section ) {
					html += "</section>";
				}

				section = line.text;
				sections.push( {
					title: line.text,
					index: sectionIndex
				} );

				html += '<section id="section-' + sectionIndex + '" class="section" data-section="' + line.text + '">';
				//html += buildSectionTitle( line );

				sectionIndex++;

				break;

			case "title":
				html += buildTitle( line );
				html += '<div id="sections"></div>';
				break;

		}

	}

	if ( section ) {
		html += "</section>";
	}

	sheetElement.innerHTML = html;

	renderSections( sections );

}

function parseLines( input ) {

	var ENDS_WITH_COLON = /:$/;
	var SQUARE_BRACKET = /^\[(.*)\]$/;
	var lines = input.split( "\n" );
	var prevLine = "";
	var output = [];

	for ( var i = 0; i < lines.length; i++ ) {

		var line = lines[ i ];

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

	var output = input.replace(
		/(\s|[A-G](#|b)?m?|(sus|maj|min|aug|dim|add)\d?|\/|-|\|)/g,
		"" );

	return !(output);

}

function buildChordLine( line ) {

	return '<div class="chord-line">' + line.text + '</div>';

}

function buildChordPair( line ) {

	var WORD_INDEX = /\b[A-G]/g;
	var result;
	var html = "";
	var chords = line.chords.replace( /\s+/g, " " ).split( " " );

	var indices = [];
	while ( (result = WORD_INDEX.exec( line.chords )) ) {

		indices.push( result.index );

	}

	// If the first index is not zero, then the first chord starts in the
	// middle of the line. So prepend a zero to keep text structure.
	if ( indices[ 0 ] !== 0 ) {

		indices.unshift( 0 );

	}

	html += '<div class="chord-pair">';

	for ( var i = 0; i < indices.length; i++ ) {

		var index = indices[ i ];
		var nextIndex = indices[ i + 1 ] || Infinity;
		var slice = line.text.slice( index, nextIndex );

		html += '<span class="text-line" data-content="' + chords[ i ] + '">' + slice + '</span>';

	}

	html += "</div>";

	return html;

}

function buildEmptyLine() {

	return '<div class="empty-line"></div>';

}

function buildLine( line ) {

	return '<div class="text-line">' + line.text + '</div>';

}

function buildSectionTitle( line ) {

	return '<div class="section-title" >' + line.text + '</div>';

}

function buildTitle( line ) {

	return '<div class="title">' + line.text +
		'<span class="artist">' + line.artist + '</span>' +
		'</div>';

}

function renderSections( sections ) {

	var containerElement = document.getElementById( "sections" );

	sections.forEach( function ( section, index ) {

		var element = document.createElement( "a" );
		element.innerText = section.title;
		element.addEventListener( "click", function () {

			scrollToSection( section );

		} );

		containerElement.appendChild( element );

		if ( index < sections.length - 1 ) {

			var separator = document.createElement( "span" );
			separator.innerHTML = "&middot;"
			separator.className = "separator";
			containerElement.appendChild( separator );

		}

	} );

}

function requireAll( requireContext ) {

	return requireContext.keys().map( requireContext );

}

function scrollToSection( section ) {

	var totalVertPadding = 32;
	var headerHeight = 92;

	location.href = "#";
	location.href = "#section-" + section.index;

	var scrollBottom = window.innerHeight - document.body.scrollTop + totalVertPadding;

	if ( headerHeight < scrollBottom ) {

		// Go back 92 pixels to offset the header.
		window.scrollBy( 0, -headerHeight );

	}

}

