import {fetchPageData, getByPath} from '../../services/capi';
import {logError} from '../../util/logger';
import {updateAtom} from "./updateAtom";


export function getAudioPageData (url, atom) {
  const path = new URL(url).pathname;
  const pathNoLeadingSlash = path.substring(1);

  return dispatch => {
    dispatch(requestAudioPageData());
    return getByPath(pathNoLeadingSlash)
      .then(res => {
        dispatch(receiveAudioPageData(res));
        const updatedAtom = addDataToAtom(res, atom);
        dispatch(updateAtom(updatedAtom));
        return res;
      })
      .catch(error => dispatch(errorReceivingAudioPageData(error)))
  }
}

function extractFields (audioPage) {
  let audioEl = audioPage.elements.find(el => el.type === "audio");
  let seriesTag = audioPage.tags.find(tag => tag.type === "series" && tag.podcast);
  let audioAsset = audioEl.assets.find(asset => asset.type === "audio");
  let storyImage = audioPage.fields.thumbnail || "";

  let durationSeconds = audioAsset ? parseInt(audioAsset.typeData.durationMinutes) * 60 + parseInt(audioAsset.typeData.durationSeconds) : 0;
  let trackUrl = audioAsset ? audioAsset.file : "";
  let contentId = audioEl ? audioEl.id : "";

  // subscription links are optional
  var subscriptionLinks = {};
  if (seriesTag) {
    let {subscriptionUrl, googlePodcastsUrl, spotifyUrl} = seriesTag.podcast;
    subscriptionLinks = {
      apple: subscriptionUrl,
      google: googlePodcastsUrl,
      spotify: spotifyUrl
    }
  }

  return {
    contentId,
    trackUrl,
    duration: durationSeconds,
    kicker: seriesTag.webTitle,
    coverUrl: storyImage,
    subscriptionLinks
  }
}

function addDataToAtom (audioPage, atom) {
  let {contentId, trackUrl, duration, kicker, coverUrl, subscriptionLinks} = extractFields(audioPage);
  let atomData = {
    data: {
      audio: {
        kicker,
        contentId,
        duration,
        trackUrl,
        subscriptionLinks,
        coverUrl,
      }
    }
  };
  return Object.assign({}, atom, atomData);
}

function requestAudioPageData () {
  return {
    type: 'REQUEST_AUDIO_PAGE_DATA',
    audioPageUrl: ''
  }
}

function receiveAudioPageData (content) {
  return {
    type: 'RECEIVE_AUDIO_PAGE_DATA',
    audioPageData: { content },
    message: `You selected: ${content.webTitle}`
  }
}

function errorReceivingAudioPageData (error) {
  logError(error);
  return {
    type: 'ERROR_RECEIVING_AUDIO_PAGE_DATA',
    message: 'Could not get data from the url above, please double check it or report the problem',
    error: `${error.status}: ${error.statusText}`
  }
}