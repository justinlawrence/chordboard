import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Sections from "./Sections.js";
import Song from 'app/common/Song.js';
import './SongViewer.scss';

PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SongViewer extends PreactComponent {
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

				console.error( 'SongViewer.handleProps -', err );

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
			<section class="section">
				<div class="container">
					<div class="columns">

						<div class="column is-three-quarters">

								<nav class="level">

									<div class="level-left">
										<div class="level-item">
											<p class="subtitle is-5">
												<strong>{song.title}</strong>
											</p>
											<div class="level-item">
												<p class="subtitle is-6">&nbsp;by {song.author}&nbsp;</p>
											</div>
										</div>
									</div>

									<div class="level-right">
										<div class="level-item">

											<a class="button" onClick={this.transposeDown}>
												 <span class="icon is-small">
			 						         <i class="fa fa-minus"></i>
			 						      </span>
										 	</a>
											<a class="button" onClick={this.transposeUp}>
												 <span class="icon is-small">
			 						         <i class="fa fa-plus"></i>
			 						      </span>
										 	</a>
										</div>
									</div>
								</nav>
								{parseSong( song, sections )}
						</div>
					</div>
				</div>
			</section>
				: null
		);

	}
}

// is-hidden-mobile
//											//<Sections sections={sections}
//										    onClick={this.scrollToSection.bind( this )}/>


export default SongViewer;

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
