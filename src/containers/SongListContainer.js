import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import reduce from 'lodash/fp/reduce';

import SongList from '../components/SongList';

import * as actions from '../actions';

class SongListContainer extends PureComponent {
    render() {
        return (
            <SongList {...this.props}/>
        )
    }
}

const mapStateToProps = state => ({
    songs: reduce( ( acc, song ) => {
        acc.push(song);
        return acc;
    })( [] )( state.song.byId )
});

export default connect(mapStateToProps, actions)( SongListContainer );
