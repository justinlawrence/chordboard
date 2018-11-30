import React, {Component} from 'react';
import {isNil} from 'lodash';
import {Link} from 'react-router-dom';

import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ContentLimiter from '../../components/ContentLimiter';
import Hero from '../../components/Hero';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';

import slugify from 'slugify';

import {parseSong} from '../SongViewer/SongViewer.js';
import {db} from 'database';

import Song from '../common/Song.js';
import TextField from '@material-ui/core/TextField';
import Textarea from "react-textarea-autosize";
import chordproParser from 'app/parsers/chordpro-parser.js';
import Parser from 'app/parsers/song-parser.js';
import '../SongEditor/SongEditor.scss';

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
  },
  addPaddingBottom: {
    paddingBottom: theme.spacing.unit
  }
});

class SongEditor extends Component {
  state = {
    author: '',
    isLoading: false,
    title: '',
    key: '',
    content: '',
    parserType: 'chords-above-words',
    song: null
  };

  componentDidMount() {
    this.handleProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  handleParserChange = event => {
    this.setState({parserType: event.target.value});
  };

  handleProps = props => {
    this.setState({isLoading: true});

    if (props.id) {

      db.get(props.id).then(doc => {

        const song = new Song(doc);

        this.setState({
          author: song.author,
          isLoading: false,
          title: song.title,
          key: song.key,
          content: song.content,
          song: song
        });

      }).catch(err => {

        console.error('SongViewer.handleProps -', err);

        this.setState({
          author: '',
          isLoading: false,
          title: '',
          key: '',
          content: '',
          song: null
        });

      });

    }

  };

  onAuthorInput = event => {
    this.setState({author: event.target.value});
  };

  onContentInput = event => {
    const content = event.target.value;
    const song = Object.assign({}, this.state.song, {content});
    this.setState({content, song});
  };

  onTitleInput = event => {
    this.setState({title: event.target.value});
  };

  onKeyInput = event => {
    this.setState({key: event.target.value});
  };

  onDeleteSong = () => {

    if (confirm('Are you very sure you want to delete this song?')) {

      db.remove(this.state.song._id, this.state.song._rev).then(() => {

        if (this.props.history) {
          this.props.history.push({pathname: '/songs'});
        }

      }).catch(err => {

        alert('Unable to delete song');
        console.warn(err);

      });

    }
  };

  HandleCancel = () => {

    if (this.props.history) {
      this.props.history.goBack();
    }

  }

  onSaveSong = () => {

    const {author, parserType, title, key, song} = this.state;
    const isNew = !song || isNil(song._id);
    let content = this.state.content;

    if (parserType === 'chordpro') {

      content = chordproParser(content);

    }

    if (isNew) {

      db.post({
        type: 'song',
        users: ['justin'], //TODO
        slug: slugify(title),
        author: author,
        title: title,
        key: key,
        content: content
      }).then(() => {

        if (this.props.history) {
          this.props.history.goBack();
        }

      }).catch(err => {

        if (err.name === 'conflict') {

          console.error('SongEditor.onSaveSong: conflict -', err);

        } else {

          console.error('SongEditor.onSaveSong -', err);

        }

      });

    } else { //existing

      const data = Object.assign({}, song);

      data.author = author;
      data.content = content;
      data.slug = slugify(title);
      data.title = title;
      data.key = key;

      console.log('existing: id', song._id, 'rev', song._rev);
      console.log(this.props);
      db.put(data).then((data) => {

        this.setState({song: Object.assign({}, this.state.song, {_rev: data.rev})});

        //TODO: add toast updated message
        //alert( 'Updated successfully!' );

        if (this.props.history) {
          this.props.history.goBack();
        }

      }).catch(err => {

        if (err.name === 'conflict') {

          console.error('SongEditor.onSaveSong: conflict -', err);

        } else {

          console.error('SongEditor.onSaveSong -', err);

        }

      });

    }

  };

  render() {

    const {classes} = this.props;
    const {
      author,
      title,
      key,
      content,
      parserType,
      song
    } = this.state;

    const songCopy = Object.assign({}, song);

    if (parserType === 'chordpro') {

      songCopy.content = chordproParser(songCopy.content);

    }
    const parser = new Parser();
    const previewSong = parseSong(parser.parse(songCopy.content), []);

    return (
      <div className="song-editor">
        <Hero>
          <ContentLimiter>
            <Grid container className={classes.root} justify="space-between">

              <Grid item xs={12}>
                <Paper className={classes.form} component="form">

                  <Grid container className={classes.root} justify="space-between">

                    <Grid item xs={12}>

                      <TextField
                        id="title"
                        label="Song title"
                        className={classes.textField}
                        fullWidth
                        value={title}
                        onChange={this.onTitleInput}
                        margin="normal"/>

                    </Grid>
                    <Grid item xs={12}>

                      <TextField
                        id="author"
                        label="Authors (comma separated)"
                        className={classes.textField}
                        fullWidth
                        value={author}
                        onChange={this.onAuthorInput}
                        margin="normal"/>

                    </Grid>
                    <Grid item xs={12}>

                      <TextField id="key" label="Key" className={classes.textField} fullWidth value={key} onChange={this.onKeyInput} margin="normal"/>

                    </Grid>
                    <Grid item xs={4}>

                      <select onChange={this.handleParserChange} value={this.state.parserType}>
                        <option value="chords-above-words">
                          Chords above words
                        </option>
                        <option value="chordpro">Onsong</option>
                      </select>

                    </Grid>
                    <Grid item xs={8}>
                      <Grid container justify="flex-end">

                        <Button onClick={this.onDeleteSong} color="primary">
                          Delete
                        </Button>

                        <Button onClick={this.HandleCancel}>
                          Cancel
                        </Button>

                        <Button onClick={this.onSaveSong} color="primary" variant="contained">
                          Save
                        </Button>

                      </Grid>
                    </Grid>

                  </Grid>

                </Paper>
              </Grid>

            </Grid>

          </ContentLimiter>
        </Hero>

        <Hero>
          <ContentLimiter>

            <Grid container className={classes.root} justify="center" hide="xsDown">

              <Grid item xs={12} sm={8}>
                              <Typography variant="caption" className={classes.addPaddingBottom}>
                                  Editor
                              </Typography>
                {/* TODO: DELETE this if the textarea below is working nicely <textarea className="textarea song-editor__content" onInput={this.onContentInput} placeholder="Type words and chords here. Add colons after section headings eg. Verse 1:" value={content} rows="25"></textarea> */}
                <Textarea className="textarea song-editor__content" onInput={this.onContentInput} placeholder="Type words and chords here. Add colons after section headings eg. Verse 1:" value={content} />
              </Grid>

              <Grid item sm={4}>

                <Grid container className={classes.root} justify="space-between">

                  <Grid item xs={12}>
                                      <Typography variant="caption" className={classes.addPaddingBottom}>
                                          Song Preview
                                      </Typography>

                    <Paper>

                      <div className="song-editor__preview">

                        <h1 className="title">
                          {title}
                        </h1>
                        <h2 className="subtitle">
                          {author}
                        </h2>

                        <div className="song-editor__preview-content">
                          {previewSong}
                        </div>

                      </div>
                    </Paper>
                                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </ContentLimiter>
        </Hero>
      </div>
    );

  }
}

export default withStyles(styles)(SongEditor);
