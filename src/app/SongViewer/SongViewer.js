import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { Sets, sync } from 'app/common/database';
import Song from 'app/common/Song';
import KeySelector from 'app/common/KeySelector';
import getKeyDiff from 'app/common/getKeyDiff';

import ChordLine from "./lines/ChordLine.js";
import ChordPair from "./lines/ChordPair.js";
import Line from "./lines/Line.js";
import './SongViewer.scss';

class SongViewer extends Component {
	state = {
		isSetListDropdownVisible: false,
		setList:                  [],
		song:                     null
	};

	componentDidMount() {

		// Update an initial list when the component mounts.
		this.updateListOfSets();

		//Set the page title to the song title
		document.title = this.props.song.title;

		// Listen for any changes on the database.
		sync.on( "change", () => this.updateListOfSets() );

		this.handleProps( this.props );

	}

	componentWillReceiveProps( nextProps ) {
		this.handleProps( nextProps );
	}

	addToSet = set => Sets.addSongToSet( set._id, this.props.song );

	handleProps = props => {

		if ( props.song ) {

			this.setState( {
				song: new Song( props.song )
			} );

		}

		if ( props.currentKey && props.song && props.song.key &&
			props.currentKey !== props.song.key ) {

			// Calculate distance between keys
			this.changeKey( getKeyDiff( props.song.key, props.currentKey ) );

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

		this.setState( { song } );

	};


	setListDropdownHide = () => this.setState( { isSetListDropdownVisible: false } );
	setListDropdownShow = () => this.setState( { isSetListDropdownVisible: true } );
	setListDropdownToggle = () => this.state.isSetListDropdownVisible ?
		this.setListDropdownHide() : this.setListDropdownShow();

	transposeDown = () => { this.changeKey( -1 ); };
	transposeUp = () => { this.changeKey( 1 ); };

	updateListOfSets = () => Sets.getAll().then( setList => this.setState( { setList } ) );

	render() {

		const { isSetListDropdownVisible, setList, song } = this.state;

		let sections = [];

		return (
			song ?
				<div className="song-viewer">
					<section className="hero is-small is-light">
						<div className="hero-body">
							<div className="container">
								<div className="columns is-vcentered">

									<div className="column">
										<p className="title">
											{song.title}
										</p>
										<h2 className="subtitle">
											{song.author}
										</h2>
									</div>

									<div className="column no-print">


										{/*<a className="button">Key of {song.key}</a>*/}

										<div className="field has-addons">
											<p className="control">

												<a className="button" onClick={this.transposeDown}
												   title="transpose down">
														<span className="icon is-small">
															 <i className="fa fa-minus"/>
														</span>
												</a>

											</p>
											<p className="control">

												<KeySelector
													onSelect={( key, amount ) =>
														this.changeKey( amount )}
													value={song.key}/>
											</p>

											<p className="control">
												<a className="button" onClick={this.transposeUp}
												   title="transpose up">
														<span className="icon is-small">
														 <i className="fa fa-plus"/>
														</span>
												</a>
											</p>

											<p className="control">
												<Link className="button"
												      to={`/songs/${song._id}/edit`}>
													<span className="icon is-small"><i
														className="fa fa-pencil"/></span>
													<span>Edit Song</span>
												</Link>
											</p>

											<p className="control">
												<div className={cx(
													'dropdown',
													{ 'is-active': isSetListDropdownVisible }
												)}>
													<div className="dropdown-trigger"
													     onClick={this.setListDropdownToggle}>
														<button className="button"
														        aria-haspopup="true"
														        aria-controls="dropdown-menu">
															<span className="icon is-small">
																<i className="fa fa-plus-square-o"/>
															</span>
															<span>Add to set</span>
															<span className="icon is-small">
													            <i className="fa fa-angle-down"
													               aria-hidden="true"/>
													        </span>
														</button>
													</div>
													<div className="dropdown-menu"
													     id="set-list-dropdown-menu"
													     onClick={this.setListDropdownHide}
													     role="menu"
													>
														<div className="dropdown-content">
															{setList.map( set => (
																<a className="dropdown-item"
																   key={set._id}
																   onClick={() => this.addToSet( set )}>
																	{set.title}
																</a>
															) )}
														</div>
													</div>
												</div>
											</p>

										</div>

									</div>

								</div>
							</div>
						</div>
					</section>

					<section className="section">
						<div className="container">
							<div className="song-viewer__song">
								{parseSong( song, sections )}
							</div>
						</div>
					</section>
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
				children.push( <ChordLine key={i} chords={line.chords}/> );
				break;

			case 'chord-pair':
				children.push(
					<ChordPair key={i} chords={line.chords} text={line.text}/> );
				break;

			case 'empty':
				children.push( <div key={i} className="empty-line"/> );
				break;

			case 'line':
				children.push( <Line key={i} text={line.text}/> );
				break;

			case 'section':

				if ( section ) {

					// Finish off last section
					result.push(
						<section
							id={`section-${sectionIndex}`}
							key={`section-${sectionIndex}`}
							className="song-viewer__section"
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
		                      key={`section-${sectionIndex}`}
		                      className="song-viewer__section"
		                      data-section={section}>{children}</section> );

	}

	if ( children.length && !section ) {

		result = result.concat( children );

	}

	return result;

}
