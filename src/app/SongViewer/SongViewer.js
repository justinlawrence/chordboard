import {Link} from 'react-router-dom';

import Song from 'app/common/Song';
import KeySelector from 'app/common/KeySelector';
import getKeyDiff from 'app/common/getKeyDiff';

import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";

import './SongViewer.scss';

class SongViewer extends PreactComponent {
	state = {
		song: null
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

		if ( props.currentKey && props.song && props.song.key &&
			props.currentKey !== props.song.key ) {

			// Calculate distance between keys
			this.changeKey( getKeyDiff( props.currentKey, props.song.key ) );

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

		const song = this.state.song;
		song.transpose( amount );

		console.log( amount );

		this.setState( { song } );

	};

	transposeDown = () => { this.changeKey( -1 ); };
	transposeUp = () => { this.changeKey( 1 ); };

	render( props, { song } ) {

		let sections = [];

		return (
			song ?
				<div>
					<section className="hero is-small">
						<div className="hero-body">
							<div className="container">
								<div className="columns is-vcentered">

									<div className="column is-half">
										<h1 className="title">
											{song.title}
										</h1>
										<h2 className="subtitle">
											{song.author}
										</h2>
									</div>

									<div className="column">

										<h2 className="subtitle">
											<KeySelector
												onSelect={( key, amount ) =>
													this.changeKey( amount )}
												value={song.key}/>
											{/*<a className="button">Key of {song.key}</a>*/}
											<a className="button" onClick={this.transposeDown} title="transpose down">
											<span className="icon is-small">
												 <i className="fa fa-minus"></i>
											</span>
											</a>
											<a className="button" onClick={this.transposeUp} title="transpose up">
											 <span className="icon is-small">
												 <i className="fa fa-plus"></i>
											</span>
											</a>

											<Link className="button" to={`/songs/${song._id}/edit`}>
												<span className="icon is-small"><i className="fa fa-pencil"/></span>
												<span>Edit Song</span>
											</Link>
										</h2>


									</div>

								</div>
							</div>
						</div>
					</section>


					<div className="columns">

						<div className="column is-three-quarters">
							<section className="section">

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
				children.push( <div className="empty-line"></div> );
				break;

			case 'line':
				children.push( <Line text={line.text}/> );
				break;

			case 'section':

				if ( section ) {

					// Finish off last section
					result.push(
						<section
							id={`section-${sectionIndex}`}
							className="section"
							data-section={section}
						>{children}</section>
					);
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
		                      className="section"
		                      data-section={section}>{children}</section> );

	}

	if ( children.length && !section ) {

		result = result.concat( children );

	}

	return result;

}
