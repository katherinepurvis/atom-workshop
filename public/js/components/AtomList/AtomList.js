import React from 'react';
import {Link} from 'react-router';

import {allAtomTypes} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard';


export class AtomList extends React.Component {

    render () {
        return (
            <div className="page__section">
                <h1 className="page__subheading">Atoms</h1>
                <div className="atom-list">
                    This is the atom list
                </div>
            </div>
        );
    }
}
