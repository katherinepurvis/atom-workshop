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
  let {subscriptionUrl, googlePodcastsUrl, spotifyUrl} = seriesTag.podcast;
  let durationSeconds = parseInt(audioEl.assets[0].typeData.durationMinutes) * 60 + parseInt(audioEl.assets[0].typeData.durationSeconds);

  return {
    contentId: audioEl.id,
    trackUrl: audioEl.assets[0].file,
    duration: durationSeconds,
    kicker: seriesTag.webTitle,
    subscriptionLinks: {
      apple: subscriptionUrl,
      google: googlePodcastsUrl,
      spotify: spotifyUrl
    }
  }
}

function addDataToAtom (audioPage, atom) {
  let {contentId, trackUrl, duration, kicker, subscriptionLinks} = extractFields(audioPage);
  let atomData = {
    data: {
      audio: {
        kicker,
        contentId,
        duration,
        trackUrl,
        subscriptionLinks,
        coverUrl: "https://uploads.guim.co.uk/2018/10/18/Podcast_ident_3000px.jpg",
      }
    }
  };
  let newAtom = Object.assign({}, atom, atomData);
  return newAtom;
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