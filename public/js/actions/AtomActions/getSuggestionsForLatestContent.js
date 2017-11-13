import {getTagsForContent} from '../../services/capi';
import {mostViewed} from '../../services/ophan';
import {fetchTargetsForTags} from '../../services/TargetingApi';
import AtomsApi from '../../services/AtomsApi';
import {atomPropType} from '../../constants/atomPropType.js';
import {logError} from '../../util/logger';
import {PropTypes} from 'react';

function requestSuggestionsForLatestContent() {
  return {
    type:       'SUGGESTIONS_FOR_LATEST_CONTENT_REQUEST',
    receivedAt: Date.now()
  };
}

function receiveSuggestionsForLatestContent(suggestionsForLatestContent) {
  return {
    type:       'SUGGESTIONS_FOR_LATEST_CONTENT_RECEIVE',
    suggestionsForLatestContent,
    receivedAt: Date.now()
  };
}

function errorReceivingSuggestionsForLatestContent(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get suggests for latest content',
    error:      error,
    receivedAt: Date.now()
  };
}

const distinct = array => array.filter((value, index, self) => self.indexOf(value) === index);
const flatten = array => [].concat.apply([], array);

//Returns an array of target atom urls for the given tags
function getTargetUrls(tags) {
  const tagIds = tags.filter(tag => tag.type === "keyword").map(tag => tag.id);

  return fetchTargetsForTags(tagIds).then(targets => {
    const filtered = targets.filter(target => target.url.includes("/atom/"));
    return filtered.map(target => target.url);
  });
}

const AllSnippets = ["guide","qanda","timeline","profile"];
function isSnippet(atomType) {
  return AllSnippets.indexOf(atomType.toLowerCase()) >= 0;
}

//Deduplicate the targeting urls across all content, and retrieve the atoms
function getAtomUrlToAtom(contentArrayWithAtomUrls) {
  const atomUrls = distinct(flatten(contentArrayWithAtomUrls.map(item => item.atomUrls)));

  return Promise.all(atomUrls.map(getAtomFromTargetUrl)).then(atoms => {
    const atomUrlToAtom = {};
    atoms.forEach(atom => {
      if (isSnippet(atom.atomType)) atomUrlToAtom[atom.url] = atom;
    });
    return atomUrlToAtom;
  });
}

function getAtomFromTargetUrl(url) {
  // the path has the form: /atoms/<type>/<id>
  const tokens = url.split('/');
  const atomType = tokens[tokens.length-2];
  const atomId = tokens[tokens.length-1];

  return AtomsApi.getAtom(atomType, atomId)
    .then(res => res.json()).then(atom => {
      atom.url = url;
      return atom;
    });
}

export const SuggestedAtomsPropType = PropTypes.shape({
  contentId: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  internalComposerCode: PropTypes.string.isRequired,
  atoms: PropTypes.arrayOf(atomPropType).isRequired
});

const skipChars = "https://www.theguardian.com/".length;

/**
 * Returns an array of SuggestedAtomsPropType, which maps content
 * to suggested snippet atoms.
 * The content is taken from ophan's most-viewed list.
 */
export function getSuggestionsForLatestContent() {
  return dispatch => {
    dispatch(requestSuggestionsForLatestContent());

    return mostViewed()
      .then(mostViewedContent =>
        Promise.all(mostViewedContent.map(content => getTagsForContent(content.url.slice(skipChars))))
      )
      //Filter out any articles that already contain a snippet atom
      .then(contentArray => contentArray.filter(content => !content.atoms || content.atoms.length === 0))
      .then(contentArray => {
        return Promise.all(contentArray.map(content => {
          return getTargetUrls(content.tags).then(urls => {
            return {
              contentId: content.id,
              headline: content.fields.headline,
              internalComposerCode: content.fields.internalComposerCode,
              atomUrls: urls
            };
          });
        }));
      })
      .then(contentArrayWithAtomUrls => {
        return getAtomUrlToAtom(contentArrayWithAtomUrls).then(urlToAtom => {
          //Resolve the atomUrls to the actual atoms
          return contentArrayWithAtomUrls.map(item => {
            item.atoms = item.atomUrls.map(url => urlToAtom[url]).filter(atom => atom !== undefined);
            return item;
          });
        });
      })
      .then(results => dispatch(receiveSuggestionsForLatestContent(results)))
      .catch(error => {
        dispatch(errorReceivingSuggestionsForLatestContent(error));
      });
  };
}
