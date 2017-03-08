import React, { PropTypes } from 'react';
import {atomPropType} from '../../constants/atomPropType.js';
import {getTitleForAtom, getAtomEditorUrl, isAtomWorkshopEditable} from '../../util/atomDataExtractors';
import publishState from '../../util/publishState';
import format from 'date-fns/format';
import {Link} from 'react-router';

export default class AtomListItem extends React.Component {

    static propTypes = {
        config: PropTypes.shape({
            atomEditorUrls: PropTypes.shape({
                explainer: PropTypes.string,
                media: PropTypes.string
            })
        }),
        atom: atomPropType
    };

    getUserString = (changeRecord) => {
        if (!changeRecord || !changeRecord.user) return 'unknown';
        if (!changeRecord.user.firstName || !changeRecord.user.lastName) return changeRecord.user.email;
        return `${changeRecord.user.firstName} ${changeRecord.user.lastName}`;
    };

    getDateString = (changeRecord) => {
        if (!changeRecord) return 'unknown';
        const date = new Date(changeRecord.date);
        return format(date, 'DD/MM/YYYY HH:mm');
    };

    renderEditorLink = (atom) => {
        const title = getTitleForAtom(atom);
        if (isAtomWorkshopEditable(atom)) {
            return (
              <Link to={`/atoms/${atom.atomType}/${atom.id}/edit`}
                className="atom-list__link atom-list__editor-link"
                key={atom.id}>
                {title}
              </Link>
            );
        }

        return (
          <a target="_blank"
            href={getAtomEditorUrl(atom)}
            className="atom-list__link atom-list__editor-link">
            {title}
          </a>
        );
    };

    render () {
        return <tr className="atom-list__row" key={this.props.atom.id}>
            <td className="atom-list__item">
                {this.renderEditorLink(this.props.atom)}
            </td>
            <td className="atom-list__item">{this.props.atom.atomType}</td>
            <td className="atom-list__item">{this.getDateString(this.props.atom.contentChangeDetails.lastModified)}</td>
            <td className="atom-list__item">
                {this.getUserString(this.props.atom.contentChangeDetails.created)}
            </td>
            <td className="atom-list__item">{publishState(this.props.atom).text}</td>
            <td className="atom-list__item">
                <Link to={`/atoms/${this.props.atom.atomType}/${this.props.atom.id}/stats`} className="atom-list__link " key={this.props.atom.id}>
                    Atom stats
                </Link>
            </td>
        </tr>;
    }
}
