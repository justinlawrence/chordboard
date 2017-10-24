import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import Song from 'app/common/Song.js';
import './SongViewer.scss';
import {Link} from 'react-router-dom';

class SongViewer extends PreactComponent {
	state = {
		song:      null
	};

	componentDidMount() {
		this.handleProps( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	handleProps = props => {

		if ( props.song ) {

			this.setState( {
				song: new Song( props.song )
			} );

		}

		if ( props.currentKey ) {

			// TODO: Set song transpose with key
			// `props.currentKey` is the overridden key from the set list
			// need to figure out the difference in keys in an integer value to
			// pass onto the changeKey method.
			// this.changeKey( ? );

		}

	};

	editCurrentSong = () => {

		//const url = Router.getCurrentUrl();
		//Router.route( `${url}/edit` );

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

		const song = this.state.song;
		song.transpose( amount );

		this.setState( { song } );

	};

	transposeDown = () => { this.changeKey( -1 ); };
	transposeUp = () => { this.changeKey( 1 ); };

	render( { currentKey }, { song } ) {

		let sections = [];

		return (
			song ?
			<div>

				<section class="hero is-small is-light">
					<div class="hero-body">
						<div class="container">
							<div class="columns is-vcentered">

								<div class="column is-half">
									<h1 class="title">
										{song.title}
									</h1>
									<h2 class="subtitle">
										{song.author}
									</h2>
								</div>

								<div class="column">

									<h2 class="subtitle">
										<a class="button">Key of {song.key}</a>
										<a class="button" onClick={this.transposeDown} title="transpose down">
											<span class="icon is-small">
												 <i class="fa fa-minus"></i>
											</span>
										</a>
										<a class="button" onClick={this.transposeUp} title="transpose up">
											 <span class="icon is-small">
												 <i class="fa fa-plus"></i>
											</span>
										</a>

										<Link class="button" to={`/songs/${song._id}/edit`}>
											<span class="icon is-small">
												<i class="fa fa-pencil"></i>
										 </span>
										 <span>
										 Edit Song
									 </span>
								 </Link>
									</h2>


								</div>

							</div>
						</div>
					</div>
				</section>


				<div class="columns">

					<div class="column is-three-quarters">
						<section class="section">

						{parseSong( song, sections )}

						</section>
					</div>

				</div>
			</div>
				: null
		);

	}
}

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
