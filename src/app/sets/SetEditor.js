/*
#
#
#
#
#
#
#
#
#   Most of this functionality has been merged into setviewer
#		TOD: move across the song.create
#
#
#
#
#
#
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import slugify from 'slugify';
import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

import Button from '@material-ui/core/Button';
import ContentLimiter from '../../components/ContentLimiter';
import Hero from '../../components/Hero';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  form: theme.mixins.gutters({
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  }),
  formFooter: {
    marginTop: theme.spacing.unit * 2
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});


PouchDB.plugin( PouchDBFindPlugin );

const db = new PouchDB( 'chordboard' );

db.createIndex( {
	index: { fields: [ 'type', 'slug' ] }
} );

class SetEditor extends Component {
	state = {
		title: '',
		setDate: ''
	};

	onTitleInput = event => {
		this.setState( { title: event.target.value } );
	};

	onSetDateInput = event => {
		this.setState( { setDate: event.target.value } );
	};

	onSaveSet = () => {

		const { user } = this.props;
		const { title } = this.state;
		const { setDate } = this.state;

		db.post( {
			type: 'set',
			author: user.name,
			slug: slugify( title ),
			title: title,
			setDate: setDate,
			songs: []
		} ).then( doc => {

			PouchDB.sync( 'chordboard',
				'https://justinlawrence:cXcmbbLFO8@couchdb.cloudno.de/chordboard' );

			if ( this.props.history ) {
				this.props.history.push( {
					pathname: `/sets/${doc.id}`
				} );
			}

		} );

	};

	render() {

		const {classes} = this.props;
		const { title, setDate } = this.state;

		return (
			<div className="set-editor">

				<Hero>
					<ContentLimiter>

            <Paper className={classes.form} component="form">

						<div className="columns">
							<div className="column is-three-quarters">
								<div className="field">
									<p className="control has-icons-left">

											<TextField
	                      id="title"
	                      label="Set title"
	                      className={classes.textField}
	                      fullWidth="fullWidth"
	                      value={title}
	                      onChange={this.onTitleInput}
	                      margin="normal"/>


									</p>
								</div>
								<div className="field">
									<p className="control has-icons-left">

                      <TextField
                        id="date"
                        label="Set date"
                        type="date"
                        className={classes.textField}
                        fullWidth
                        onChange={this.onSetDateInput}
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={setDate}
                      />



									</p>
								</div>
							</div>

							<Button onClick={this.onSaveSet} color="primary" variant="contained">
								Save
							</Button>

						</div>
          </Paper>
				</ContentLimiter>
			</Hero>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect( mapStateToProps )( withStyles(styles)(SetEditor) );
