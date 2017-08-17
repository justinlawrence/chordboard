import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Sections from "./Sections.js";
import Song from 'app/common/Song.js';
import Title from "./lines/Title.js";
import './Sheet.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class Sheet extends PreactComponent {
	state = {
		isLoading: true,
		song: null
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		this.setState( {
			isLoading: true
		});

		if ( props.slug ) {

			db.find( {
				selector: {
					type:  'song',
					slug: props.slug
				}
			} ).then( result => {

				this.setState( {
					isLoading: false,
					song: new Song( result.docs[ 0 ] )
				} );

			} ).catch( err => {

				console.error( 'Sheet.handleProps -', err );

				this.setState( {
					isLoading: false,
					song:      null
				} );

			} );

		}

	};

	scrollToSection( section ) {

		let totalVertPadding = 32;
		let headerHeight = 92;

		location.href = '#';
		location.href = '#section-' + section.index;

		let scrollBottom = window.innerHeight - document.body.scrollTop + totalVertPadding;

		if ( headerHeight < scrollBottom ) {

			// Go back 92 pixels to offset the header.
			window.scrollBy( 0, -headerHeight );

		}

	}

	changeKey = amount => {

		this.state.song.transpose( amount );
		this.forceUpdate();

	};

	transposeDown = () => { this.changeKey( -1 ); };
	transposeUp = () => { this.changeKey( 1 ); };

	render( {}, { song } ) {

		let sections = [];

		return (
			song ?
				<div class="sheet">
					<div class="sheet-header">
						<Title text={song.title} author={song.author}/>
						<Sections sections={sections}
					    onClick={this.scrollToSection.bind( this )}/>

						<button onClick={this.transposeDown}>-</button>
						<button onClick={this.transposeUp}>+</button>

					</div>
					{parseSong( song, sections )}
				</div>
				: null
		);

	}
}

export default Sheet;

//-----------------------------------------------------

export function parseSong( song, sections ) {

	let lines = song.lines;
	let children = [];
	let result = [];
	let section = '';
	let sectionIndex = 0;

	for ( let i = 0; i < lines.length; i++ ) {

		let line = lines[ i ];

		switch ( lines[ i ].type ) {

			case 'chord-line':
				children.push( <ChordLine chords={line.chords}/> );
				break;

			case 'chord-pair':
				children.push(
					<ChordPair chords={line.chords} text={line.text}/> );
				break;

			case 'empty':
				children.push( <div class="empty-line"></div> );
				break;

			case 'line':
				children.push( <Line text={line.text}/> );
				break;

			case 'section':

				if ( section ) {

					// Finish off last section
					result.push( <section id={`section-${sectionIndex}`}
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

		result.push( <section id={`section-${sectionIndex}`}
		                      class="section"
		                      data-section={section}>{children}</section> );

	}

	if ( children.length && !section ) {

		result = result.concat( children );

	}

	return result;

}
